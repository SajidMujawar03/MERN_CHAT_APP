import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "../config/axiosConfig";

export type User = {
  _id: string;
  name: string;
  email: string;
  pic:string;
};

type UserState = {
  user: User | null;
  token: string;
  isLoggedIn: boolean;
  login: (credentials: { email: string; password: string }) => Promise<string>;
  logout: () => void;
};

interface LoginResponse {
  message: string;
  data: {
    token: string;
    _id: string;
    email: string;
    name: string;
    pic:string
  };
}

const useUser = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: "",
        isLoggedIn: false,

       
        login: async (credentials) => {
          const { data } = await api.post<LoginResponse>(
            "/auth/login",
            credentials
          );

          const { token, ...userData } = data.data;

          set({
            token,
            user: userData,
            isLoggedIn: true,
          });

          return data.message;
        },

        logout: () => {
          set({
            user: null,
            token: "",
            isLoggedIn: false,
          });
        },
      }),
      { name: "user" } 
    )
  )
);

export default useUser;
