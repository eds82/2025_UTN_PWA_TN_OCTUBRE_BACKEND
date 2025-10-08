import mongoose from "mongoose"

const messageChannelSchema = new mongoose.Schema(
    {
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MemberWorkspace",
            required: true
        },
        create_at: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['admin', 'support', 'user'],
            default:'user',
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }
)

const MessagesChannel = mongoose.model('Message', messageChannelSchema)

export default MessagesChannel