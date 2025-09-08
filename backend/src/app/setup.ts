import {Knex} from 'knex';
import { RecurringSlotModel } from '../models/RecurringSlotModel';
import { ExceptionSlotModel } from '../models/ExceptionSlotModel';
import { SlotGenerationService } from '../services/SlotGenerationService';
import { SlotService } from '../services/SlotService';
import { SlotController } from '../controllers/SlotControllers';

export function setContainer(knex: Knex) {
    const recurringSlotModel = new RecurringSlotModel(knex);
    const exceptionSlotModel = new ExceptionSlotModel(knex);
    const slotGenerationService = new SlotGenerationService();
    const slotService = new SlotService(recurringSlotModel, exceptionSlotModel, slotGenerationService);
    const slotController = new SlotController(slotService);
    return { recurringSlotModel, exceptionSlotModel, slotGenerationService, slotService, slotController };
}

