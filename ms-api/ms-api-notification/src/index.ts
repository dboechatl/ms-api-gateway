import { RabbitMQ } from "./services/rabbitmq.service";
import { MessageController } from "./controllers/message.controller";

(async () => {
    const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
    const queue = "email-queue";

    try {
        const rabbitMQ = new RabbitMQ();
        const messageController = new MessageController();

        await rabbitMQ.connect(rabbitMQUrl);

        console.log(`Waiting for messages in ${queue}...`);

        await rabbitMQ.consume(queue, async (message) => {
            await messageController.handleMessage(message);
        });
    } catch (error) {
        console.error("Error in RabbitMQ consumer:", error);
    }
})();