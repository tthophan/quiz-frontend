import Modal from "@/components/modal";
import Progress from "@/components/progress";
import { notificationController } from "@/controllers/notification.controller";
import { IOption, IQuiz } from "@/interfaces";
import { useAppDispatch, useAppSelector } from "@/modules/redux";
import {
  answerQuestion,
  setCurrentQuestion,
  setQuizResult,
} from "@/modules/redux/slices/app.slice";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

interface IProps {
  quiz: IQuiz;
}

const Quiz = ({ quiz }: IProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const quizResult = useAppSelector(({ app }) => app.quizResult);
  const currentQuestion = useAppSelector(({ app }) => app.currentQuestion);

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: Array<number>;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isShowEndPopup, setIsShowEndPopup] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    !quizResult && dispatch(setQuizResult(quiz));
  }, [quiz]);

  useEffect(() => {
    if (quizResult?.questions?.length) {
      dispatch(
        setCurrentQuestion(
          quizResult.questions[
            Math.min(currentQuestionIndex, quizResult.questions.length - 1)
          ]
        )
      );
    }
  }, [currentQuestionIndex, quizResult, quiz]);

  useEffect(() => {
    setCurrentQuestionIndex((current) => {
      const res = Math.max(
        isNaN(current) ? 0 : current,
        isNaN(Number(router.query.question)) ? 0 : Number(router.query.question)
      );
      return res;
    });
  }, [router.query]);

  const handleFinished = () => {
    router.push(`/quizzes/${quiz.code}/summary`);
  };

  const handleOptionChange = async (
    questionId: number,
    option: IOption,
    e: any
  ) => {
    const { id: optionId } = option;
    const optionSelected = [
      ...currentQuestion!.options.filter((x) => x.selected),
      {
        ...currentQuestion!.options.find((x) => x.id === optionId),
        selected: true,
      },
    ].slice(currentQuestion!.maxOptionCanSelected * -1);

    const questionUpdated = {
      ...currentQuestion!,
      hint: "",
      result: false,
      submitted: false,
      options: [
        ...optionSelected,
        ...currentQuestion!.options
          .filter((x) => !optionSelected.some((s) => x.id === s.id))
          .map((x) => ({ ...x, selected: false })),
      ].sort((a, b) => (a.id ?? 0) - (b.id ?? 0)),
    };
    dispatch(setCurrentQuestion(questionUpdated));
  };

  const updateQuizResult = (
    result: boolean = false,
    hint: string = "",
    optionId: number,
    questionId: number,
    submitted: boolean = false
  ) => {
    const quizR: IQuiz = {
      ...quiz,
      ...quizResult,
    };

    const questionUpdated = {
      ...currentQuestion!,
      hint: result ? "" : hint,
      result: result,
      submitted: submitted,
      options: currentQuestion!.options.map((o) => ({
        ...o,
        selected: optionId ? o.id === optionId : o.selected,
      })),
    };

    dispatch(
      setQuizResult({
        ...quizR,
        questions: [
          ...quizR.questions!.filter((q) => q.id !== questionId),
          questionUpdated,
        ].sort((a, b) => a.id - b.id),
      })
    );

    dispatch(setCurrentQuestion(questionUpdated));
  };

  const onNext = async () => {
    const questionId = currentQuestion!.id;
    const maxOptionCanSelected = currentQuestion!.maxOptionCanSelected;
    if (
      (currentQuestion!.options.filter((x) => x.selected).map((x) => x.id)
        ?.length ?? 0) < maxOptionCanSelected
    ) {
      notificationController.info({
        message: `please choose ${maxOptionCanSelected} answers!`,
      });
      return;
    }
    let response = null;
    if (!currentQuestion!.result) {
      setIsLoading(true);
      response = await dispatch(
        answerQuestion({
          optionIds: currentQuestion!.options
            .filter((x) => x.selected)
            .map((x) => x.id),
          questionId,
          quizId: quiz.id,
        })
      )
        .unwrap()
        .finally(() => setIsLoading(false));

      updateQuizResult(response.result, response.hint, 0, questionId, true);
    }

    if (response?.result || currentQuestion!.result) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      router.push(
        {
          pathname: "/quiz-answer", // Replace with your actual page path
          query: { question: currentQuestionIndex + 1 },
        },
        undefined,
        { shallow: true } // Use the shallow option to update the URL without running data fetching methods again
      );
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
        {currentQuestionIndex !== quiz?.questions?.length && (
          <button
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
            onClick={onNext}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-0"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            <span>Next</span>
          </button>
        )}
        {currentQuestionIndex >= quiz?.questions!.length && (
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
    isLoading,
  ]);

  return (
    <div className="container">
      <Progress
        className="m3-2"
        title={
          <h1 className="text-3xl font-bold mb-4 text-quiz-secondary">
            {quiz?.title}
          </h1>
        }
        step={Math.min(quiz?.questions?.length ?? 0, currentQuestionIndex + 1)}
        totalStep={quiz?.questions?.length ?? 0}
        key={1}
      />
      <p className="mb-6 text-quiz-primary">{quiz?.description}</p>
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="flex items-center">
          <h2 className="text-xl font-bold mb-2 text-quiz-primary">
            {currentQuestion?.code}
          </h2>
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
                id={`option_${currentQuestion.code}_${option.code}`}
                onChange={(e) =>
                  handleOptionChange(currentQuestion.id, option, e)
                }
                checked={
                  selectedOptions[currentQuestion.id]?.includes(option.id) ||
                  option.selected ||
                  false
                }
                disabled={currentQuestion.submitted && currentQuestion.result}
              />
              <label
                htmlFor={`option_${currentQuestion.code}_${option.code}`}
                className={`ml-2 ${
                  (selectedOptions[currentQuestion!.id] ?? []).includes(
                    option.id
                  )
                    ? "text-quiz-pass"
                    : "text-quiz-primary"
                }`}
              >
                {option.text}
              </label>
            </div>
          ))}
        </div>

        {currentQuestion &&
          currentQuestion.result == false &&
          currentQuestion.submitted && (
            <>
              <p className="mt-4 text-quiz-fail">Please try again</p>
              {currentQuestion && currentQuestion.hint && (
                <p className="mt-4 text-quiz-primary">
                  <i>
                    <strong>Hint</strong>: {currentQuestion.hint}
                  </i>
                </p>
              )}
            </>
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
