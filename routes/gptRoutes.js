import express from 'express';
import { OpenAI } from 'openai'
import * as dotenv from 'dotenv'

import Chat from '../mongoDB/models/chat.js'

dotenv.config();

const openaiAPI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const router = express.Router();

router.route('/').get(async (req, res) => {
    try {
        const chats = await Chat.find({});

        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
})

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

        const newChat = await Chat.create({
            prompt: userText,
            response: response.choices[0].message.content
        })

        res.status(200).json({ success: true, response, newChat})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to retrieve a response'})
        console.log(error)
    }
})

export default router;