import {Request, Response, NextFunction} from "express";
import { DayOfWeek } from "../types/slot.types";

export function validateDateParams(req: Request, res: Response, next: NextFunction) {
    const { startDate, endDate } = req.query;
    if(typeof startDate !== 'string' || typeof endDate !== 'string'){
        return res.status(400).json({error: "startDate and endDate are required as query parameters"});
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if(isNaN(start.getTime()) || isNaN(end.getTime())){
        return res.status(400).json({error: "startDate and endDate must be valid dates"});
    }
    if(start > end){
        return res.status(400).json({error: "startDate cannot be after endDate"});
    }
    next();
}

export function validateTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/; 
    return timeRegex.test(time);
}

export function validateRecurringSlot(req: Request, res: Response, next: NextFunction):void {
    const { day_of_week, start_time, end_time } = req.body;
    if(!day_of_week || !start_time || !end_time){
        res.status(400).json({error: "day_of_week, start_time and end_time are required in the request body"});
        return;
    }
     const validDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  if (!validDays.includes(day_of_week)) {
    res.status(400).json({ error: 'Invalid dayOfWeek' });
    return;
  }
    if(!validateTimeFormat(start_time) || !validateTimeFormat(end_time)){
        res.status(400).json({error: "start_time and end_time must be in HH:MM or HH:MM:SS format"});
        return;
    }
    next();
}