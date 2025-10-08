import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"

class AuthService {

    static async register(username, password, email) {

        //Verificar que el usuario no este repido
        // - .getByEmail en UserRepository

        const user_found = await UserRepository.getByEmail(email)
        console.log(user_found)
        if (user_found) {
            throw new ServerError(400, 'Email ya es uso')
        }
        

        //Encriptar la contraseña
        const password_hashed = await bcrypt.hash(password, 12)

        //guardarlo en la DB
        const user_created = await UserRepository.createUser(username, email, password_hashed)
        const verificacion_token = jwt.sign(
            {
                email: email,
                user_id: user_created.id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )

        //Enviar un mail de verificacion
        await transporter.sendMail({
            from: 'grossrull24@gmail.com',
            to: 'grossrull24@gmail.com',
            subject: 'Verificacion de correo electronico',
            html: `
            <h1>Hola desde node.js</h1>
            <p>Este es un mail de verificacion</p>
            <a href='http://localhost:8080/api/auth/verify-email/${verificacion_token}'>Verificar email</a>
            `
        })
    }


    static async verifyEmail(verification_token) {
        try {
            //Se llama de jwt al metodo verify para chequear si este verification_token que nos estan pasando al controllador del archivoauth.controller.js es realmente de nuestra autoria, luego le pasamos el verification_token y tambien la clave secreta que esta en el ENVIRONMENT y una vez que este verificado nos va a devolver el payload
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

            console.log({ payload })

            await UserRepository.updateById(
                payload.user_id,
                {
                    verified_email: true
                }
            )

            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token invalido')
            }
            throw error
        }
    }


    static async login(email, password) {
        /*
        -Buscar por email y guardar en una variable
            No se encontro: Tiramos errror 404 'Email no registrado' / 'El email o la contraseña son invalidos'
        -Usamos bcrypt.compare para checkear que la password recibida sea igual al hash gvuardado en BD
            -En caso de que no sean iguales: 401 (Unauthorized) 'Contraseña invalida' / 'El email o la contraseña son invalidos'
        -Generar el authorization_token con los datos que consideremos importantes para una sesion: (name, email, rol, created_at) (NO PASAR DATOS SENSIBLES)
        -Retornar el token
        */

        const user = await UserRepository.getByEmail(email)
        if (!user) {
            throw new ServerError(404, 'Email no registrado')
        }
        /*Permite saber si cierto valor es igual a otro cierto valor encriptado*/
        const is_same_password = await bcrypt.compare(password, user.password)
        if (!is_same_password) {
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.create_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )
        return {
            authorization_token
        }

    }
}

export default AuthService