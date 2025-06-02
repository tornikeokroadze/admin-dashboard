import { EventInput } from "@fullcalendar/core";

export interface CalendarEvent extends EventInput {
  event_level: string;
}
