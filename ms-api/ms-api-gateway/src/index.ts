import app from "./app";
import { UserController } from "./controllers/user.controller";
import { db } from "./services/database.service";
import { RabbitMQService } from "./services/rabbitmq.service";

const rabbitMQ = new RabbitMQService();
const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = process.env.HOST || "localhost";

(async () => {
    try {
        console.log("Initializing services...");
        await db.connect();
        await rabbitMQ.connect(rabbitMQUrl);

        // Inicializa o UserController com a instância conectada
        UserController.initialize(rabbitMQ);

        // Passa a instância conectada para o controller (se necessário)
        app.listen(PORT, HOST, () =>
            console.log(`API Gateway running at http://localhost:8080`)
        );
    } catch (error) {
        console.error("Initialization failed:", error);
        process.exit(1);
    }
})();