
import express,{Request,Response} from "express";
const app = express();
const sayHello = (name: string): void => {
  console.log(`Hello, ${name}!`);
};

sayHello("Supratik");
console.log("Server is running...");

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;      
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
