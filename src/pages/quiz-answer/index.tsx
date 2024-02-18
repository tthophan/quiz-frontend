import Quiz from "@/components/quizzes/quiz";
import { useAppDispatch, useAppSelector } from "@/modules/redux";
import { fetchVaniQuiz } from "@/modules/redux/slices/app.slice";
import { useEffect } from "react";

const QuizAnswerPage = () => {
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(({ app }) => app.vaniQuiz);

  useEffect(() => {
    dispatch(fetchVaniQuiz()).unwrap();
  }, []);

  return <Quiz quiz={quiz!} />;
};
export default QuizAnswerPage;
