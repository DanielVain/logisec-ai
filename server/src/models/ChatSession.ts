import { Schema, model, Document, Types } from "mongoose";

export interface IMessage {
    sender: "user" | "agent";
    content: string;
    timestamp: Date;
}

export interface IChatSession extends Document {
    userId: Types.ObjectId;
    title: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Security Assessment" },
    messages: [
        {
            sender: { type: String, enum: ["user", "agent"], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

ChatSessionSchema.pre<IChatSession>("save", function (next) {
    this.updatedAt = new Date();
    next();
});

export const ChatSession = model<IChatSession>(
    "ChatSession",
    ChatSessionSchema,
);
