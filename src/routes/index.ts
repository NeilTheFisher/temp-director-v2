import { Router } from "express"
import event from "./event"
import health from "./health"
import odience from "./odience"
import user from "./user"

const routes = Router()

routes.use("/", health)
routes.use("/", odience)
routes.use("/api", user)
routes.use("/api", event)

export { routes }
