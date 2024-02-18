import Quiz from "@/components/quizzes/quiz";
import { useAppSelector } from "@/modules/redux";

const QuizAnswerPage = () => {
  const quiz = useAppSelector(({ app }) => app.vaniQuiz);

  return <Quiz quiz={quiz!} />;
};
export default QuizAnswerPage;
