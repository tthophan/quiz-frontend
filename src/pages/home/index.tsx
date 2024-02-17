import { notificationController } from "@/controllers/notification.controller";
import { IQuiz } from "@/interfaces";
import { useAppDispatch, useAppSelector } from "@/modules/redux";
import { fetchQuizzes } from "@/modules/redux/slices/app.slice";
import { doSetAccessToken } from "@/modules/redux/slices/auth.slice";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo } from "react";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) dispatch(doSetAccessToken((session as any)["accessToken"]));
  }, [session]);
  const quizzes = useAppSelector(({ app }) => app.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, []);
  const onQuizClick = (quiz: IQuiz, e: any) => {
    if (quiz.isAnswered) {
      e.preventDefault();
      return notificationController.info({
        message: `${quiz.title} has been answered!`,
      });
    }
  };
  const quizzesJsx = useMemo(() => {
    return quizzes.map((quiz) => (
      <Link
        // onClick={(e) => onQuizClick(quiz, e)}
        href={`/quizzes/${quiz.code}`}
        key={quiz.code}
      >
        <div className="bg-white p-6 relative rounded-md shadow-md hover:shadow-lg transition duration-300">
          {quiz.isAnswered && (
            <div className="absolute right-0 top-0 rounded-br-xl rounded-bl-xl text-white px-2 py-2 bg-[#ff2865] transition-all duration-150 ease-in">
              Answered
            </div>
          )}
          <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
          <p className="text-gray-600">{quiz.shortDescription}</p>
          <p className="text-gray-600">Questions: {quiz.totalQuestions}</p>
          <p className="text-blue-500">Start Quiz</p>
        </div>
      </Link>
    ));
  }, [quizzes, onQuizClick]);

  return (
    <>
      <div className="container">
        <h1 className="text-3xl font-bold mb-4">Quiz Listing</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzesJsx}
        </div>
      </div>
    </>
  );
};

export default HomePage;
