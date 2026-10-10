import { Router } from "express"
import { addItem, clear, getItem, removeItem, updateItem } from "../controllers/cart.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const cartRouter = Router()

cartRouter.use(authenticate)

cartRouter.get("/", getItem)
cartRouter.post("/items", addItem)
cartRouter.patch("/items/:productId", updateItem)
cartRouter.delete("/items/:productId", removeItem)
cartRouter.delete("/", clear)

export default cartRouter
