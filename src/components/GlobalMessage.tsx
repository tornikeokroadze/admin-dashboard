import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { clearMessage } from "../redux/slices/messageSlice";
import Button from "./ui/button/Button";

const GlobalMessage = () => {
  const dispatch = useAppDispatch();
  const { content, type, undoable, timeoutId } = useAppSelector(
    (state: RootState) => state.message
  );

  useEffect(() => {
    if (content && !undoable) {
      const timeout = setTimeout(() => {
        dispatch(clearMessage());
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [content, undoable, dispatch]);

  const handleUndo = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(clearMessage());
  };

  if (!content) return null;

  return (
    <div
      className={`fixed bottom-6 right-2 md:transform md:-translate-x-1/2 mx-2 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center space-x-3 transition-all duration-300 ease-in-out ${
        type === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : type === "info"
          ? "bg-blue-100 text-blue-800 border border-blue-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {type === "success" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : type === "error" ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        )}
      </svg>
      <span className="text-md font-medium">{content}</span>
      {undoable && (
        <Button
          variant="outline"
          size="xs"
          onClick={handleUndo}
          className="ml-2 text-md hover:text-blue-600 dark:!text-gray-200 dark:hover:!text-blue-600"
        >
          Undo
        </Button>
      )}
    </div>
  );
};

export default GlobalMessage;
