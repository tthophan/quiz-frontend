import Quiz from "@/components/quizzes/quiz";
import { useAppDispatch, useAppSelector } from "@/modules/redux";
import { fetchQuiz } from "@/modules/redux/slices/app.slice";
import { useRouter } from "next/router";
import { useEffect } from "react";

const QuizPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(({ app }) => app.quiz);

  useEffect(() => {
    router.query.code && dispatch(fetchQuiz(String(router.query.code)));
  }, [router.query]);

  return <Quiz quiz={quiz!} />;
};
export default QuizPage;
