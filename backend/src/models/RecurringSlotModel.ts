import { Knex } from "knex";
//import { DateTime } from "luxon";
import { RecurringSlot, DayOfWeek } from "../types/slot.types";

export class RecurringSlotModel {
    constructor(private knex: Knex) {}

    async findAll(): Promise<RecurringSlot[]> {
        return this.knex<RecurringSlot>('recurring_slots').select('*');
    }

    async findByDayOfWeek(day_of_week: DayOfWeek): Promise<RecurringSlot[]> {
        return this.knex<RecurringSlot>('recurring_slots')
            .where({ day_of_week})
            .select('*');
    }  //there may be some problem 

    async countByDayOfWeek(day_of_week: DayOfWeek): Promise<number> {
        const result = await this.knex<RecurringSlot>('recurring_slots')
            .where({ day_of_week })
            .count('* as count')
            .first() as { count: string | number } | undefined;
        //return result ? parseInt(result.count as string, 10) : 0;
        return parseInt(result?.count as string, 10) || 0;
    }

    async create(slot: Omit<RecurringSlot, 'id' | 'created_at' | 'updated_at'>): Promise<RecurringSlot> {
        const [newSlot] = await this.knex<RecurringSlot>('recurring_slots')
            .insert(slot)
            .returning('*');
        return newSlot;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.knex('recurring_slots')
            .where({ id })
            .del();
        return result > 0;
    }
}