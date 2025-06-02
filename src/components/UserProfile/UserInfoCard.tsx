import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

export default function UserInfoCard() {
  const admin = useAppSelector((state: RootState) => state.auth.admin);

  const createDate = admin?.created_at ? new Date(admin.created_at) : null;
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {admin?.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {admin?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                permission
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {admin?.role == "1"
                  ? "only read"
                  : admin?.role == "2"
                  ? "read and add"
                  : admin?.role == "3"
                  ? "read, add and update"
                  : "all permission"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date of creation
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {createDate ? createDate.toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
