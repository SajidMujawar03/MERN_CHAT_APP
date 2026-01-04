import { useState, useRef, useEffect } from "react";
import useUser from "../store/userStore";
import ProfileModal from "./miscelleneous/ProfileModal";
import ToggleTheme from "./ToggleTheme/ToggleTheme";
import SideDrawer from "./SideDrawer";
import UserCard from "./miscelleneous/UserCard";

import { IoIosNotifications } from "react-icons/io";
import useNotification from "../store/notificationStore";
import useChat from "../store/chatStore";


const Header = () => {
  const { user, logout } = useUser(); // Assuming you have a logout function in your store
  const {setSelectedChat} = useChat();  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notification,removeNotification } = useNotification()
  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };
  const closeModal = () => setIsModalOpen(false);

  const openSideDrawer = () => setIsDrawerOpen(true);
  const closeSideDrawer = () => setIsDrawerOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleNotificationDrawer = () => setIsNotificationOpen(prev => !prev)

  // const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "GU";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full h-20 p-4 shadow flex justify-between items-center gap-4 bg-primary text-text">
        {/* Left controls */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search User"
            className="px-4 py-2 rounded transition bg-accent text-text"
            onClick={openSideDrawer}
          >
            Search User
          </button>
          <ToggleTheme />
        </div>



        <div className="flex flex-row justify-center items-center ">


          <div className="relative flex items-center justify-center">
            {/* Notification Bell */}
            <IoIosNotifications
              className="w-8 h-8 cursor-pointer text-text hover:text-accent transition"
              onClick={toggleNotificationDrawer}
            />

            {/* Notification Badge */}
            {notification.length > 0 && !isNotificationOpen && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-600 rounded-full shadow">
                {notification.length}
              </span>
            )}

            {/* Notification Drawer */}
            {/* Notification Drawer */}
            {isNotificationOpen && (
              <div className="absolute top-12 right-0 w-80 max-h-96 bg-secondary border border-gray-700 shadow-2xl rounded-xl p-4 z-50 overflow-y-auto custom-scroll">
                <p className="text-lg font-semibold text-center mb-3 border-b border-gray-500 pb-2 text-text">
                  Notifications
                </p>

                {notification.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No new notifications
                  </p>
                ) : (
                  notification.map((n, index) => (
                    <div
                    onClick={()=>{setSelectedChat(n.chat)
                      removeNotification(n)
                      setIsNotificationOpen(false);
                    }}
                      key={index}
                      className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-primary hover:bg-accent transition-all"
                    >
                      {/* Sender Image */}
                      <img
                        src={n.sender.pic}
                        alt={n.sender.name}
                        onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                        className="w-10 h-10 rounded-full object-cover border border-gray-600"
                      />

                      {/* Notification Text */}
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-text">{n.sender.name}</p>
                        <p className="text-sm text-gray-300 leading-snug wrap-break-word">
                          {n.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>


          {/* User avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              aria-label="Open user menu"
              className=""
            >
              <UserCard user={user} />
            </button>

          </div>



          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-secondary shadow-lg rounded overflow-hidden z-50">
              <button
                onClick={openModal}
                className="w-full text-left px-4 py-2 hover:bg-accent transition"
              >
                My Profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-accent transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {isModalOpen && <ProfileModal user={user} closeModal={closeModal} />}



      {/* Side Drawer */}
      <SideDrawer isOpen={isDrawerOpen} onClose={closeSideDrawer} />
    </>
  );
};

export default Header;
