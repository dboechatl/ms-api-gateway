import { RabbitMQ } from "./rabbitmq";
import nodemailer from "nodemailer";

(async () => {
    const rabbitMQUrl = "amqp://guest:guest@localhost:5672";
    const queue = "email-queue";

    try {
        const rabbitMQ = new RabbitMQ();
        await rabbitMQ.connect(rabbitMQUrl);

        console.log(`Waiting for messages in ${queue}...`);

        await rabbitMQ.consume(queue, async (message) => {
            const parsedMessage = JSON.parse(message);
            console.log("Received message:", parsedMessage);

            const { name, email } = parsedMessage;

            if (!name || !email) {
                console.error("Invalid message format: 'name' or 'email' is missing", parsedMessage);
                return;
            }

            // Send email
            const transporter = nodemailer.createTransport({
                host: "live.smtp.mailtrap.io",
                port: 587,
                auth: {
                    user: "api",
                    pass: "03cf3a572ef8059faa356ecbc5201b06"
                }
            });

            try {
                // Send email using Mailtrap
                await transporter.sendMail({
                    from: '"Notification Service" <hello@demomailtrap.co>', // Sender address
                    to: email, // Receiver's email
                    subject: "Notification", // Subject line
                    text: `Hello ${name}, this is your notification!`, // Plain text body
                    html: `<p>Hello <strong>${name}</strong>, this is your notification!</p>` // HTML body
                });

                console.log(`Notification sent to ${name} (${email})`);
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
            }
        });
    } catch (error) {
        console.error("Error in RabbitMQ consumer:", error);
    }
})();