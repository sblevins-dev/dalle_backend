import express from 'express';
import { OpenAI } from 'openai'
import * as dotenv from 'dotenv'

dotenv.config();

const openaiAPI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const router = express.Router();

router.route('/').post(async (req, res) => {
    try {
        const { userText } = req.body;

        const response = await openaiAPI.chat.completions.create({
            messages: [{
                role: "user",
                content: userText,
            }],
            model: "gpt-3.5-turbo-1106"
        })

        res.status(200).json({ success: true, response})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to retrieve a response'})
        console.log(error)
    }
})

export default router;