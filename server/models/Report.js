import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  siteName: { type: String, required: true },
  workDone: { type: String, required: true },
  materialsUsed: { type: String },
  workersCount: { type: Number },
  images: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
