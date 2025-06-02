import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { TourTypeItem } from "../types/tourType";
import { fetchData, submitData } from "../hooks/useApi";
import { useModal } from "../hooks/useModal";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";

export default function TourTypes() {
  const [tourTypes, setTourTypes] = useState<TourTypeItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
  });
  const dispatch = useAppDispatch();

  const fetchTourTypes = async () => {
    const res = await fetchData<TourTypeItem[]>("/types");
    setTourTypes(res.data);
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchTourTypes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      closeModal();
      dispatch(
        showMessage({
          content: "Name is required",
          type: "error",
        })
      );
      return;
    }

    const res = await submitData<TourTypeItem[]>("/types", formData, "post");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly add item",
            type: "success",
          })
        );
        closeModal();
        setFormData({ name: "" });
        fetchTourTypes();
      }
      if (res.error === "__HANDLED__") {
        closeModal();
        return;
      }
    } else {
      closeModal();
      dispatch(
        showMessage({
          content: "Failed to add item. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Type" />
      <div className="space-y-6">
        <ComponentCard title="Types" button={true} onAddClick={openModal}>
          <BasicTableOne
            data={tourTypes}
            loading={loading}
            page="types"
            refetch={fetchTourTypes}
            cols={["name", "actions"]}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={isOpen}
        className="max-w-[700px] m-4"
        onClose={() => {
          setFormData({ name: "" });
          closeModal();
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Tour Type
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleCreate}>
            <div className="custom-scrollbar h-[250px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>
                      Name <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({ name: "" });
                  closeModal();
                }}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                Add Type
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
