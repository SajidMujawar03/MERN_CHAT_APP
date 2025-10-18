import type { User } from "../store/userStore";

 export  const getSender = (loggedInUser: User | null, chatUsers: User[]): string => {
    if (!loggedInUser || chatUsers.length < 2) return "Unknown";
   
    const otherUser = chatUsers.find(u => u._id !== loggedInUser._id);
  
    return otherUser ? `${otherUser.name} (${otherUser.email})` : "Unknown";
  };