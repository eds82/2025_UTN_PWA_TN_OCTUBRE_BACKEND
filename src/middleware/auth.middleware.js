import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'

const authMiddleware = (request, response, next) => {


    try {
        const authorization_header = request.headers.authorization
        
        if (!authorization_header) {     //Si no hay
            throw new ServerError(400, 'No hay header de autorization')    //Lanzamos este mensaje.
        }
        const auth_token = authorization_header.split(' ').pop()
        if (!auth_token) {     //Si no hay token de autorizacion
            throw new ServerError(400, 'No hay token de autorization')   //Entonces lanzamos este mensaje.
        }

        const user_data = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)    //verifiamos el token y si lo esta se guarda y nos trae el user_data

            request.user = user_data
        next()
    }
    catch (error) {
        console.log(error)
        if(error instanceof jwt.JsonWebTokenError){   //Este tipo de errores es cuando falla el metodo verify
            return response.status(401).json(
                {
                    ok: false,
                    status: 401,
                    message: 'Token invalido'
                }
            )
        }
        else if (error instanceof jwt.TokenExpiredError) {   //Este tipo de errores es cuando falla el metodo verify
            return response.status(401).json(
                {
                    ok: false,
                    status: 401,
                    message: 'Token expirado'
                }
            )
        }
        else if (error.status) {
            return response.status(error.status).json(
                {
                    ok: false,
                    status: error.status,
                    message: error.message
                }
            )
        }
        else {
            return response.status(500).json(
                {
                    ok: false,
                    status: 500,
                    message: 'Error interno del servidor'
                }
            )
        }
    }

}

export default authMiddleware