import Modal from "@/components/modal";
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
    [key: number]: Array<number>;
  }>({});
  const [currentQuizResult, setCurrentQuizResult] = useState<IQuiz>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion>();
  const [optionResult, setOptionResult] = useState<boolean>(true);
  const [isShowEndPopup, setIsShowEndPopup] = useState<boolean>();
  useEffect(() => {
    setCurrentQuizResult(quiz);
  }, [quiz]);

  useEffect(() => {
    if (quiz.questions?.length) {
      setCurrentQuestion(
        quiz.questions[
          Math.min(currentQuestionIndex, quiz.questions.length - 1)
        ]
      );
    }
  }, [currentQuestionIndex, quiz]);

  const handleFinished = () => {
    dispatch(
      setQuizResult({
        ...currentQuizResult,
      })
    );
    router.push(`/quizzes/${quiz.code}/summary`);
  };

  const handleOptionChange = async (
    questionId: number,
    option: IOption,
    e: any
  ) => {
    const { id: optionId } = option;
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questionId]: Array.from(
        new Set([...(prevSelectedOptions[questionId] ?? []), optionId])
      ).slice(currentQuestion!.maxOptionCanSelected * -1),
    }));
  };

  const submitQuestion = async () => {
    const questionId = currentQuestion!.id;
    const maxOptionCanSelected = currentQuestion!.maxOptionCanSelected;
    if ((selectedOptions[questionId]?.length ?? 0) < maxOptionCanSelected)
      return;

    const response = await dispatch(
      answerQuestion({
        optionIds: [...(selectedOptions[questionId] ?? [])],
        questionId,
        quizId: quiz.id,
      })
    ).unwrap();
    setOptionResult(response.result);
    if (response.result) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCurrentQuizResult((prevQuizResult) => {
        return {
          ...prevQuizResult!,
          questions: [
            ...prevQuizResult!.questions!.filter((q) => q.id !== questionId),
            {
              ...currentQuestion!,
              options: currentQuestion!.options.map((o) => ({
                ...o,
                selected: selectedOptions[questionId].includes(o.id),
              })),
            },
          ],
        };
      });
    }
  };

  const onBack = () => {
    if (currentQuestionIndex === 0) {
      setIsShowEndPopup(true);
      return;
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const actions = useMemo(() => {
    return (
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Back
        </button>
        {optionResult !== false &&
          currentQuestionIndex !== quiz.questions?.length && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={submitQuestion}
            >
              Next
            </button>
          )}
        {optionResult == false && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            disabled={
              !!(
                quiz.questions?.length &&
                currentQuestionIndex === quiz.questions?.length - 1
              )
            }
          >
            End Quiz
          </button>
        )}
        {optionResult === true &&
          currentQuestionIndex >= quiz.questions!.length && (
            <button
              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleFinished}
            >
              Finish Quiz
            </button>
          )}
      </div>
    );
  }, [
    quiz,
    currentQuestionIndex,
    selectedOptions,
    currentQuestion,
    handleFinished,
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
            className="ml-2 shrink-0 w-6 h-6 pb-2 text-quiz-primary"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-tooltip-id="hint-tooltip"
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
        <p className="mb-4 text-quiz-primary">
          {currentQuestion?.text}
          {currentQuestion?.maxOptionCanSelected !== 1 && (
            <strong>
              (Please choose {currentQuestion?.maxOptionCanSelected} answers!)
            </strong>
          )}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion?.options?.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                name={currentQuestion.code}
                type={
                  currentQuestion.maxOptionCanSelected > 1
                    ? "checkbox"
                    : "radio"
                }
                disabled={!optionResult}
                id={`option_${currentQuestion.code}_${option.code}`}
                onChange={(e) =>
                  handleOptionChange(currentQuestion.id, option, e)
                }
                checked={
                  selectedOptions[currentQuestion.id]?.includes(option.id) ||
                  false
                }
              />
              <label
                htmlFor={`option_${currentQuestion.code}_${option.code}`}
                className={`ml-2 text-quiz-primary`}
              >
                {option.text}
              </label>
            </div>
          ))}
        </div>

        {optionResult == false && (
          <p className="mt-4 text-quiz-fail">Please try again</p>
        )}
      </div>
      {actions}
      {isShowEndPopup && (
        <Modal
          isOpen={isShowEndPopup}
          onClose={() => setIsShowEndPopup(false)}
          hideCloseBtn={true}
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-base font-semibold leading-6 text-quiz-primary"
                  id="modal-title"
                >
                  Do you want end Quiz?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-quiz-primary">
                    Once you end this quiz, you will have to start from the
                    first question again.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-quiz-secondary shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={() => {
                router.push("/");
              }}
            >
              End Quiz
            </button>
            <button
              onClick={() => {
                setIsShowEndPopup(false);
              }}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-quiz-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Quiz;
