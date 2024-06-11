import express from 'express'
import * as dotenv from 'dotenv'
import { OpenAI } from 'openai'

dotenv.config();

const router = express.Router();

const openaiAPI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E');
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openaiAPI.images.generate({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        })

        const image = aiResponse.data[0].b64_json;

        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error.error.message);
        if (error && error.error && error.error.message)
            res.status(500).send(error.error.message);
        else
            res.status(500).send("An Error occurred.");
    }
})

export default router;