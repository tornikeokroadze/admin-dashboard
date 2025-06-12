import { useState, useEffect } from "react";
import io from "socket.io-client";

import api from "../services/api";
import { CalendarEvent } from "../types/calendar";
import { useAppDispatch } from "../redux/hooks";
import { showMessage } from "../redux/slices/messageSlice";

const socket = io("http://localhost:5500");

export const useEvent = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchEvents();

    // Listen for event creation, update, and deletion
    socket.on("event:created", (newEvent) => {
      const formatted = {
        ...newEvent,
        start: new Date(newEvent.start_date),
        end: new Date(newEvent.end_date),
        display: "block",
      };
      setEvents((prevEvents) => [...prevEvents, formatted]);
    });

    socket.on("event:updated", (updatedEvent) => {
      const formatted = {
        ...updatedEvent,
        start: new Date(updatedEvent.start_date),
        end: new Date(updatedEvent.end_date),
        display: "block",
      };

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === formatted.id ? formatted : event
        )
      );
    });

    socket.on("event:deleted", ({ id }) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => String(event.id) !== String(id))
      );
    });

    // Cleanup on component unmount
    return () => {
      socket.off("event:created");
      socket.off("event:updated");
      socket.off("event:deleted");
      // socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");

      const eventsData = response.data.data;

      if (Array.isArray(eventsData)) {
        const formattedEvents = eventsData.map((event: CalendarEvent) => {
          const start = new Date(event.start_date);
          const end = new Date(event.end_date);

          return {
            id: event.id,
            title: event.title,
            start: start.toISOString(),
            end: end.toISOString(),
            event_level: event.event_level,
            display: "block",
          };
        });

        setEvents(formattedEvents);
      } else {
        console.error("Fetched data is not an array:", eventsData);
      }
    } catch (error) {
      dispatch(
        showMessage({
          content: "Failed to load events. Please try again.",
          type: "error",
        })
      );
    }
  };
  return { events, fetchEvents };
};
