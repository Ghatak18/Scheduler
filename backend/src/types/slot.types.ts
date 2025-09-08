export type DayOfWeek = 'Sunday'| 'Monday'| 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

 export interface RecurringSlot {
    id: number;
    day_of_week: DayOfWeek; 
    start_time: string; 
    end_time: string;   
    created_at?: Date;
    updated_at?: Date;
}
export interface ExceptionSlot {
    id: number;
    original_recurring_slot_id: number; 
    date: string; 
    start_time: string; 
    end_time: string;   
    created_at?: Date;
    updated_at?: Date;
}
export interface CalenderEvent {
    id: string;
    original_recurring_slot_id: number | null;
    date: string;
    start: string;
    end: string;
    title: string;
    is_modified: boolean; 
    type: 'recurring' | 'exception';
}

export interface DateRange{
    startDate: string; 
    endDate: string;   
}