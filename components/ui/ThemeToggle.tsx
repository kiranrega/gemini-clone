import { useDarkMode } from "@/hooks/useDark";
import { Moon, Sun } from "lucide-react";

// Theme Toggle Component
const ThemeToggle = () => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();
    return (
        <button
            onClick={() => typeof toggleDarkMode === "function" && toggleDarkMode()}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
    );
};

export default ThemeToggle