import { notificationController } from "@/controllers/notification.controller";
import { useAppDispatch } from "@/modules/redux";
import {
  checkVaniQuizAnswered,
  doStartQuiz,
} from "@/modules/redux/slices/app.slice";
import { doSetAccessToken } from "@/modules/redux/slices/auth.slice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Introduce: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    if (session) dispatch(doSetAccessToken((session as any)["accessToken"]));
  }, [session]);

  const handleStartQuiz = async (e: any) => {
    if (status === "unauthenticated") return router.push(`/auth/sign-in`);
    setIsLoading(true);
    try {
      const result = await dispatch(checkVaniQuizAnswered()).unwrap();
      if (result) {
        e.preventDefault();
        notificationController.info({
          message: "Quiz has been answered by you before.",
        });
        return;
      }
      await dispatch(doStartQuiz()).unwrap();
      router.push(`/quiz-answer`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-vani p-6 rounded-lg w-full max-w-md flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">
        Take the quiz of Vani Coins to et instantly 1,000 coins
      </h1>
      <img
        src="/coin.png"
        alt="Your Image Alt Text"
        className="w-full h-auto mb-4"
      />
      <button
        disabled={isLoading}
        onClick={handleStartQuiz}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold mb-8 flex items-center"
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
        <span>Start Quiz</span>
      </button>
    </div>
  );
};
export default Introduce;
