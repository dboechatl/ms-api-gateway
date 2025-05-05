import express from "express";
import { UserDTO } from "./user.dto";
import { RabbitMQ } from "./rabbitmq";
import { db } from "./database";

const app = express();
const rabbitMQ = new RabbitMQ();

app.use(express.json());

app.post("/user", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const userDTO = new UserDTO(name, email);

    try {
        // Publish a message with user details to RabbitMQ
        await rabbitMQ.publish("user-queue", JSON.stringify({
            action: "USER_CREATED",
            data: userDTO
        }));
        res.status(200).json({ message: "User creation request sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message to RabbitMQ" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users", []);
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Failed to retrieve users from the database" });
    }
});

(async () => {
    const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
    const PORT = process.env.PORT || 8080;
    const HOST = process.env.HOST || "localhost";

    try {
        console.log(`Attempting to connect to RabbitMQ at ${rabbitMQUrl}...`);
        await db.connect(); // 👉 conectando ao banco antes de tudo
        console.log("Connected to MySQL");

        await rabbitMQ.connect(rabbitMQUrl);
        console.log(`Connected to RabbitMQ at ${rabbitMQUrl}`);

        app.listen(PORT, HOST, () =>
            console.log(`API Gateway running at http://${HOST}:${PORT}`)
        );
    } catch (error) {
        console.error("Initialization failed:", error);
        process.exit(1);
    }
})();
