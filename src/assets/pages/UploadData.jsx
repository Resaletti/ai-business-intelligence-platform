import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { UploadCloud } from "lucide-react";

export default function UploadData() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);

      setMessage(`Dataset uploaded successfully! Redirecting to Dashboard...`);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-3">Upload Dataset</h1>

        <p className="text-slate-400 mb-10">
          Upload a CSV file to generate business intelligence insights.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10">
          <div className="border-2 border-dashed border-cyan-500 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Drag & Drop CSV File
            </h2>

            <p className="text-slate-400 mb-6">
              or choose a file from your computer
            </p>

            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <label
              htmlFor="csv-upload"
              className="
            flex
            flex-col
            items-center
            justify-center
            cursor-pointer
            border-2
            border-dashed
            border-cyan-400
            rounded-2xl
            p-12
            hover:bg-slate-800
            transition
            "
            >
              <div className="text-6xl mb-4">
                <UploadCloud size={72} className="text-cyan-400 mb-4" />
              </div>

              <h2 className="text-3xl font-bold">Click to Select CSV</h2>

              <p className="text-slate-400 mt-2">
                or drag & drop your file here
              </p>

              {file && (
                <p className="mt-4 text-cyan-400 font-semibold">{file.name}</p>
              )}
            </label>

            <button
              onClick={handleUpload}
              className="bg-cyan-500 hover:bg-cyan-600 transition px-8 py-3 rounded-xl font-semibold"
            >
              Upload CSV
            </button>
          </div>

          {file && (
            <div className="mt-6 text-green-400">
              Selected file: {file.name}
            </div>
          )}

          {message && (
            <div className="mt-6 bg-slate-800 rounded-lg p-4 text-green-400">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
