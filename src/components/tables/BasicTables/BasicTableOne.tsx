import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import TextArea from "../../form/input/TextArea";
import Button from "../../ui/button/Button";
import DragAndDropImageUpload from "../../form/form-elements/DragAndDropImageUpload";
import Select from "../../form/Select";
import { TrashBinIcon, PencilIcon, EyeIcon } from "../../../icons";
import { submitData, deleteData, deleteManyData } from "../../../hooks/useApi";
import { useAppDispatch } from "../../../redux/hooks";
import { clearMessage, showMessage } from "../../../redux/slices/messageSlice";
import { ThreeDot } from "react-loading-indicators";
import Badge from "../../ui/badge/Badge";
import ImageGalleryUploader from "../../form/form-elements/ImageGalleryUploader";
import { useLocation } from "react-router";

interface Option {
  value: string;
  label: string;
}

interface BasicTableOneProps<T extends { id: number }> {
  data: T[] | null;
  loading: boolean;
  page: string;
  edit?: boolean;
  save?: boolean;
  deletable?: boolean;
  refetch?: () => void;
  typeOptions?: Option[];
  cols: string[];
}

export default function BasicTableOne<T extends { id: number }>({
  data,
  loading,
  page,
  edit = true,
  save = true,
  deletable = true,
  refetch,
  typeOptions = [],
  cols,
}: BasicTableOneProps<T>) {
  const defaultCols = ["User", "Project Name", "Team", "Status", "Budget"];
  const columns = cols && cols.length > 0 ? cols : defaultCols;

  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  //for search to highlight result
  const location = useLocation();
  const highlightIdParam = new URLSearchParams(location.search).get(
    "highlight"
  );

  const highlightIds = highlightIdParam
    ? highlightIdParam.split(",").map((id) => id.trim())
    : [];

  useEffect(() => {
    if (highlightIds.length > 0 && page === "tours") {
      setTimeout(() => {
        highlightIds.forEach((id) => {
          const scrollRow = document.getElementsByClassName(
            `row-scroll-${id}`
          ) as HTMLCollectionOf<HTMLElement>;

          if (scrollRow.length > 0) {
            scrollRow[0].scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });
      }, 600);
    }
  }, [highlightIdParam, page]);

  function objectToFormData(obj: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "gallery" && Array.isArray(value)) {
          for (const item of value) {
            if (item.image instanceof File) {
              formData.append("gallery[]", item.image);
            } else if (typeof item.image === "string") {
              formData.append("existingGallery[]", item.image.split("/").pop());
            }
          }
        } else {
          formData.append(key, value);
        }
      }
    });

    return formData;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!save) {
      return;
    }

    const fd = objectToFormData(formData);

    const res = await submitData(`/${page}/${formData.id}`, fd, "put");

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: "successfuly update item",
            type: "success",
          })
        );
        closeModal();
        setFormData({});
        refetch?.();
      }
      if (res.error === "__HANDLED__") {
        closeModal();
        return;
      }
    } else {
      closeModal();
      dispatch(
        showMessage({
          content: "Failed to update item. Please try again.",
          type: "error",
        })
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!deletable) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      const res = await deleteData(`/${page}/${id}`);

      if (!res.error || res.error === "__HANDLED__") {
        if (!res.error) {
          // dispatch(
          //   showMessage({
          //     content: "Successfully deleted item",
          //     type: "success",
          //   })
          // );
          refetch?.();
        }
        if (res.error === "__HANDLED__") {
          setTimeout(() => {
            dispatch(clearMessage());
          }, 3000);
          return;
        }
      } else {
        dispatch(
          showMessage({
            content: "Failed to delete item. Please try again.",
            type: "error",
          })
        );
      }

      setTimeout(() => {
        dispatch(clearMessage());
      }, 1000);
    }, 5000);

    dispatch(
      showMessage({
        content: "Item will be deleted. Click Undo to cancel.",
        type: "info",
        undoable: true,
        timeoutId,
        itemId: id,
      })
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const res = await deleteManyData<{ success: boolean; message: string }>(
      `/${page}/delete-many`,
      selectedIds
    );

    if (!res.error || res.error === "__HANDLED__") {
      if (!res.error) {
        dispatch(
          showMessage({
            content: `${res.data?.message}`,
            type: "success",
          })
        );

        setSelectedIds([]);
        setSelectMode(false);
        refetch?.();
      }
      if (res.error === "__HANDLED__") {
        setSelectedIds([]);
        setSelectMode(false);
        return;
      }
    } else {
      dispatch(
        showMessage({
          content: "Failed to delete selected items. Please try again.",
          type: "error",
        })
      );
    }
  };

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <>
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
      ) : !data || data.length === 0 ? (
        <div className="flex justify-center items-center text-xl text-gray-800 dark:text-gray-300">
          No data found.
        </div>
      ) : (
        <>
          {deletable && page == "tours" ? (
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setSelectMode(!selectMode)}
                variant="primary"
                size="sm"
              >
                {selectMode ? "Cancel" : "Select"}
              </Button>

              {selectMode && selectedIds.length > 0 && (
                <Button
                  variant="delete"
                  size="sm"
                  onClick={() => handleBulkDelete()}
                >
                  Delete Selected
                </Button>
              )}
            </div>
          ) : (
            ""
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {columns.map((col, index) => (
                      <TableCell
                        key={index}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {col === "createdAt"
                          ? "date of create"
                          : col === "peopleNum"
                          ? "num of people"
                          : col === "tourId"
                          ? "tour"
                          : col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.map((item) => (
                    <TableRow
                      key={item.id}
                      className={`row-scroll-${item.id} ${
                        page === "tours" &&
                        highlightIds.includes(item.id.toString())
                          ? "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 dark:from-yellow-800 dark:via-yellow-600 dark:to-yellow-500 shadow-lg transform transition-all duration-300 ease-in-out"
                          : ""
                      }`}
                    >
                      {columns.map((col) => {
                        if (col === "actions") {
                          return (
                            <TableCell
                              key="actions"
                              className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                            >
                              {edit && (
                                <Button
                                  variant="primary"
                                  size="xs"
                                  onClick={() => {
                                    setFormData({ ...item });
                                    openModal();
                                  }}
                                  endIcon={save ? <PencilIcon /> : ""}
                                  // endIcon={<PencilIcon />}
                                  className="mb-1 sm:mr-1"
                                >
                                  {!save ? (
                                    <EyeIcon className="fill-gray-200 size-3.5" />
                                  ) : (
                                    ""
                                  )}
                                </Button>
                              )}
                              {deletable && (
                                <Button
                                  variant="delete"
                                  size="xs"
                                  onClick={() => handleDelete(item.id)}
                                  endIcon={<TrashBinIcon />}
                                ></Button>
                              )}

                              {selectMode && (
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedIds((prev) => [
                                        ...prev,
                                        item.id,
                                      ]);
                                    } else {
                                      setSelectedIds((prev) =>
                                        prev.filter((id) => id !== item.id)
                                      );
                                    }
                                  }}
                                  className="mt-2 sm:ml-2 w-5 h-5 appearance-none cursor-pointer dark:border-gray-500 border border-gray-400 checked:border-transparent rounded-md checked:bg-brand-500"
                                />
                              )}
                            </TableCell>
                          );
                        }

                        const cellValue = item[col as keyof T];
                        const isDate =
                          (col === "createdAt" || col === "created_at") &&
                          typeof cellValue === "string";

                        return (
                          <TableCell
                            key={col}
                            className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                          >
                            {col === "image" ? (
                              <div className="w-auto h-auto rounded-xl">
                                <img
                                  width={40}
                                  height={40}
                                  src={String(cellValue)}
                                  alt={(item as any).title}
                                />
                              </div>
                            ) : (
                              <>
                                {isDate ? (
                                  new Date(cellValue).toLocaleDateString()
                                ) : col === "tourId" ? (
                                  <a
                                    href="#"
                                    target="_blank"
                                    className="text-blue-500"
                                  >
                                    see tour
                                  </a> //href={`https://your-domain/all-tours/${String(cellValue)}`}
                                ) : col === "status" ||
                                  col === "bestOffer" ||
                                  col === "experience" ||
                                  col === "adventures" ? (
                                  <Badge
                                    size="sm"
                                    color={
                                      String(cellValue) === "active" ||
                                      String(cellValue) === "true"
                                        ? "success"
                                        : "error"
                                    }
                                  >
                                    {String(cellValue)}
                                  </Badge>
                                ) : (
                                  String(cellValue)
                                )}
                              </>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isOpen}
        className="max-w-[900px] m-4"
        onClose={() => {
          setFormData({});
          closeModal();
        }}
      >
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update details.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleUpdate}>
            <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  {Object.entries(formData).map(([key, value]) => {
                    const isSystemField = [
                      "id",
                      "createdAt",
                      "updatedAt",
                      "subscribe",
                      "status",
                    ].includes(key);
                    if (isSystemField) return null;

                    if (key === "gallery" && Array.isArray(value)) {
                      return (
                        <div key={key} className="col-span-2 space-y-2">
                          <Label>Gallery</Label>

                          <div className="flex flex-wrap gap-4">
                            {value.map((item, index) => {
                              // if (typeof item.image !== "string") return null;

                              const src =
                                item.image instanceof File
                                  ? URL.createObjectURL(item.image)
                                  : item.image;

                              return (
                                <div
                                  key={index}
                                  className="relative w-62 h-62 border rounded overflow-hidden mb-2"
                                >
                                  <img
                                    src={src}
                                    alt={`gallery-${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        gallery: prev.gallery.filter(
                                          (_: any, i: number) => i !== index
                                        ),
                                      }))
                                    }
                                    className="absolute top-1 right-1 bg-red-500 text-xs px-2 py-1 rounded-full text-white hover:bg-opacity-75"
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <ImageGalleryUploader
                            showimageList={false}
                            onFilesSelect={(files) => {
                              const newFiles = files.filter(
                                (file) =>
                                  !formData.gallery?.some(
                                    (item: any) =>
                                      item.image instanceof File &&
                                      item.image.name === file.name &&
                                      item.image.size === file.size
                                  )
                              );

                              const formattedFiles = newFiles.map((file) => ({
                                image: file,
                              }));

                              setFormData((prev) => ({
                                ...prev,
                                gallery: [
                                  ...(prev.gallery || []),
                                  ...formattedFiles,
                                ],
                              }));
                            }}
                          />
                        </div>
                      );
                    }

                    const inputType = (() => {
                      if (key.includes("Id") || key.includes("_id"))
                        return "select";

                      const lowerKey = key.toLowerCase();

                      if (lowerKey.includes("image") || value instanceof File)
                        return "file";

                      if (typeof value === "number") return "number";
                      if (typeof value === "boolean") return "checkbox";
                      if (typeof value === "string") {
                        if (lowerKey.includes("email")) return "email";
                        if (lowerKey.includes("password")) return "password";
                        if (lowerKey.includes("date")) return "datetime-local";
                        if (
                          lowerKey.includes("description") ||
                          lowerKey.includes("content") ||
                          lowerKey.includes("message") ||
                          lowerKey.includes("comment")
                        )
                          return "textarea";
                        return "text";
                      }
                      return "text";
                    })();

                    return (
                      <div key={key} className="col-span-2">
                        <Label>{key}</Label>
                        {inputType === "checkbox" ? (
                          <Checkbox
                            id={key}
                            label={key}
                            checked={Boolean(value)}
                            onChange={(checked: boolean) =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]: checked,
                              }))
                            }
                          />
                        ) : inputType === "textarea" ? (
                          <TextArea
                            value={String(value)}
                            onChange={(val: string) =>
                              setFormData((prev) => ({ ...prev, [key]: val }))
                            }
                            placeholder={`Enter ${key}`}
                            rows={4}
                            required
                          />
                        ) : inputType === "file" ? (
                          <DragAndDropImageUpload
                            onFileSelect={(file) => {
                              setFormData((prev) => ({
                                ...prev,
                                [key]: file,
                              }));
                            }}
                            defaultPreview={value || undefined}
                          />
                        ) : inputType === "select" ? (
                          <Select
                            options={typeOptions}
                            defaultValue={String(value)}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]: value,
                              }))
                            }
                            placeholder={`Select ${key}`}
                            required
                          />
                        ) : (
                          <Input
                            type={inputType}
                            value={
                              inputType == "datetime-local"
                                ? new Date(value).toISOString().slice(0, 16)
                                : value
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                [key]:
                                  inputType === "number"
                                    ? +e.target.value
                                    : e.target.value,
                              }))
                            }
                            required
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({});
                  closeModal();
                }}
              >
                Close
              </Button>
              {save && (
                <Button size="sm" type="submit">
                  Save Changes
                </Button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
