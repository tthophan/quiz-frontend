import Link from "next/link";

const Introduce: React.FC = () => {
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
      <Link
        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold mb-8"
        href={`/home`}
        key={1}
      >
        Start Quiz
      </Link>
      <h2 className="text-2xl font-semibold text-white my-4">
        Additional Information
      </h2>
      <p className="text-lg text-white">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in felis
        vel lectus consectetur tincidunt. Sed ac justo eu purus ullamcorper
        consequat.
      </p>
    </div>
  );
};
export default Introduce;
