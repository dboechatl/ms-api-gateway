import { MessageService } from "../services/message.service";

export class MessageController {
    private messageService: MessageService;

    constructor() {
        this.messageService = new MessageService();
    }

    async handleMessage(message: string): Promise<void> {
        await this.messageService.processMessage(message);
    }
}