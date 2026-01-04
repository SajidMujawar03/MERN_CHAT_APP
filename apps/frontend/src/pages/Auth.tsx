import { useState } from "react";
import LoginComponent from "../components/LoginComponent";
import SignupComponent from "../components/SignupComponent";

const Auth: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"login" | "signup">("login");
  return (
    <div className="flex justify-center items-start min-h-screen bg-secondary p-4">
      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-2">
          <button
            onClick={() => setActiveComponent("login")}
            className={`px-4 py-2 rounded-md font-medium transition-colors w-1/2 ${
              activeComponent === "login"
                ? "bg-accent text-primary"
                : "bg-accent/10 text-secondary hover:bg-accent/20"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveComponent("signup")}
            className={`px-4 py-2 rounded-md font-medium transition-colors w-1/2 ${
              activeComponent === "signup"
                ? "bg-accent text-primary"
                : "bg-accent/10 text-secondary hover:bg-accent/20"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Render Active Component */}
        <div>
          {activeComponent === "login" && <LoginComponent />}
          {activeComponent === "signup" && <SignupComponent setActiveComponent={setActiveComponent} />}
        </div>
      </div>
    </div>
  );
};

export default Auth;