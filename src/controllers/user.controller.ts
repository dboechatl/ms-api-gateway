import { Request, Response } from "express";
import axios from "axios"; // Biblioteca para fazer chamadas HTTP
import { UserDTO } from "../dtos/user.dto";
import { RabbitMQService } from "../services/rabbitmq.service";

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
            // Faz uma chamada HTTP para o ms-api-user para criar o usuário no banco de dados
            const response = await axios.post("http://localhost:3000/api/users", userDTO);
            res.status(response.status).json(response.data);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Failed to create user" });
        }
    }

    static async getUsers(req: Request, res: Response) {
        try {
            // Faz uma chamada HTTP para o ms-api-user para buscar os usuários
            const response = await axios.get("http://localhost:3000/api/users");
            res.status(response.status).json(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Failed to fetch users" });
        }
    }
}