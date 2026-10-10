import { Router } from "express"
import {
    createNewOrder,
    getOrderById,
    listAllUserOrders,
} from "../controllers/order.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const orderRouter = Router()

orderRouter.use(authenticate)

orderRouter.post("/", createNewOrder)
orderRouter.get("/", listAllUserOrders)
orderRouter.get("/:id", getOrderById)

export default orderRouter
