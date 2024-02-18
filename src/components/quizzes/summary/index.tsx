import { useAppSelector } from "@/modules/redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SummaryQuizComponent = () => {
  const router = useRouter();
  const quiz = useAppSelector(({ app }) => app.quizResult);
  useEffect(() => {
    if (!quiz) router.push("/");
  }, []);
  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Quiz Summary</h1>
      {quiz?.questions?.map((question) => {
        return (
          <div
            key={question.code}
            className="bg-white mt-2 p-6 rounded-md shadow-md"
          >
            <h2 className="text-xl text-quiz-primary font-bold mb-2">
              {question?.code}
            </h2>
            <p className=" text-quiz-primary mb-4">{question?.text}</p>
            <div className="grid grid-cols-2 gap-2">
              {question?.options?.map((option) => (
                <div key={option.code} className="mb-2">
                  <input
                    // type="radio"
                    type={
                      question.maxOptionCanSelected > 1 ? "checkbox" : "radio"
                    }
                    name={question.code}
                    disabled
                    id={`option_${question.code}_${option.code}`}
                    checked={option.selected}
                  />
                  <label
                    htmlFor={`option_${question.code}_${option.code}`}
                    className={`ml-2 ${
                      option.selected
                        ? "text-quiz-pass font-semibold"
                        : "text-quiz-primary"
                    }`}
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="mt-6 flex justify-end">
        <Link
          className="ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-red-600"
          href={`/`}
        >
          End Quiz
        </Link>
      </div>
    </div>
  );
};
export default SummaryQuizComponent;
