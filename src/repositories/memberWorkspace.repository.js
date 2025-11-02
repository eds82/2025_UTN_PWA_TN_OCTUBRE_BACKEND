import pool from "../config/nysql.config.js"
import MemberWorkspace from "../models/MemberWorkspace.model.js"
import { ServerError } from "../utils/customError.utils.js"
import { WORKSPACE_TABLE } from "./workspace.repository.js"


/* 
_id	role	user	workspace	created_at	modified_at
*/
const MEMBER_WORKSPACE_TABLE = {
    NAME: "MembersWorkspace",
    COLUMNS: {
        ID: '_id',
        ROLE: 'role',
        FK_USER: 'user',
        FK_WORKSPACE: 'workspace',
        CREATED_AT: 'created_at',
        MODIFIED_AT: 'modified_at'
    }
}

class MemberWorkspaceRepository {
    /* static async getAllWorkspacesByUserId (user_id){
        //Traer todos los workspace de los que soy miembro
        const workspaces_que_soy_miembro = await MemberWorkspace
        .find({user: user_id})
        .populate({
            path: 'workspace',
            match: {active: true}
        })   //Expandimos la propiedad de workspace, para que nos traiga el workspace completo

        console.log(workspaces_que_soy_miembro)
    } */
    static async getAllWorkspacesByUserId (user_id){
        /* 
        CRITERIO DE UNION
            Traer registros cuando el registro de miembro coincida en FK_WORKSPACE = WORKSPACE.ID 
        CONDICION
            Solo cuando la propiedad del miembro fk_id_user coincida con el user_id proporcionado
            Y
            El workspace este activo
        */
        const query = `
            SELECT 
                MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.ID} AS member_id,
                MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_USER} AS user_id,
                MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_WORKSPACE} AS workspace_id,
                MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.ROLE} AS member_role,
                MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.CREATED_AT} AS member_created_at,

                W.${WORKSPACE_TABLE.COLUMNS.NAME} AS workspace_name,
                W.${WORKSPACE_TABLE.COLUMNS.URL_IMAGE} AS workspace_url_image,
                W.${WORKSPACE_TABLE.COLUMNS.CREATED_AT} AS workspace_created_at

            FROM ${MEMBER_WORKSPACE_TABLE.NAME} MW 
            JOIN ${WORKSPACE_TABLE.NAME} W ON MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_WORKSPACE} = W.${WORKSPACE_TABLE.COLUMNS.ID}
            WHERE MW.${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_USER} = ?  AND W.${WORKSPACE_TABLE.COLUMNS.ACTIVE} = 1
        `
        const [result] = await pool.execute(query, [user_id])
        return result
    }
    

    static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id){
        const query = `SELECT * FROM ${MEMBER_WORKSPACE_TABLE.NAME} WHERE ${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_USER} = ? AND ${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_WORKSPACE} = ?`
        const [result] = await pool.execute(query, [user_id, workspace_id])
        return result[0]
    } 
    
    
    /* static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id){
        const member_workspace = await MemberWorkspace.findOne({user: user_id, workspace: workspace_id})
        return member_workspace
    }
 */

    /* static async create (user_id, workspace_id, role = 'member'){
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
    } */
    static async create(
        user_id, 
        workspace_id, 
        role = 'user'
    ) {
        const query = `INSERT INTO ${MEMBER_WORKSPACE_TABLE.NAME}(${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_USER},${MEMBER_WORKSPACE_TABLE.COLUMNS.FK_WORKSPACE},${MEMBER_WORKSPACE_TABLE.COLUMNS.ROLE}) VALUES (?,?,?)`
        const [ result ] = await pool.execute(query, [user_id, workspace_id, role])
        return result.insertId
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