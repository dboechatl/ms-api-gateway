import { Request, Response } from "express";
import { UserDTO } from "../dtos/user.dto";
import { RabbitMQService } from "../services/rabbitmq.service";
import { db } from "../services/database.service";

export class UserController {
    private static rabbitMQ: RabbitMQService;

    static initialize(rabbitMQInstance: RabbitMQService) {
        this.rabbitMQ = rabbitMQInstance;
    }
    static async createUser(req: Request, res: Response) {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const userDTO = new UserDTO(name, email);

        try {
            // Publica a mensagem no RabbitMQ
            await this.rabbitMQ.publish("user-queue", JSON.stringify({
                action: "USER_CREATED",
                data: userDTO
            }));
            res.status(200).json({ message: "User creation request sent" });
        } catch (error) {
            res.status(500).json({ error: "Failed to send message to RabbitMQ" });
        }
    }

    static async getUsers(req: Request, res: Response) {
        try {
            const [users] = await db.query("SELECT * FROM users", []);
            res.status(200).json(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            res.status(500).json({ error: "Failed to retrieve users from the database" });
        }
    }
}