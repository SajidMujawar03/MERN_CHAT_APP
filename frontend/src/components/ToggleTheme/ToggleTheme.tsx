import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // import icons

const ToggleTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (storedTheme) {
        setIsDark(storedTheme === "dark");
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      } else {
        setIsDark(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded cursor-pointer transition text-text bg-accent hover:bg-accent-hover"
    >
      {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
    </div>
  );
};

export default ToggleTheme;
