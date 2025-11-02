/* import pool from "../config/mysql.config.js"; */
/* import mysql2 from "mysql2" */
import pool from "../config/nysql.config.js";
import Users from "../models/User.model.js";

/*
Repository tiene la responsabilidad de interactuar con la DB
Capa de abstraccion
No queremos que nuestro servidor  este UNIDO en logica a nuestra DB, porque la DB puede cambiar
*/

class UserRepository {

    //Version MYSQL
    static async createUser(name, email, password) {
        //Logica de interaccion con la DB para crear el usuario
        //Porque usamos '?' en la query?
        //que es una inyeccion SQL?
        //Es cuando me insertan dentro de una consulta codigo SQL
        const query = `
            INSERT INTO Users(email, name, password) VALUES(?, ?, ?)
        `

        const [result, field_packet] = await pool.execute(query, [email, name, password])

        const user_created = await UserRepository.getById(result.insertId)
        return user_created
        //Debo retornar el usuario
    }




    static async getAll() {
        //.find es un metodo para hacer filtro en una coleccion
        const users = await Users.find()
        return users
    }



    static async getById(user_id) {
        const query = `
                SELECT * FROM Users WHERE _ID= ?
            `

        const [result] = await pool.execute(query, [user_id])

        const user_found = result[0]
        if (!user_found) {
            return null
        }
        return user_found
    }





    static async deleteById(user_id) {
        const query = `DELETE FROM Users WHERE _id = ?`;
        const [result] = await pool.execute(query, [user_id]);
        return result.affectedRows > 0;
    }




    static async updateById(user_id, new_values) {
        //new_values = {name: 'pepe', email: 'pepe@gmail.com'}
        const update_fields = Object.keys(new_values) //Campos que queres actualizar ['name', 'email']
        const fields_query = update_fields
            .map(
                field => `${field} = ?`
            ) //['name = ?', 'email = ?']
            .join(' , ')// 'name = ? , email = ?' 

        const values = Object.values(new_values) // ['pepe', 'pepe@gmail.com']
        const query = `UPDATE Users SET ${fields_query} WHERE _id = ? `

        pool.execute(query, [...values, user_id])
    }


    //Con mysql:
    static async getByEmail(email) {
        const query = `
            SELECT * FROM Users WHERE email = ? AND active = 1
        `;
        const [result] = await pool.execute(query, [email]);
        const user_found = result[0];
        if (!user_found) {
            return null;
        }
        return user_found;
    }





    /* 
//Version MONGODB
     static async createUser(name, email, password){
        //Logica de interaccion con la DB para crear el usuario
        const result = await Users.insertOne({
            name: name,
            email: email,
            password: password,
        })
        return result
    } */


    /* static async getById (user_id){
        const user_found = await Users.findById(user_id)
        return user_found
    } */



    /* static async deleteById(user_id) {
        await Users.findByIdAndDelete(user_id)       //Etse metodo indica: encontrar por id y eliminar
        return true
    } */


    /* static async updateById(user_id, new_values) {
        const user_updated = await Users.findByIdAndUpdate(     // Este metodo significa: encontrar por id y actualizar
            user_id,
            new_values,
            {
                new: true //Cuando se haga la actualizacion nos traiga el objeto actualizado
            }
        )
        return user_updated
    } */


    /* static async getByEmail(email) {
        const user = await Users.findOne({ email: email })
        return user
    } */
}



export default UserRepository

//Un metodo o propiedad estatica puede ser llamada desde la clase, sin necesidad de instanciar dicha clase
//Por que usar estaticos? para no tener mas de una instancia del userRepository

