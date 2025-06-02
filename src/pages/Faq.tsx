import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { FaqItem } from "../types/faq";
import { fetchData, submitData } from "../hooks/useApi";
import { useModal } from "../hooks/useModal";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";

export default function Faq() {
  const [faqs, setFaqs] = useState<FaqItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<Record<string, any>>({
    title: "",
    description: "",
  });
  const dispatch = useAppDispatch();

  const fetchFaqs = async () => {
    const res = await fetchData<FaqItem[]>("/faqs");
    setFaqs(res.data);
    setLoading(res.loading);
    setError(res.error);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      closeModal();
      dispatch(
        showMessage({
          content: "Title and Description are required",
          type: "error",
        })
      );
      return;
    }

    const res = await submitData<FaqItem[]>("/faqs", formData, "post");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly add item",
            type: "success",
          })
        );
        closeModal();
        setFormData({ title: "", description: "" });
        fetchFaqs();
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
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="space-y-6">
        <ComponentCard title="Faqs" button={true} onAddClick={openModal}>
          <BasicTableOne
            data={faqs}
            loading={loading}
            page="faqs"
            refetch={fetchFaqs}
            cols={["title", "createdAt", "actions"]}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={isOpen}
        className="max-w-[700px] m-4"
        onClose={() => {
          setFormData({ title: "", description: "" });
          closeModal();
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add FAQ
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleCreate}>
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>
                      Title <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter Title"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Description <span className="text-error-500">*</span>{" "}
                    </Label>
                    <TextArea
                      value={formData.description}
                      onChange={(val: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: val,
                        }))
                      }
                      placeholder="Enter Description"
                      rows={4}
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
                  setFormData({ title: "", description: "" });
                  closeModal();
                }}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                Add FAQ
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
