import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        required: true,
    },
});

export const User = mongoose.model("User", UserSchema);