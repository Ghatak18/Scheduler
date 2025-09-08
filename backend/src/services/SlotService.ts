import { RecurringSlotModel } from "../models/RecurringSlotModel";
import { ExceptionSlotModel } from "../models/ExceptionSlotModel";
import { SlotGenerationService } from "./SlotGenerationService";
import { DayOfWeek } from "../types/slot.types";


export class SlotService {
    constructor(
        private recurringSlotModel: RecurringSlotModel,
        private exceptionsSlotModel: ExceptionSlotModel,
        private slotGenerationService: SlotGenerationService
         // You can define ExceptionSlotModel similarly to RecurringSlotModel
    ){}

    async getSlotsForDateRange(startDate: string, endDate: string) {
        const [recurringSlots, exceptionSlots] = await Promise.all([
            this.recurringSlotModel.findAll(),
            this.exceptionsSlotModel.findByDateRange(startDate, endDate)
        ]);
        return this.slotGenerationService.generteSlotsForDateRange(
            recurringSlots,
            exceptionSlots,
            startDate,
            endDate
        );
    }

    async createRecurringSlot(day_of_week: DayOfWeek, start_time: string, end_time: string){
        const existingCount = await this.recurringSlotModel.countByDayOfWeek(day_of_week);
        if(existingCount >= 2){
            throw new Error(`Cannot create more than 2 recurring slots for ${day_of_week}`);
        }
        return this.recurringSlotModel.create({day_of_week, start_time, end_time});
    }

    async createEXpceptionSlot(original_recurring_slot_id: number, date: string, start_time: string, end_time: string){
        const existingException = await this.exceptionsSlotModel.findByDateAndSlotId(date, original_recurring_slot_id);
        if(existingException){
            return this.exceptionsSlotModel.update(existingException.id, {start_time, end_time});
    }
        return this.exceptionsSlotModel.create({original_recurring_slot_id, date, start_time, end_time});
    }
    async deleteRecurringSlot(id: number): Promise<boolean>{
        return this.recurringSlotModel.delete(id);
    }
    async deleteExceptionSlot(id: number): Promise<boolean>{
        return this.exceptionsSlotModel.delete(id);
    }
}