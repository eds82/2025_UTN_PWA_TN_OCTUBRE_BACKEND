import express from "express"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import { validarId } from "../utils/validations.utils.js"
import { ServerError } from "../utils/customError.utils.js"
import WorkspaceController from "../controllers/workspace.controller.js"
import authMiddleware, { authByRoleMiddleware } from "../middleware/auth.middleware.js"

//Manejar todas las consultas referidas a workspace

const workspace_router = express.Router()

//Configuracion a nivel de ruta
workspace_router.use(authMiddleware)


workspace_router.get('/', /* authByRoleMiddleware(['admin', 'user']), */ WorkspaceController.getAll)

workspace_router.get('/:workspace_id', /* authByRoleMiddleware(['admin']), */ WorkspaceController.getById)
//Crear el workspaceController con los metodos post, .getById, getAll

//Este es el endpoint para crear workspaces
workspace_router.post('/',  WorkspaceController.post)  //Cuando llegue un post a esta direccion '/' quiero que ejecutes esta funcion


export default workspace_router