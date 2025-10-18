import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";
import useUser from "../store/userStore";

// Type for login request
interface LoginFormData {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const { login } = useUser();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement>,
    overrideData?: LoginFormData
  ) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const message = await login(overrideData ?? formData);

      toast.success(message);
      navigate("/chats");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Guest login
  const handleGuestLogin = () => {
    const guest = { email: "guest@example.com", password: "123456" };
    setFormData(guest);
    handleSubmit(undefined, guest); // pass guest directly
  };

  return (
    <div className="bg-primary p-8 rounded-lg shadow-md w-full max-w-md mx-auto space-y-6 text-text">
      <h2 className="text-2xl font-bold text-center text-text">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium text-text">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col relative">
          <label htmlFor="password" className="mb-1 font-medium text-text">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 text-sm text-accent hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-text py-2 rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Guest Login */}
      <button
        type="button"
        onClick={handleGuestLogin}
        disabled={loading}
        className="w-full bg-secondary/50 text-text py-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
      >
        {loading ? "Please wait..." : "Get Guest User Credentials"}
      </button>
    </div>
  );
};

export default LoginComponent;