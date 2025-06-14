import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../components/ui/modal";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import DragAndDropImageUpload from "../components/form/form-elements/DragAndDropImageUpload";
import Button from "../components/ui/button/Button";
import { TeamItem } from "../types/team";
import { fetchData, submitData } from "../hooks/useApi";
import { useModal } from "../hooks/useModal";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";

export default function Team() {
  const [team, setTeam] = useState<TeamItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    surname: "",
    position: "",
    image: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const dispatch = useAppDispatch();

  const fetchTeam = async () => {
    const res = await fetchData<TeamItem[]>("/team");
    setTeam(res.data);
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.position) {
      closeModal();
      dispatch(
        showMessage({
          content: "Name, Surname and Position are required",
          type: "error",
        })
      );
      return;
    }

    const fd = new FormData();

    fd.append("name", formData.name);
    fd.append("surname", formData.surname);
    fd.append("position", formData.position);
    fd.append("facebook", formData.facebook);
    fd.append("instagram", formData.instagram);
    fd.append("twitter", formData.twitter);

    if (formData.image) {
      fd.append("image", formData.image);
    }

    const res = await submitData<TeamItem[]>("/team", fd, "post");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly add item",
            type: "success",
          })
        );
        closeModal();
        setFormData({
          name: "",
          surname: "",
          position: "",
          image: "",
          facebook: "",
          instagram: "",
          twitter: "",
        });
        fetchTeam();
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
      <PageBreadcrumb pageTitle="Team" />
      <div className="space-y-6">
        <ComponentCard title="Team" button={true} onAddClick={openModal}>
          <BasicTableOne
            data={team}
            loading={loading}
            page="team"
            refetch={fetchTeam}
            cols={["image", "name", "position", "createdAt", "actions"]}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={isOpen}
        className="max-w-[900px] m-4"
        onClose={() => {
          setFormData({
            name: "",
            surname: "",
            position: "",
            image: "",
            facebook: "",
            instagram: "",
            twitter: "",
          });
          closeModal();
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Item
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleCreate}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
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

                  <div className="col-span-2">
                    <Label>
                      Surname <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      value={formData.surname}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          surname: e.target.value,
                        }))
                      }
                      placeholder="Enter Surname"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Position <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          position: e.target.value,
                        }))
                      }
                      placeholder="Enter Position"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          facebook: e.target.value,
                        }))
                      }
                      placeholder="Enter Facebook"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          instagram: e.target.value,
                        }))
                      }
                      placeholder="Enter Instagram"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Twitter</Label>
                    <Input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          twitter: e.target.value,
                        }))
                      }
                      placeholder="Enter Twitter"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Image</Label>
                    <DragAndDropImageUpload
                      onFileSelect={(file) => {
                        setFormData((prev) => ({
                          ...prev,
                          image: file,
                        }));
                      }}
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
                  setFormData({
                    name: "",
                    surname: "",
                    position: "",
                    image: "",
                    facebook: "",
                    instagram: "",
                    twitter: "",
                  });
                  closeModal();
                }}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                Add Item
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
