import { useState } from "react";
import API from "../api/axios";

const AddReport = () => {
  const [report, setReport] = useState({
    siteName: "",
    workDone: "",
    materialsUsed: "",
    workersCount: "",
  });
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(report).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((img) => formData.append("images", img));

    try {
      await API.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Report added successfully");
      setReport({ siteName: "", workDone: "", materialsUsed: "", workersCount: "" });
      setImages([]);
    } catch (err) {
      alert("Error adding report");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Daily Report</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" placeholder="Site Name" className="border p-2 w-full rounded"
          value={report.siteName} onChange={(e) => setReport({ ...report, siteName: e.target.value })} />
        <textarea placeholder="Work Done" className="border p-2 w-full rounded"
          value={report.workDone} onChange={(e) => setReport({ ...report, workDone: e.target.value })} />
        <input type="text" placeholder="Materials Used" className="border p-2 w-full rounded"
          value={report.materialsUsed} onChange={(e) => setReport({ ...report, materialsUsed: e.target.value })} />
        <input type="number" placeholder="Workers Count" className="border p-2 w-full rounded"
          value={report.workersCount} onChange={(e) => setReport({ ...report, workersCount: e.target.value })} />
        <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
};

export default AddReport;