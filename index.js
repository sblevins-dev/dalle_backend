import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './mongoDB/connect.js'
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'
import chatRoutes from './routes/gptRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/chat', chatRoutes)

app.get('/', async (req, res) => {
    res.send('Hello From DALL-E');
})

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(5555, () => console.log('Server has started on port 5555'));
    } catch (error) {
        console.log(error);
    }
}

startServer();