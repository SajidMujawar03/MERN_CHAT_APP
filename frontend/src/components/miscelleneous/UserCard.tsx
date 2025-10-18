import React, { useState } from "react";
import clsx from "clsx";

type UserCardProps = {
  user: {
    _id: string;
    pic?: string;
    name: string;
    email: string;
  } | null;
  onClick?: (userId: string) => void;
  className?: string;
};

const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => {
  const [imgError, setImgError] = useState(false);

  if (!user) return null;

  const initials = user.name.slice(0, 2).toUpperCase();
  const hasValidPic = user.pic && !imgError;

  return (
    <div
      onClick={() => onClick && onClick(user._id)}
      className={clsx(
        "w-full flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
        className // allow parent styling (like text-white)
      )}
    >
      {hasValidPic ? (
        <img
          src={user.pic}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      )}

      <div className="flex flex-col overflow-hidden dark:text-white">
        <span className="font-medium truncate">{user.name}</span>
        <span className="text-sm truncate opacity-80">{user.email}</span>
      </div>
    </div>
  );
};

export default UserCard;
