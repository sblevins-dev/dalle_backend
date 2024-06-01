import express from 'express';
import { OpenAI } from 'openai'
import * as dotenv from 'dotenv'

import Chat from '../mongoDB/models/chat.js'

dotenv.config();

const openaiAPI = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const router = express.Router();

// Find all chats in DB
router.route('/').get(async (req, res) => {
    try {
        const chats = await Chat.find({});

        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
})

// Find by chat by Id
router.route('/find').get(async (req, res) => {
    try {
        // Assuming you're passing an ID in the request query parameter 'id'
        const itemId = req.query.id;

        // Find the item by ID in the MongoDB collection using Mongoose
        const foundItem = await Chat.findById(itemId);

        if (!foundItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // If the item is found, send it back in the response
        res.status(200).json(foundItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get a response chat from Chat-GPT
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

        res.status(200).json({ success: true, response, newChat })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to retrieve a response' })
        console.log(error)
    }
})

export default router;