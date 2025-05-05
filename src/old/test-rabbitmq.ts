import amqplib from "amqplib";

(async () => {
    try {
        console.log("Attempting to connect to RabbitMQ...");
        const connection = await amqplib.connect("amqp://guest:guest@localhost:5672");
        console.log("Connection successful!");
        await connection.close();
    } catch (error) {
        console.error("Connection failed:", error);
    }
})();