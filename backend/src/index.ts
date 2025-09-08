
// import express,{Request,Response} from "express";
// import dotenv from "dotenv";
// //import 'dotenv/config';
// import db from './db';
// import path from 'path';

// dotenv.config({path: path.resolve(__dirname, './.env')});
// const app = express();
// const sayHello = (name: string): void => {
//   console.log(`Hello, ${name}!`);
// };

// sayHello("Supratik");
// console.log("Server is running...");
// db();
// app.get("/", (req: Request, res: Response): void => {
//   res.send("Hello World!");
// });
// //console.log('All env variables:', process.env);
// const port1 =  process.env.MY_NAME;
// console.log("Port from env:", port1);
// const PORT = process.env.PORT || 3000;  

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import {createApp} from './app';
import knex from "./db";

const PORT = process.env.PORT || 3000;
async function startServer() {
    try{
        await knex.raw('SELECT 1+1 AS result');
        console.log("Database connected successfully.");
        const app = await createApp();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);    
    }
    }

    process.on('SIGINT', async() => {
        console.log("SIGINT received. Closing database connection.");
        await knex.destroy();
        process.exit(0);
    })

    process.on('SIGTERM', async() => {
        console.log("SIGTERM received. Closing database connection.");
        await knex.destroy();
        process.exit(0);
    })

startServer();