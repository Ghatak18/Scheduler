import {Router} from "express";
import {SlotController} from "../controllers/SlotControllers";

export function SlotRoutes(slotController: SlotController): Router {
    const router = Router();
    router.get('/', (req, res) => slotController.getSlots(req, res));
    router.post('/recurring', (req, res) => slotController.createRecurringSlot(req, res));
    router.post('/exception', (req, res) => slotController.createExceptionSlot(req, res));
    router.delete('/recurring/:id',(req,res)=> slotController.deleteRecurringSlot(req,res));
    router.delete('/exception/:id',(req,res)=> slotController.deleteExceptionSlot(req,res));
    return router;

}