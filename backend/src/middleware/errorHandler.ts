import { time } from "console";
import {Request, Response, NextFunction} from "express";
import path from "path";

export interface ApppError extends Error {
    statusCode?: number;
}

export function errorHandler(err: ApppError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error',
            statusCode: statusCode,
            path: req.path,
            timestamp: new Date().toISOString(),
            stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
        }
    });
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        error: {
            message: 'Not Found',
            statusCode: 404,
            timestamp: new Date().toISOString()
        }
    });
}