import SignUpForm from "@/components/auth/sign-up/sign-up-form";

export default function SignUpPage() {
  return (
    <>
      <div className="bg-gray-100 flex justify-center items-center h-screen">
        <div className="w-2/3 h-screen hidden lg:block">
          <img
            src="/gradient-connection-background.webp"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/3">
          <h1 className="text-2xl text-quiz-primary font-semibold mb-4">Sign Up</h1>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
