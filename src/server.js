import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongoDB.config.js";
import workspace_router from "./routes/workspace.route.js";



connectMongoDB()

import express from 'express'
import auth_router from "./routes/auth.router.js";
import UserRepository from "./repositories/user.repository.js";
import cors from 'cors'
import authMiddleware from "./middleware/auth.middleware.js";
import MemberWorkspaceRepository from "./repositories/memberWorkspace.repository.js";
import member_router from "./routes/member.route.js";


const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/status', (request, response) => {
    response.send({
        ok: true,
        message: 'Esto esta funcionando'
    })
})

app.get('/api/ping', (request, response) => {
    response.send({
        ok: true,
        message: 'pong'
    })
})


app.use('/api/workspace', workspace_router)
app.use('/api/auth', auth_router)
app.use('/api/members', member_router)


app.get('/ruta-protegida', authMiddleware, (request, response) => {
    console.log(request.user)    //Al llegar la consulta ya se tiene acceso a la request.user y tener acceso alos datos de usuario.
    response.send({ ok: true })
})

app.listen(
    8080,
    () => {
        console.log("Esto esta funcionado")
    }
)


/* UserRepository.createUser('Test', 'test3@gmail.com', 'pepe123')
    .then(
        (result) => {
            console.log(result)
        }
    )

UserRepository.getById(3)
 */
//UserRepository.getByEmail('grossrull24@gmail.com').then(result => console.log(result))
/* UserRepository.deleteById(11).then(console.log) */

MemberWorkspaceRepository.getAllWorkspacesByUserId(1).then(result => console.log(result))