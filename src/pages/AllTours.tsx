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
import DragAndDropImageUpload from "../components/form/form-elements/DragAndDropImageUpload";
import ImageGalleryUploader from "../components/form/form-elements/ImageGalleryUploader";
import Select from "../components/form/Select";
import { TourItem } from "../types/tour";
import { TourTypeItem } from "../types/tourType";
import { fetchData, submitData } from "../hooks/useApi";
import { useModal } from "../hooks/useModal";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";
import Checkbox from "../components/form/input/Checkbox";


export default function AllTours() {
  const [tours, setTours] = useState<TourItem[] | null>(null);
  const [tourTypes, setTourTypes] = useState<TourTypeItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<Record<string, any>>({
    title: "",
    description: "",
    location: "",
    price: 0,
    duration: 0,
    startDate: "",
    endDate: "",
    image: "",
    gallery: "",
    typeId: 1,
    bestOffer: false,
    adventures: false,
    experience: false,
  });
  const dispatch = useAppDispatch();

  const fetchTours = async () => {
    const res = await fetchData<TourItem[]>("/tours");
    setTours(res.data);
    setLoading(res.loading);
  };

  const fetchTourTypes = async () => {
    const res = await fetchData<TourTypeItem[]>("/types");
    setTourTypes(res.data);
  };

  useEffect(() => {
    fetchTours();
    fetchTourTypes();
  }, []);

  const typeOptions =
    tourTypes?.map((tourType) => ({
      value: String(tourType.id),
      label: tourType.name,
    })) ?? [];

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

    const fd = new FormData();

    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("location", formData.location);
    fd.append("price", formData.price);
    fd.append("duration", formData.duration);
    fd.append("startDate", formData.startDate);
    fd.append("endDate", formData.endDate);
    fd.append("typeId", formData.typeId);
    fd.append("bestOffer", String(formData.bestOffer));
    fd.append("adventures", String(formData.adventures));
    fd.append("experience", String(formData.experience));

    if (formData.image) {
      fd.append("image", formData.image);
    }

    if (formData.gallery) {
      formData.gallery?.forEach((file: File) => {
        fd.append("gallery[]", file);
      });
    }

    const res = await submitData<TourItem[]>("/tours", fd, "post");

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
          title: "",
          description: "",
          location: "",
          price: 0,
          duration: 0,
          startDate: "",
          endDate: "",
          image: "",
          gallery: "",
          typeId: 1,
          bestOffer: false,
          adventures: false,
          experience: false,
        });
        fetchTours();
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
      <PageBreadcrumb pageTitle="All Tours" />
      <div className="space-y-6">
        <ComponentCard title="All Tours" button={true} onAddClick={openModal}>
          <BasicTableOne
            data={tours}
            loading={loading}
            page="tours"
            refetch={fetchTours}
            typeOptions={typeOptions}
            cols={[
              "image",
              "title",
              "location",
              "bestOffer",
              "experience",
              "adventures",
              "status",
              "createdAt",
              "actions",
            ]}
          />
        </ComponentCard>
      </div>

      <Modal
        isOpen={isOpen}
        className="max-w-[900px] m-4"
        onClose={() => {
          setFormData({
            title: "",
            description: "",
            location: "",
            price: 0,
            duration: 0,
            startDate: "",
            endDate: "",
            image: "",
            gallery: "",
            typeId: 1,
            bestOffer: false,
            adventures: false,
            experience: false,
          });
          closeModal();
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Tour
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleCreate}>
            <div className="custom-scrollbar max-h-[500px] overflow-y-auto px-2 pb-3">
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

                  <div className="col-span-2">
                    <Label>
                      Location <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      placeholder="Enter Location"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Price <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      placeholder="Enter Price"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Duration <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      placeholder="Enter Duration"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Start Date <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      placeholder="Enter Start Date"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      End Date <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      placeholder="Enter End Date"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Type <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Select
                      options={typeOptions}
                      defaultValue={formData.typeId}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          typeId: value,
                        }))
                      }
                      placeholder="Select Type"
                      required
                    />
                  </div>

                  <div className="col-span-1">
                    <Checkbox
                      label="best Offer"
                      checked={Boolean(formData.bestOffer)}
                      onChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          bestOffer: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="col-span-1">
                    <Checkbox
                      label="Adventures"
                      checked={Boolean(formData.adventures)}
                      onChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          adventures: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="col-span-1">
                    <Checkbox
                      label="Experience"
                      checked={Boolean(formData.experience)}
                      onChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          experience: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      Image <span className="text-error-500">*</span>{" "}
                    </Label>
                    <DragAndDropImageUpload
                      onFileSelect={(file) => {
                        setFormData((prev) => ({
                          ...prev,
                          image: file,
                        }));
                      }}
                    />
                  </div>
                  <p>{formData.name}</p>

                  <div className="col-span-2">
                    <Label>Gallery</Label>
                    <ImageGalleryUploader
                      onFilesSelect={(files) => {
                        setFormData((prev) => ({
                          ...prev,
                          gallery: files,
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
                    title: "",
                    description: "",
                    location: "",
                    price: 0,
                    duration: 0,
                    startDate: "",
                    endDate: "",
                    image: "",
                    gallery: "",
                    typeId: 1,
                    bestOffer: false,
                    adventures: false,
                    experience: false,
                  });
                  closeModal();
                }}
              >
                Close
              </Button>
              <Button size="sm" type="submit">
                Add Tour
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
