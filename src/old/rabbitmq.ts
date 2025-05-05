import amqplib, { Connection, Channel } from "amqplib";

export class RabbitMQ {
    private connection: Connection | null = null;
    private channel: Channel | null = null;

    async connect(url: string): Promise<void> {
        try {
            console.log(`Connecting to RabbitMQ at ${url}...`);
            this.connection = await amqplib.connect(url);
            console.log("Connection established.");
            this.channel = await this.connection.createChannel();
            console.log("Channel created.");
        } catch (error) {
            console.error("Error during RabbitMQ connection:", error);
            throw error;
        }
    }

    async publish(queue: string, message: string): Promise<void> {
        if (!this.channel) throw new Error("RabbitMQ channel is not initialized");
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message));
    }
}