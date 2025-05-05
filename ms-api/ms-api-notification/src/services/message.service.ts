import { EmailService } from "./email.service";
import { MessageDTO } from "../dtos/message.dto";

export class MessageService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    async processMessage(message: string): Promise<void> {
        try {
            const parsedMessage = JSON.parse(message);
            const messageDTO = new MessageDTO(parsedMessage.name, parsedMessage.email);

            console.log("Received message:", messageDTO);

            await this.emailService.sendEmail(messageDTO.name, messageDTO.email);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to process message:", error.message);
            } else {
                console.error("Failed to process message:", error);
            }
        }
    }
}