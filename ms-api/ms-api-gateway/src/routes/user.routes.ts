import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.post("/user", (req, res) => UserController.createUser(req, res));
router.get("/users", (req, res) => UserController.getUsers(req, res));

export default router;