import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import TextArea from "../components/form/input/TextArea";
import Button from "../components/ui/button/Button";
import { ContactItem } from "../types/contact";
import { fetchData, submitData } from "../hooks/useApi";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";
import { ThreeDot } from "react-loading-indicators";

export default function Contact() {
  const [contact, setContact] = useState<ContactItem | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const fetchContact = async () => {
    const res = await fetchData<ContactItem>("/contact");
    setContact(res.data);
    setLoading(res.loading);
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;

    if (!contact.phone || !contact.location || !contact.email) {
      dispatch(
        showMessage({
          content: "Phone, Location and Email are required",
          type: "error",
        })
      );
      return;
    }

    const res = await submitData(`/contact/${contact?.id}`, contact, "put");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly update contact",
            type: "success",
          })
        );
        fetchContact();
      }
      if (res.error === "__HANDLED__") {
        return;
      }
    } else {
      dispatch(
        showMessage({
          content: "Failed to update contact. Please try again.",
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
      <PageBreadcrumb pageTitle="Contact" />
      <div className="space-y-6">
        <ComponentCard title="Contact" button={false}>
          {loading ? (
            <div className="flex justify-center items-center my-4">
              <ThreeDot
                variant="bounce"
                // color="#1B8651FF"
                color={isDark ? "#ffffff" : "#000000"}
                size="small"
                text=""
                textColor=""
              />
            </div>
          ) : !contact ? (
            <div className="flex justify-center items-center text-xl text-gray-800 dark:text-gray-300">
              No contact found.
            </div>
          ) : (
            <form className="flex flex-col" onSubmit={handleUpdate}>
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div className="mt-7">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2">
                      <Label>
                        Phone <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"
                        value={contact?.phone ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) => prev && { ...prev, phone: e.target.value }
                          )
                        }
                        placeholder="Enter Phone"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>
                        Whatsapp
                      </Label>
                      <Input
                        type="text"
                        value={contact?.whatsapp ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) => prev && { ...prev, whatsapp: e.target.value }
                          )
                        }
                        placeholder="Enter Whatsapp"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>
                        Location <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="text"
                        value={contact?.location ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) =>
                              prev && { ...prev, location: e.target.value }
                          )
                        }
                        placeholder="Enter Location"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>
                        Email <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        type="email"
                        value={contact?.email ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) => prev && { ...prev, email: e.target.value }
                          )
                        }
                        placeholder="Enter Email"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Facebook</Label>
                      <Input
                        type="text"
                        value={contact?.facebook ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) =>
                              prev && { ...prev, facebook: e.target.value }
                          )
                        }
                        placeholder="Enter Facebook"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Instagram</Label>
                      <Input
                        type="text"
                        value={contact?.instagram ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) =>
                              prev && { ...prev, instagram: e.target.value }
                          )
                        }
                        placeholder="Enter Instagram"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Youtube</Label>
                      <Input
                        type="text"
                        value={contact?.youtube ?? ""}
                        onChange={(e) =>
                          setContact(
                            (prev) =>
                              prev && { ...prev, youtube: e.target.value }
                          )
                        }
                        placeholder="Enter Youtube"
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
