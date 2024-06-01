import mongoose from 'mongoose';

const Chat = new mongoose.Schema({
    prompt: { type: String, required: true },
    response: { type: String, required: true },
});

const ChatSchema = mongoose.model('Chat', Chat);

export default ChatSchema;