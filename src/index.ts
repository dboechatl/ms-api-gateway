const express = require("express");
import { RabbitMQ } from "./rabbitmq";

const app = express();
const rabbitMQ = new RabbitMQ();

app.use(express.json());

app.post("/user", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    try {
        await rabbitMQ.publish("user-queue", JSON.stringify({ name, email }));
        res.status(200).json({ message: "User creation request sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message to RabbitMQ" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const message = JSON.stringify({ action: "get-all-users" });
        await rabbitMQ.publish("user-queue", message);
        res.status(200).json({ message: "User retrieval request sent for all users" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message to RabbitMQ" });
    }
});

(async () => {
    const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
    try {
        console.log(`Attempting to connect to RabbitMQ at ${rabbitMQUrl}...`);
        await rabbitMQ.connect(rabbitMQUrl);
        console.log(`Connected to RabbitMQ at ${rabbitMQUrl}`);
        app.listen(3000, () => console.log("API Gateway running on port 3000"));
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        process.exit(1);
    }
})();