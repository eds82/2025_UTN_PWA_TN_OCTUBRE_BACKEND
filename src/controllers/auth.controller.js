import { json } from "express"
import AuthService from "../services/auth.service.js"
import { ServerError } from "../utils/customError.utils.js"
import ENVIRONMENT from "../config/environment.config.js"

class AuthController {
    static async register(request, response) {
        try {
            /* 
            Recibiremos un username, email, password
            Validar los 3 campos
            */
            const {
                username, 
                email, 
                password
            } = request.body
            console.log(request.body)

            if(!username){     //Si no hay username...
                throw new ServerError(    //Lanzar un error
                    400, 
                    'Debes enviar un nombre de usuario valido'
                )
            }
            //si no hay email o esta escrito de forma incorrecta...
            else if(!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
                throw new ServerError(     //Lanzamos un error
                    400, 
                    'Debes enviar un email valido'
                )
            }
            //Si no hay password o password.lenght menor a 8.....
            else if(!password || password.length < 8){
                throw new ServerError(     //Lanzamos un error de servidor
                    400, 
                    'Debes enviar una contraseña valida'
                )
            }
            await AuthService.register(username, password, email)  //Lo llamamos del archivo auth.service.js

            response.json({
                ok: true,
                status: 200,
                message: 'Usuario registrado correctamente'
            })
        }
        catch (error) {
            console.log(error)
            if (error.status) {
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

    static async login(request, response) {
        try {
            const {email, password} = request.body

            /*
            -Validar que el email y la password sean validas
            */ 

            const { authorization_token } = await AuthService.login(email, password)
            return response.json({
                ok: true,
                message: 'Logueado con exito',
                status: 200,
                data: {
                    authorization_token: authorization_token
                }
            })
        } 
        catch (error) {
            console.log(error)
            if (error.status) {
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

    static async verifyEmail(request, response) {
        try {
            const {verification_token} = request.params
            await AuthService.verifyEmail(verification_token)   // Llamamos a AuthService.verifyEmail y le pasamos el verification_token aguardamos a que esto se resuelva

            return response.redirect(ENVIRONMENT.URL_FRONTEND + '/login')
        } catch (error) {
            console.log(error)
            if (error.status) {
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
}



export default AuthController   