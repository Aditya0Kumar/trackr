import Report from "../models/Report.js";

// POST /api/reports -> Add new report
export const createReport = async (req, res) => {
  try {
    const { siteName, workDone, materialsUsed, workersCount } = req.body;
    const images = req.files ? req.files.map((f) => f.path) : [];

    const report = await Report.create({
      siteName,
      workDone,
      materialsUsed,
      workersCount,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reports -> Fetch all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user._id }).sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
