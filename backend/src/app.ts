import express from "express";
import cors from "cors";
import { json } from "body-parser";
import {SlotRoutes} from "./routes/SlotRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import {setContainer} from './app/setup'
import knex from "./db";

async function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const container = setContainer(knex);
    const slotRoutes = SlotRoutes(container.slotController);
    
    app.use('/api/slots', slotRoutes);
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'Scheduler API'
        });
    });



    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}

export  {createApp};