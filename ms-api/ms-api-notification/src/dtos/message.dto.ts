export class MessageDTO {
    name: string;
    email: string;

    constructor(name: string, email: string) {
        if (!name || !email) {
            throw new Error("Invalid message format: 'name' and 'email' are required");
        }
        this.name = name;
        this.email = email;
    }
}