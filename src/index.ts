import app from "./app";
import { UserController } from "./controllers/user.controller";
import { RabbitMQService } from "./services/rabbitmq.service";

const rabbitMQ = new RabbitMQService();
const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
const PORT = parseInt(process.env.PORT || "8080", 10);
const HOST = process.env.HOST || "localhost";

(async () => {
    try {
        console.log("Initializing services...");
        await rabbitMQ.connect(rabbitMQUrl); // Conecta ao RabbitMQ

        // Inicializa o UserController com a instância conectada
        UserController.initialize(rabbitMQ);

        // Inicia o servidor Express
        app.listen(PORT, HOST, () =>
            console.log(`API Gateway running at http://${HOST}:${PORT}`)
        );
    } catch (error) {
        console.error("Initialization failed:", error);
        process.exit(1);
    }
})();