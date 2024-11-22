import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import routes from "./routes.js";

dotenv.config();
const app = express();
app.set('env', process.env.ENV);

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(cors({
    origin: [process.env.URL],
}));

app.use(express.json());

// Подключение маршрутов
app.use("/", routes);

// Проверка сервера
app.listen(4444, (err) => {
    if (err) {
        return console.log("Server is not working! Bad!");
    }
    console.log("Server is working! Good!");
});
