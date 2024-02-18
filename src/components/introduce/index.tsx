import { notificationController } from "@/controllers/notification.controller";
import { useAppDispatch } from "@/modules/redux";
import {
  checkVaniQuizAnswered,
  doStartQuiz,
} from "@/modules/redux/slices/app.slice";
import { doSetAccessToken } from "@/modules/redux/slices/auth.slice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Introduce: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (session) dispatch(doSetAccessToken((session as any)["accessToken"]));
  }, [session]);

  const handleStartQuiz = async (e: any) => {
    if (status === "unauthenticated") return router.push(`/auth/sign-in`);
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
  };
  return (
    <div className="bg-vani p-6 rounded-lg w-full max-w-md">
      <h1 className="text-4xl font-bold mb-4">
        Take the quiz of Vani Coins to et instantly 1,000 coins
      </h1>
      <img
        src="/coin.png"
        alt="Your Image Alt Text"
        className="w-full h-auto mb-4"
      />
      <button
        onClick={handleStartQuiz}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold mb-8"
        // href={`/quiz-answer`}
        key={1}
      >
        Start Quiz
      </button>
      {/* <h2 className="text-2xl font-semibold text-white my-4">
        Additional Information
      </h2>
      <p className="text-lg text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in felis
        vel lectus consectetur tincidunt. Sed ac justo eu purus ullamcorper
        consequat.
      </p> */}
    </div>
  );
};
export default Introduce;
