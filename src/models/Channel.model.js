import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    workspace:{
        type: mongoose.Schema.Types.ObjectId,     //Aca voy a marcar que el tipo de dato que voy a guardar en esta propiedad, es de tipo objectId
        ref: "Workspace",   //Con ref estoy marcando que esto esta relacionado con los workspaces
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    modified_at: {
        type: Date,
        default: null
    }
})

const Channels = mongoose.model('Channel', channelSchema)

export default Channels