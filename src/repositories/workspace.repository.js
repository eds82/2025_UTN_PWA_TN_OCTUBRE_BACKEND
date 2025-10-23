import pool from "../config/nysql.config.js"
import Workspaces from "../models/workspace.model.js"

//Creando un diccionario para workspace
export const WORKSPACE_TABLE = {
    NAME: 'Workspaces',
    COLUMNS: {
        ID: '_id',
        NAME: 'name',
        URL_IMAGE: 'url_image',
        ACTIVE: 'active',
        CREATED_AT: 'created_at',
        MODIFIED_AT: 'modified_at'
    }
}

class WorkspaceRepository {
    //getAll
    //getById
    //create
    //updateById
    //deletedById
    static async createWorkspace(name, url_image) {

        const query = `INSERT INTO ${WORKSPACE_TABLE.NAME} (${WORKSPACE_TABLE.COLUMNS.NAME},${WORKSPACE_TABLE.COLUMNS.URL_IMAGE}) VALUES (?,?)`
        const  [ result ] = await pool.execute(query, [name, url_image])

        return result.insertId
    }


    /* static async createWorkspace(name, url_image){
        //Logica de interaccion con la DB para crear el usuario
        await Workspaces.insertOne({
            name: name,
            url_image: url_image,
        })
        return true
    } */

        

    static async getAll() {
        
        const query=`SELECT * FROM ${WORKSPACE_TABLE.NAME}`
        const [result] = await pool.execute(query)
        return result
    }

    /* static async getAll() {
        //.find es un metodo para hacer filtro en una coleccion
        const workspaces = await Workspaces.find()
        return workspaces
    } */


    static async getById(workspace_id) {
        const query = `
                SELECT * FROM ${WORKSPACE_TABLE.NAME} WHERE ${WORKSPACE_TABLE.COLUMNS.ID}= ?
            `

        const [result] = await pool.execute(query, [workspace_id])

        const workspace_found = result[0]
        if (!workspace_found) {
            return null
        }
        return workspace_found
    }

    /* static async getById(workspace_id) {
        const workspace_found = await Workspaces.findById(workspace_id)
        return workspace_found
    } */



    static async deleteById(workspace_id) {
        const query = `DELETE FROM ${WORKSPACE_TABLE.NAME} WHERE ${WORKSPACE_TABLE.COLUMNS.ID} = ?`;
        const [result] = await pool.execute(query, [workspace_id]);
        return result.affectedRows > 0;
    }
    
    /* static async deleteById(workspace_id) {
        await Workspaces.findByIdAndDelete(workspace_id)       //Etse metodo indica: encontrar por id y eliminar
        return true
    } */

        
        
    static async updateById(workspace_id, new_values) {
       
        const update_fields = Object.keys(new_values) 
        const fields_query = update_fields
            .map(
                field => `${field} = ?`
            ) 
            .join(' , ') 

        const values = Object.values(new_values) 
        const query = `UPDATE ${WORKSPACE_TABLE.NAME} SET ${fields_query} WHERE ${WORKSPACE_TABLE.COLUMNS.ID} = ? `

        await pool.execute(query, [...values, workspace_id])
        const workspace_updated = await this.getById(workspace_id)
        return workspace_updated
    }

    /* static async updateById(workspace_id, new_values) {
        const workspace_updated = await Workspaces.findByIdAndUpdate(     // Este metodo significa: encontrar por id y actualizar
            workspace_id,
            new_values,
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            }
        )

        return workspace_updated
    } */
}

export default WorkspaceRepository