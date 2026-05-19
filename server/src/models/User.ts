import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware: Securely hash password on creation/modification
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Instance Method: Safely verify a password attempt
UserSchema.methods.comparePassword = async function (
    password: string,
): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
};

export const User = model<IUser>("User", UserSchema);
