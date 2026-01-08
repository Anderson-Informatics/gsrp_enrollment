import mongoose from "mongoose";

export interface User {
    _id: mongoose.Types.ObjectId;
    name?: string;
    email?: string;
    createdAt?: Date;
    password?: string;
    confirmationToken?: string;
    isConfirmed: boolean;
}

/**
 * Convenience types for working with Mongoose
 */
export type UserDocument = mongoose.Document & User;
export type UserModel = mongoose.Model<UserDocument>;