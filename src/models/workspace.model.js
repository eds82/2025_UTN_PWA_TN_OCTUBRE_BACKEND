//En base a lo aprendido en User.model.js ahora crear el workspace.model.js
//name, url_image, modified_at, created_at, active
import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        url_image: {
            type: String,
        },
        create_at: {
            type: Date,
            default: Date.now
        },
        modified_at: {
            type: Date,
            default: null
        },
        active: {
            type: Boolean,
            default: true
        },
    }
)

const Workspaces = mongoose.model('Workspace', workspaceSchema)

export default Workspaces