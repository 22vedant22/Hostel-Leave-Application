import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import AuthRoute from './routes/Auth.route.js';
import leaveRoutes from "./routes/leave.routes.js";
import UserRoute from './routes/User.route.js';
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

//routr setup

app.use('/api/auth', AuthRoute)
app.use("/api/leaves", leaveRoutes);
app.use('/api/user', UserRoute)
mongoose.connect(process.env.MONGODB_CONN, { dbName: 'Hostel-Leave-Management' })
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Database connection failed:", err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})