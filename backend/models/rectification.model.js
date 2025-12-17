import mongoose from "mongoose";

const rectificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        month: {
            type: Number, // 0-11
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Ensure only one record per user per month/year
rectificationSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Rectification = mongoose.model("Rectification", rectificationSchema);

export default Rectification;