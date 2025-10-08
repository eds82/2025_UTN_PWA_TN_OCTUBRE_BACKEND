import mongoose from "mongoose"

const memberWorkspaceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            requires: true
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true
        },
        create_at: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['admin', 'support', 'member'],
            default:'member',
            
        }
    }
)

const MemberWorkspace = mongoose.model('Member', memberWorkspaceSchema)

export default MemberWorkspace