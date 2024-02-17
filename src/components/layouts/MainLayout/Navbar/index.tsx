import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>();
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
        <Link legacyBehavior href="/home">
          Quiz App
        </Link>
        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center">
              <img
                src={session.user?.image || "/default-avatar.jpg"} // Use a default avatar image if user image is not available
                alt="Avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="hidden md:inline">{session.user?.name}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 right-0 mt-2 bg-white rounded-md shadow-md">
                <div className="p-4">
                  <img
                    src={session.user?.image || "/default-avatar.jpg"}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <p className="text-gray-800">{session.user?.name}</p>
                  <p className="text-gray-800">{session.user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
