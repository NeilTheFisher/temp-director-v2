import { Router } from "express"
import health from "./health"
import odience from "./odience"
import user from "./user"
import event from "./event"

const routes = Router()

routes.use("/", health)
routes.use("/", odience)
routes.use("/api", user)
routes.use("/api", event)

export { routes }
