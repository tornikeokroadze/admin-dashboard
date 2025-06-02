import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { AboutItem } from "../types/about";
import { fetchData, submitData } from "../hooks/useApi";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";
import { ThreeDot } from "react-loading-indicators";
import DragAndDropImageUpload from "../components/form/form-elements/DragAndDropImageUpload";

export default function About() {
  const [about, setAbout] = useState<AboutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const fetchAbout = async () => {
    const res = await fetchData<AboutItem>("/about");
    setAbout(res.data);
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    if (!about.title || !about.description) {
      dispatch(
        showMessage({
          content: "Title and Description are required",
          type: "error",
        })
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", about.title);
    formData.append("description", about.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await submitData(`/about/${about?.id}`, formData, "put");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly update about",
            type: "success",
          })
        );
        fetchAbout();
      }
      if (res.error === "__HANDLED__") {
        return;
      }
    } else {
      dispatch(
        showMessage({
          content: "Failed to update about. Please try again.",
          type: "error",
        })
      );
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="About" />
      <div className="space-y-6 mb-4">
        <ComponentCard title="About" button={false}>
          {loading ? (
            <div className="flex justify-center items-center my-4">
              <ThreeDot
                variant="bounce"
                color={isDark ? "#ffffff" : "#000000"}
                size="small"
                text=""
                textColor=""
              />
            </div>
          ) : !about ? (
            <div className="flex justify-center items-center text-xl text-gray-800 dark:text-gray-300">
              No about found.
            </div>
          ) : (
            <form className="flex flex-col" onSubmit={handleUpdate}>
              <div className="custom-scrollbar h-[auto overflow-y-auto px-2 pb-2">
                <div className="mt-7">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2">
                      <Label>
                        Title <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"
                        value={about?.title ?? ""}
                        onChange={(e) =>
                          setAbout(
                            (prev) => prev && { ...prev, title: e.target.value }
                          )
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
                        value={about?.description ?? ""}
                        onChange={(val: string) =>
                          setAbout(
                            (prev) => prev && { ...prev, description: val }
                          )
                        }
                        placeholder="Enter Description"
                        rows={10}
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Image</Label>

                      <DragAndDropImageUpload
                        onFileSelect={(file) => setImageFile(file)}
                        defaultPreview={about?.image ? about.image : undefined}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
