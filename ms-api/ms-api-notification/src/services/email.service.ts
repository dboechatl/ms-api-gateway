import nodemailer from "nodemailer";

export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "api",
                pass: "03cf3a572ef8059faa356ecbc5201b06"
            }
        });
    }

    async sendEmail(name: string, email: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: '"Notification Service" <hello@demomailtrap.co>',
                to: email,
                subject: "Notification",
                text: `Hello ${name}, this is your notification!`,
                html: `<p>Hello <strong>${name}</strong>, this is your notification!</p>`
            });

            console.log(`Notification sent to ${name} (${email})`);
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error);
        }
    }
}