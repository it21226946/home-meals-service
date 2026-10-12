import 'dotenv/config';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import mealRoutes from './routes/mealRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import mealRequestRoutes from './routes/mealRequestRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import specialAlertRoutes from './routes/specialAlert.routes.js';
import { Router } from 'express';
import CORS from 'cors';
import express from 'express';
import { isCloudinaryConfigured } from './services/cloudinaryConfig.js';

const app = express();

app.use(CORS({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let isConnecting = false;
async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) return;
    if (isConnecting) return;
    if (!process.env.DATABASE_URL) {
        console.error('FATAL: DATABASE_URL is not set. Copy .env.example to .env and add your MongoDB connection string.');
        return;
    }
    try {
        isConnecting = true;
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.DATABASE_URL, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err.message);
    } finally {
        isConnecting = false;
    }
}

app.use(async (req, res, next) => {
    if (mongoose.connection.readyState < 1) {
        await connectToDatabase();
    }
    next();
});

const router = Router();

router.get('/', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
        dbState === 1 ? 'connected' :
        dbState === 2 ? 'connecting' :
        dbState === 3 ? 'disconnecting' : 'disconnected';

    res.status(200).json({
        message: 'Home Meals Service API',
        database: dbStatus,
        cloudinary: isCloudinaryConfigured() ? 'configured' : 'not configured (image uploads disabled)',
    });
});

app.use('/', router);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/meal-requests', mealRequestRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/special-alerts', specialAlertRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

if (!process.env.VERCEL) {
    if (!process.env.JWT_KEY) {
        console.error('FATAL: JWT_KEY is not set. Copy .env.example to .env and add a secret string for JWT signing.');
    }
    connectToDatabase().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Reachable on your LAN at http://<your-computer-ip>:${PORT}`);
            if (isCloudinaryConfigured()) {
                console.log(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
            } else {
                console.log('Cloudinary: not configured (optional image uploads will return 503 until configured)');
            }
        });
    });
}

export default app;

