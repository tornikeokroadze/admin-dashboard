import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";

import { CalendarEvent } from "../types/calendar";
import api from "../services/api";
import { Modal } from "../components/ui/modal";
import { useEvent } from "../hooks/useEvent";
import { useModal } from "../hooks/useModal";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";
import PageMeta from "../components/common/PageMeta";

const calendarsEvents = {
  Personal: "danger",
  Business: "success",
  Family: "primary",
  Holiday: "warning",
  Summary: "secondary",
};

type EventLevel = keyof typeof calendarsEvents;

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    startDate: false,
    eventStatus: false,
  });

  const { events, fetchEvents } = useEvent();
  const { isOpen, openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();

    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end || selectInfo.start);

    start.setHours(start.getHours() + 4);
    end.setHours(end.getHours() + 4);

    const formatForInput = (date: Date) => date.toISOString().slice(0, 16);

    setEventStartDate(formatForInput(start));
    setEventEndDate(formatForInput(end));
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setErrors({
      title: false,
      startDate: false,
      eventStatus: false,
    });

    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);

    setEventTitle(event.title);

    const start = event.start;
    const end = event.end;

    if (start) {
      const adjustedStart = new Date(start);
      adjustedStart.setHours(adjustedStart.getHours() + 4);
      setEventStartDate(adjustedStart.toISOString().slice(0, 16));
    } else {
      setEventStartDate("");
    }

    if (end) {
      const adjustedEnd = new Date(end);
      adjustedEnd.setHours(adjustedEnd.getHours() + 4);
      setEventEndDate(adjustedEnd.toISOString().slice(0, 16));
    } else {
      setEventEndDate("");
    }

    setEventLevel(event.extendedProps.event_level);
    openModal();
  };

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
    setErrors({
      title: false,
      startDate: false,
      eventStatus: false,
    });
  };

  const handleAddOrUpdateEvent = async () => {
    if (!eventTitle || !eventStartDate || !eventLevel) {
      setErrors({
        title: !eventTitle,
        startDate: !eventStartDate,
        eventStatus: !eventLevel,
      });
      return;
    }

    const eventData = {
      title: eventTitle,
      start_date: eventStartDate,
      end_date: eventEndDate,
      event_level: eventLevel,
    };

    try {
      if (selectedEvent) {
        // Update event
        await api.put(`/events/${selectedEvent.id}`, eventData);
        await fetchEvents();
        closeModal();
        resetModalFields();
      } else {
        // Create new event
        await api.post(`/events`, eventData);
        await fetchEvents();
        closeModal();
        resetModalFields();
      }
    } catch (error: any) {
      closeModal();
      if (!error.handled) {
        dispatch(
          showMessage({
            content: `Failed to ${
              selectedEvent ? "update" : "add"
            } event. Please try again.`,
            type: "error",
          })
        );
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await api.delete(`/events/${selectedEvent.id}`);
      await fetchEvents();
      closeModal();
      resetModalFields();
    } catch (error: any) {
      closeModal();
      if (!error.handled) {
        dispatch(
          showMessage({
            content: "Failed to delete event. Please try again.",
            type: "error",
          })
        );
      }
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Calendar Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Calendar Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next addEventButton",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            selectAllow={(selectInfo) => {
              return selectInfo.start >= new Date(); // disallow selecting past
            }}
            // validRange={{
            //   start: new Date().toISOString().split("T")[0], // disables past days
            // }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            // height="auto"
            customButtons={{
              addEventButton: {
                text: "Add Event +",
                click: openModal,
              },
            }}
          />
        </div>

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {selectedEvent ? "Edit Event" : "Add Event"}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan your next big moment: schedule or edit an event to stay on
                track
              </p>
            </div>

            <div className="mt-8">
              <div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Event Title <span className="text-error-500">*</span>{" "}
                  </label>
                  <input
                    id="event-title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEventTitle(value);
                      if (errors.title && value.trim() !== "") {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          title: false,
                        }));
                      }
                    }}
                    className={`${
                      errors.title ? "border-red-500 dark:border-red-500" : ""
                    } dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                  Event Status <span className="text-error-500">*</span>{" "}
                </label>

                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  {Object.entries(calendarsEvents).map(([key, value]) => (
                    <div key={key} className="n-chk">
                      <div
                        className={`form-check form-check-${value} form-check-inline`}
                      >
                        <label
                          className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                          htmlFor={`modal${key}`}
                        >
                          <span className="relative">
                            <input
                              className="sr-only form-check-input"
                              type="radio"
                              name="event-level"
                              value={key}
                              id={`modal${key}`}
                              checked={eventLevel === key}
                              onChange={() => {
                                setEventLevel(key);
                                if (errors.eventStatus && key.trim() !== "") {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    eventStatus: false,
                                  }));
                                }
                              }}
                            />
                            <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                              <span
                                className={`h-2 w-2 rounded-full bg-white ${
                                  eventLevel === key ? "block" : "hidden"
                                }`}
                              ></span>
                            </span>
                          </span>
                          <span
                            className={`${
                              errors.eventStatus ? "text-red-500" : ""
                            }`}
                          >
                            {key}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter Start Date <span className="text-error-500">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    id="event-start-date"
                    type="datetime-local"
                    value={eventStartDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEventStartDate(value);
                      if (errors.startDate && value.trim() !== "") {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          startDate: false,
                        }));
                      }
                    }}
                    className={`${
                      errors.startDate
                        ? "border-red-500 dark:border-red-500"
                        : ""
                    } dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`}
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Enter End Date
                </label>
                <div className="relative">
                  <input
                    id="event-end-date"
                    type="datetime-local"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={() => {
                  closeModal();
                  resetModalFields();
                }}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleAddOrUpdateEvent}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                {selectedEvent ? "Update Changes" : "Add Event"}
              </button>
              {selectedEvent && (
                <button
                  onClick={handleDeleteEvent}
                  className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 sm:w-auto"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const eventLevel = eventInfo.event.extendedProps.event_level as EventLevel;
  const color = calendarsEvents[eventLevel] || "default";
  const colorClass = `fc-bg-${color}`;

  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-time !font-light text-gray-700 mr-1">
        {eventInfo.timeText}
      </div>
      <div className="fc-event-title">
        {eventInfo.event.title.length > 20
          ? `${eventInfo.event.title.slice(0, 12)}...`
          : eventInfo.event.title}
      </div>
    </div>
  );
};

export default Calendar;
