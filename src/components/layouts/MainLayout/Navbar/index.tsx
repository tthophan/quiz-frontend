import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar: React.FC = () => {
  const dropdownRef = useRef<any>();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between">
        <Link legacyBehavior href="/">
          Quiz App
        </Link>
        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center">
              <img
                src={session.user?.image || "/images/default-avatar.png"} // Use a default avatar image if user image is not available
                alt="Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="hidden md:inline">{session.user?.name}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 right-0 mt-2 bg-white rounded-md shadow-md">
                <div className="p-4">
                  <img
                    src={session.user?.image || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <p className="text-quiz-primary">{session.user?.name}</p>
                  <p className="text-quiz-primary">{session.user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-quiz-primary hover:bg-gray-200 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/sign-in">Sign In</Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
