import Progress from "@/components/progress";
import { IOption, IQuiz } from "@/interfaces";
import { IQuestion } from "@/interfaces/questions.interface";
import { useAppDispatch } from "@/modules/redux";
import {
  answerQuestion,
  setQuizResult,
} from "@/modules/redux/slices/app.slice";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";

interface IProps {
  quiz: IQuiz;
}

const Quiz = ({ quiz }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number;
  }>({});
  const [questionResult, setQuestionResult] = useState<IQuestion>();
  const [currentQuizResult, setCurrentQuizResult] = useState<IQuiz>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion>();
  const [optionMatch, setOptionMatch] = useState<IOption>();
  useEffect(() => {
    setCurrentQuizResult(quiz);
  }, [quiz]);
  useEffect(() => {
    if (quiz.questions?.length) {
      setCurrentQuestion(quiz.questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, quiz]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setCurrentQuizResult((prevQuizResult) => {
      return {
        ...prevQuizResult!,
        questions: [
          ...prevQuizResult!.questions!.filter(
            (x) => x.id !== questionResult?.id
          ),
          {
            ...questionResult!,
          },
        ],
      };
    });
  };

  const handleFinished = () => {
    dispatch(
      setQuizResult({
        ...currentQuizResult,
        questions: [
          ...currentQuizResult!.questions!.filter(
            (x) => x.id !== questionResult?.id
          ),
          {
            ...questionResult!,
          },
        ],
      })
    );
    router.push(`./${quiz.code}/summary`);
  };

  const handleOptionChange = async (questionId: number, option: IOption) => {
    const { id: optionId } = option;

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: optionId,
    }));

    const response = await dispatch(
      answerQuestion({
        optionId,
        questionId,
        quizId: quiz.id,
      })
    ).unwrap();

    setOptionMatch(response.detail);
    const newData = response.result
      ? [
          {
            ...response.detail,
            selected: true,
            match: true,
          },
        ]
      : [
          {
            ...option,
            selected: true,
            match: false,
          },
          {
            ...response.detail,
            selected: false,
            match: true,
          },
        ];

    setQuestionResult({
      ...currentQuestion!,
      options: [
        ...currentQuestion!.options!.filter(
          (x) => ![option.id, response.detail.id].includes(x.id)
        ),
        ...newData,
      ],
    });
  };

  const actions = useMemo(() => {
    return (
      <div className="mt-6 flex justify-end">
        {currentQuestion && selectedOptions[currentQuestion.id] && (
          <>
            {quiz.questions?.every(
              (question) => selectedOptions[question.id]
            ) ? (
              <button
                className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={handleFinished}
              >
                Finish Quiz
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleNextQuestion}
                disabled={
                  !!(
                    quiz.questions?.length &&
                    currentQuestionIndex === quiz.questions?.length - 1
                  )
                }
              >
                Next
              </button>
            )}
          </>
        )}
      </div>
    );
  }, [
    quiz,
    currentQuestionIndex,
    selectedOptions,
    currentQuestion,
    handleFinished,
    handleNextQuestion,
  ]);

  return (
    <div className="container">
      <Progress
        className="m3-2"
        title={
          <h1 className="text-3xl font-bold mb-4 text-quiz-secondary">
            {quiz.title}
          </h1>
        }
        step={currentQuestionIndex + 1}
        totalStep={quiz.questions?.length ?? 0}
        key={1}
      />
      <p className="mb-6 text-quiz-primary">{quiz.description}</p>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mb-2 text-quiz-primary">
            {currentQuestion?.code}
          </h2>
          <svg
            aria-placeholder="hint"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 shrink-0 w-6 h-6 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-tooltip-id="hint-tooltip"
            // data-tooltip-content={currentQuestion?.hint}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
            <path d="M12 9h.01"></path>
            <path d="M11 12h1v4h1"></path>
          </svg>
          <Tooltip id="hint-tooltip" style={{ maxWidth: "50%" }}>
            <p className="text-balance">{currentQuestion?.hint}</p>
          </Tooltip>
        </div>
        <p className="mb-4 text-quiz-primary">{currentQuestion?.text}</p>
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion?.options?.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                disabled={!!selectedOptions[currentQuestion.id]}
                // type="checkbox"
                name={currentQuestion.code}
                type="radio"
                id={`option_${currentQuestion.code}_${option.code}`}
                onChange={() => handleOptionChange(currentQuestion.id, option)}
                checked={
                  selectedOptions[currentQuestion.id] === option.id || false
                }
              />
              <label
                htmlFor={`option_${currentQuestion.code}_${option.code}`}
                className={`ml-2 ${
                  option.id === optionMatch?.id
                    ? "text-quiz-pass font-semibold"
                    : option.id === selectedOptions[currentQuestion.id]
                    ? "text-quiz-fail font-semibold"
                    : "text-quiz-primary"
                }`}
              >
                {option.text}
              </label>
            </div>
          ))}
        </div>
      </div>
      {actions}
    </div>
  );
};
export default Quiz;