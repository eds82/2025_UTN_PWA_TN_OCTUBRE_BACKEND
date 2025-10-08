import Workspaces from "../models/workspace.model.js"

class WorkspaceRepository{
    //getAll
    //getById
    //create
    //updateById
    //deletedById
    static async createWorkspace(name, url_image){
        //Logica de interaccion con la DB para crear el usuario
        await Workspaces.insertOne({
            name: name,
            url_image: url_image,
        })
        return true
    }

    static async getAll (){
        //.find es un metodo para hacer filtro en una coleccion
        const workspaces = await Workspaces.find()
        return workspaces
    }

    static async getById(workspace_id){
        const workspace_found = await Workspaces.findById(workspace_id)
        return workspace_found
    }
    
    static async deleteById(workspace_id){
        await Workspaces.findByIdAndDelete(workspace_id)       //Etse metodo indica: encontrar por id y eliminar
        return true
    }

    static async updateById(workspace_id, new_values){
        const workspace_updated = await Workspaces.findByIdAndUpdate(     // Este metodo significa: encontrar por id y actualizar
            workspace_id, 
            new_values, 
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            } 
        )

        return workspace_updated
    }
}

export default WorkspaceRepository