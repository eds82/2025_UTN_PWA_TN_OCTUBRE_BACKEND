import Channels from "../models/Channel.model.js"


class ChannelRepository {
    static async createChannel(name, workspace_id){
        //Logica de interaccion con la DB para crear el usuario
        await Channels.create({
            name: name,
            workspace_id,
        })
        return true
    }

    static async getAll(){
        //.find es un metodo para hacer filtro en una coleccion
        const channels = await Channels.find()
        return channels
    }

    static async getById(channel_id){
        const channel_found = await Channels.findById(channel_id)
        return channel_found
    }
    
    static async deleteById(channel_id){
        await Channels.findByIdAndDelete(channel_id)       //Etse metodo indica: encontrar por id y eliminar
        return true
    }

    static async updateById(channel_id, new_values){
        const channel_updated = await Channels.findByIdAndUpdate(     // Este metodo significa: encontrar por id y actualizar
            channel_id, 
            new_values, 
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            } 
        )

        return channel_updated
    }
}

export default ChannelRepository