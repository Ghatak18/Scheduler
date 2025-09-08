import { DateTime } from "luxon";
import {
  RecurringSlot,
  ExceptionSlot,
  CalenderEvent,
  DayOfWeek,
} from "../types/slot.types";

export class SlotGenerationService {
  private dayOfWeekMap: Record<DayOfWeek, number> = {
    Sunday: 7,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  async generteSlotsForDateRange(
    recurringSlots: RecurringSlot[],
    exceptionSlots: ExceptionSlot[],
    startDateISO: string,
    endDateISO: string
  ): Promise<CalenderEvent[]> {
    console.log("🔍 DEBUG - Input data:", {
      recurringSlotsCount: recurringSlots.length,
      exceptionsCount: exceptionSlots.length,
      exceptions: exceptionSlots,
      startDate: startDateISO,
      endDate: endDateISO,
    });
    const start = DateTime.fromISO(startDateISO);
    const end = DateTime.fromISO(endDateISO);

    if (!start.isValid || !end.isValid || end < start) {
      throw new Error("Invalid date range");
    }
    const exceptionMap = this.createExceptionMap(exceptionSlots);
    console.log("🗺️ DEBUG - Exception map:", exceptionMap);
    const dates = this.generateDateRange(start, end);

    const events: CalenderEvent[] = [];

    // const eventsPromises = dates.map((date) =>
    //   this.processDate(date, recurringSlots, exceptionMap)
    // );

    // const eventArrays = await Promise.all(eventsPromises);
    // return eventArrays.flat();

    for (const date of dates) {
      const dateEvents = await this.processDate(date, recurringSlots, exceptionMap);
      events.push(...dateEvents);
    }

    console.log('✅ DEBUG - Final events:', events);
    return events;
  }
  private createExceptionMap(
    exceptions: ExceptionSlot[]
  ): Map<string, ExceptionSlot> {
    const map = new Map<string, ExceptionSlot>();
    exceptions.forEach((exception) => {
      const exceptionDate = new Date(exception.date);
     //const formattedDate = exceptionDate.toISOString().split('T')[0];
    const formattedDate = DateTime.fromJSDate(exceptionDate).toISODate();
    // Use the correct format: YYYY-MM-DD_original_slot_id
    const key = `${formattedDate}_${exception.original_recurring_slot_id}`;
    console.log('🔑 DEBUG - Adding exception key:', key);
    map.set(key, exception);
    });
    return map;
  }

  private generateDateRange(start: DateTime, end: DateTime): DateTime[] {
    const dates: DateTime[] = [];
    let current = start;
    while (current <= end) {
      dates.push(current);
      current = current.plus({ days: 1 });
    }
    return dates;
  }
  private async processDate(
    date: DateTime,
    recurringSlots: RecurringSlot[],
    exceptionMap: Map<string, ExceptionSlot>
  ): Promise<CalenderEvent[]> {
    const currentDateISO = date.toISODate();
    if (!currentDateISO) {
      return [];
    }
    const dayOfWeekNumber = date.weekday;
    const dayofWeekName = this.getDayOfWeekName(dayOfWeekNumber);
    if (!dayofWeekName) {
      return [];
    }
    const events: CalenderEvent[] = [];
    const slotsForDay = recurringSlots.filter(
      (slot) => this.dayOfWeekMap[slot.day_of_week] === dayOfWeekNumber
    );
    for (const slot of slotsForDay) {
      const exceptionKey = `${currentDateISO}_${slot.id}`;
      const exception = exceptionMap.get(exceptionKey);

      if (exception) {
        events.push(this.createEventFromException(exception, currentDateISO));
      } else {
        events.push(this.createEventFromRecurringSlot(slot, currentDateISO));
      }
    }
    return events;
  }

  private getDayOfWeekName(dayOfWeekNumber: number): DayOfWeek | null {
    const days: DayOfWeek[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days[dayOfWeekNumber - 1] || null;
  }

  private createEventFromRecurringSlot(
    slot: RecurringSlot,
    date: string
  ): CalenderEvent {
    const startDateTime = DateTime.fromISO(`${date}T${slot.start_time}`);
    const endDateTime = DateTime.fromISO(`${date}T${slot.end_time}`);
    return {
      id: `recurring_${slot.id}_${date}`,
      original_recurring_slot_id: slot.id, // here is some issue
      date,
      start: startDateTime.toISO() || "",
      end: endDateTime.toISO() || "",
      title: `Recurring ${slot.day_of_week} slot`,
      is_modified: false,
      type: "recurring",
    };
  }

  private createEventFromException(
    exception: ExceptionSlot,
    date: string
  ): CalenderEvent {
    const startDateTime = DateTime.fromISO(`${date}T${exception.start_time}`);
    const endDateTime = DateTime.fromISO(`${date}T${exception.end_time}`);

    return {
      id: `exception_${exception.id}_${date}`,
      original_recurring_slot_id: exception.original_recurring_slot_id, //same here
      date,
      start: startDateTime.toISO() || "",
      end: endDateTime.toISO() || "",
      title: `Modified slot`,
      is_modified: true,
      type: "exception",
    };
  }
}
