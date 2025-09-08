import {Knex} from 'knex';
import { ExceptionSlot } from '../types/slot.types';


export class ExceptionSlotModel {
    constructor(private knex: Knex) {}

    async findByDateRange(startDate: string, endDate: string): Promise<ExceptionSlot[]> {
        return this.knex<ExceptionSlot>('exception_slots')
            .whereBetween('date', [startDate, endDate])
            .select('*');
    }

    async findByDateAndSlotId(date: string, original_recurring_slot_id: number): Promise<ExceptionSlot | null> {
        const slot = await this.knex<ExceptionSlot>('exception_slots')
            .where({ date, original_recurring_slot_id })
            .first();
        return slot || null;
    }
    async create(slot: Omit<ExceptionSlot, 'id' | 'created_at' | 'updated_at'>): Promise<ExceptionSlot> {
        const [newSlot] = await this.knex<ExceptionSlot>('exception_slots')
            .insert(slot)
            .returning('*');
        return newSlot;
    }

    async update(id: number, updates: Partial<Omit<ExceptionSlot, 'id' | 'created_at' | 'updated_at'>>): Promise<ExceptionSlot | null> {
        const [updatedExceptionSlot] = await this.knex<ExceptionSlot>('exception_slots')
            .where({ id })
            .update(updates)
            .returning('*');
        return updatedExceptionSlot || null;
    }
    async delete(id: number): Promise<boolean> {
        const result = await this.knex('exception_slots')
            .where({ id })
            .del();
        return result > 0;
    }
}