import mysql from "mysql2/promise"
import ENVIRONMENT from "./environment.config.js"

const pool = mysql.createPool({
    host: ENVIRONMENT.MYSQL_HOST,
    user: ENVIRONMENT.MYSQL_USERNAME,
    password: ENVIRONMENT.MYSQL_PASSWORD,
    database: ENVIRONMENT.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
})

/* pool.getConnection()
.then((connection) => {
    console.log("Conexión a la DB exitosa.")
})
.catch((err) => {
    console.log("Error d conexión: ", err)
}) */

export default pool