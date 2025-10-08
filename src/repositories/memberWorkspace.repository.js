import MemberWorkspace from "../models/MemberWorkspace.model.js"
import { ServerError } from "../utils/customError.utils.js"

class MemberWorkspaceRepository {
    static async getAllWorkspacesByUserId (user_id){
        //Traer todos los workspace de los que soy miembro
        const workspaces_que_soy_miembro = await MemberWorkspace
        .find({user: user_id})
        .populate('workspace')   //Expandimos la propiedad de workspace, para que nos traiga el workspace completo

        console.log(workspaces_que_soy_miembro)
    }

    static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id){
        const member_workspace = await MemberWorkspace.findOne({user: user_id, workspace: workspace_id})
        return member_workspace
    }
    static async create (user_id, workspace_id, role = 'member'){
        //Logica de interaccion con la DB para crear el usuario
        const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id)
        if(member) {
            throw new ServerError(400, 'El usuario ya es miembre del workspace')
        }
        await MemberWorkspace.insertOne({
            user: user_id,
            workspace: workspace_id,
            role: role
        })
    }
    
}
/* class MemberworkspaceRepository {
    static async createMemberWorkspace(user_id, workspace_id){
        //Logica de interaccion con la DB para crear el usuario
        await MemberWorkspace.create({
            user_id,
            workspace_id,
        })
        return true
    }

    static async getAll (){
        //.find es un metodo para hacer filtro en una coleccion
        const memberWorkspace = await MemberWorkspace.find()
        return memberWorkspace
    }

    static async getById (memberWorkspace_id){
        const memberWorkspace_found = await MemberWorkspace.findById(memberWorkspace_id)
        return memberWorkspace_found
    }
    
    static async deleteById (memberWorkspace_id){
        await MemberWorkspace.findByIdAndDelete(memberWorkspace_id)       //Etse metodo indica: encontrar por id y eliminar
        return true
    }

    static async updateById (memberWorkspace_id, new_values){
        const memberWorkspace_updated = await MemberWorkspace.findByIdAndUpdate(     // Este metodo significa: encontrar por id y actualizar
            memberWorkspace_id, 
            new_values, 
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            } 
        )
        return memberWorkspace_updated
    }
} */

    export default MemberWorkspaceRepository