
import express,{Request,Response} from "express";
import dotenv from "dotenv";
import 'dotenv/config';
import db from './db.ts';

// dotenv.config();
const app = express();
const sayHello = (name: string): void => {
  console.log(`Hello, ${name}!`);
};

sayHello("Supratik");
console.log("Server is running...");
db();
app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});
//console.log('All env variables:', process.env);
const port1 =  process.env.MY_NAME;
console.log("Port from env:", port1);
const PORT = process.env.PORT || 3000;  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
