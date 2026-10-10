import { Router } from "express"
import {
    create,
    deactivate,
    getById,
    getBySlug,
    list,
    update,
} from "../controllers/product.controller.js"
import { authenticate, authorize } from "../middleware/auth.middleware.js"

const productRouter = Router()

productRouter.get("/", list)
productRouter.get("/slug/:slug", getBySlug)
productRouter.get("/:id", getById)

productRouter.post("/", authenticate, authorize("admin"), create)
productRouter.patch("/:id", authenticate, authorize("admin"), update)
productRouter.delete("/:id", authenticate, authorize("admin"), deactivate)

export default productRouter
