import Button from "../ui/button/Button";
import { PlusIcon } from "../../icons";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  button?: boolean;
  onAddClick?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  button = false,
  onAddClick,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        {button ? (
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
            <Button
              variant="secondary"
              size="xs"
              onClick={onAddClick}
              endIcon={<PlusIcon />}
            >
              Add New Item
            </Button>
          </div>
        ) : (
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
        )}
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
