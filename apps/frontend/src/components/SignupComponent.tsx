import { useState, type ChangeEvent, type FormEvent } from "react";
import api from "../config/axiosConfig";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: string;
}

interface SignupResponse {
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface SignupComponentProps {
  setActiveComponent: (component: "signup" | "login") => void;
}

const SignupComponent: React.FC<SignupComponentProps> = ({ setActiveComponent }:SignupComponentProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: ""
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post<SignupResponse>("/auth/register", formData);

      toast.success(data.message);

      // redirect to login
      setActiveComponent("login");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-primary p-8 rounded-lg shadow-md w-full max-w-md mx-auto space-y-6 text-text"
    >
      <h2 className="text-2xl font-bold text-center">Signup</h2>

      {/* Name */}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium text-text-text-secondary">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium text-text-text-secondary">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col relative">
        <label htmlFor="password" className="mb-1 font-medium text-text-text-secondary">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-8 text-sm text-accent hover:underline"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col relative">
        <label htmlFor="confirmPassword" className="mb-1 font-medium text-text-secondary">
          Confirm Password
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 top-8 text-sm text-accent hover:underline"
        >
          {showConfirmPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Profile Image URL */}
      <div className="flex flex-col">
        <label htmlFor="image" className="mb-1 font-medium text-text-secondary">
          Profile Image URL
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-text py-2 rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
};

export default SignupComponent;