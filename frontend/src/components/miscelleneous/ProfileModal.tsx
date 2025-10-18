import type { User } from "../../store/userStore";
import { useState } from "react";

type ProfileModalProps = {
  user: User | null;
  closeModal: () => void;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ user, closeModal }) => {
  const [imgError, setImgError] = useState(false);
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "G";

  const hasValidPic = user?.pic && !imgError;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="rounded-lg p-6 w-96 relative bg-primary text-text transition-colors duration-200 ease-in-out">
        {/* Close Button (Icon) */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 font-bold text-xl transition-colors duration-200 ease-in-out text-secondary hover:text-text"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-4">
          {/* User Avatar */}
          {hasValidPic ? (
            <img
              src={user!.pic}
              alt={user?.name ?? "User avatar"}
              className="w-24 h-24 rounded-full object-cover border border-border"
              onError={() => setImgError(true)} // fallback to initials if image fails
            />
          ) : (
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold bg-accent text-text border border-border">
              {initials}
            </div>
          )}

          {/* User Info */}
          <h2 className="text-xl font-semibold text-text">{user?.name ?? "Guest"}</h2>
          <p className="text-text">{user?.email ?? "No email provided"}</p>

          {/* Close Button (Text) */}
          <button
            onClick={closeModal}
            className="px-4 py-2 rounded transition-colors duration-200 ease-in-out bg-accent text-text hover:bg-accent/90"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
