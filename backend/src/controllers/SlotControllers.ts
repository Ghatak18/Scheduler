import {Request, Response} from "express";
import {SlotService} from "../services/SlotService";
import { DayOfWeek } from "../types/slot.types";
import { parse } from "path";

export class SlotController {
    constructor(private slotService: SlotService){}

    async getSlots(req: Request, res: Response){
        try {
            const { startDate, endDate } = req.query;
            if(typeof startDate !== 'string' || typeof endDate !== 'string'){
                return res.status(400).json({error: "startDate and endDate are required as query parameters"});
            }
            const slots = await this.slotService.getSlotsForDateRange(startDate, endDate);
            res.json(slots);
        } catch (error) {
            console.error("Error fetching slots:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    async createRecurringSlot(req: Request, res: Response){
        try {
            const { day_of_week, start_time, end_time } = req.body;
            if(!day_of_week || !start_time || !end_time){
                return res.status(400).json({error: "day_of_week, start_time and end_time are required in the request body"});
            }
            if(!['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day_of_week)){
                return res.status(400).json({error: "day_of_week must be a valid day"});
            }

            const slot = await this.slotService.createRecurringSlot(day_of_week as DayOfWeek, start_time, end_time);
            res.status(201).json(slot);
        }catch (error) {
            if (error instanceof Error && error.message.includes("Cannot create more than 2 recurring slots")) {
                return res.status(400).json({ error: error.message });
            }
            console.error("Error creating recurring slot:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    async createExceptionSlot(req: Request, res: Response){
        try {
            const { original_recurring_slot_id, date, start_time, end_time } = req.body;
            if(!original_recurring_slot_id || !date || !start_time || !end_time){
                return res.status(400).json({error: "original_recurring_slot_id, date, start_time and end_time are required in the request body"});
            }
            const exception =  await this.slotService.createEXpceptionSlot(
                parseInt(original_recurring_slot_id as string, 10),
                date as string,
                start_time as string,
                end_time as string
            );
            res.status(201).json(exception);
        } catch (error) {
            console.error("Error creating exception slot:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    async deleteRecurringSlot(req: Request, res: Response){
        try {
            const { id } = req.params;  
            if(!id){
                return res.status(400).json({error: "id is required in the request params"});
            }
            const sucess = await this.slotService.deleteRecurringSlot(parseInt(id,10));
            if(!sucess){
                return res.status(404).json({error: "Recurring slot not found"});

            }
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting recurring slot:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }

    async deleteExceptionSlot(req: Request, res: Response){
        try {
            const { id } = req.params;  
            if(!id){
                return res.status(400).json({error: "id is required in the request params"});
            }
            const sucess = await this.slotService.deleteExceptionSlot(parseInt(id,10));
            if(!sucess){
                return res.status(404).json({error: "Exception slot not found"});
            }
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting exception slot:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
}
}

