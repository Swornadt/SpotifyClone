import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    }, //clerk ids
    receiverId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export const Message = mongoose.model("Message", messageSchema);