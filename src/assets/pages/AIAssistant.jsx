import { useState, useEffect } from "react";
import { api } from "../services/api";
import DashboardLayout from "../layout/DashboardLayout";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [columns, setColumns] = useState([]);

 useEffect(() => {

  async function loadColumns() {

    try {

      const response =
        await api.get("/columns");

      setColumns(
        response.data.columns
      );

    } catch (error) {

      console.error(error);

    }

  }

  loadColumns();

}, []);

  async function handleAsk() {
    try {
      const response = await api.post("/ask", {
        question,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: question,
        },
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6">
          AI Assistant
        </h1>

      <div className="mb-6">

  <h2 className="text-xl font-bold mb-3">
    Available Columns
  </h2>

  <div className="flex flex-wrap gap-2">

    {columns.map((column) => (

      <span
        key={column}
        className="bg-slate-800 px-3 py-1 rounded-lg text-sm"
      >
        {column}
      </span>

    ))}

  </div>

</div>

        <p className="text-slate-400 mb-6">
          Ask questions about your uploaded dataset.
        </p>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How many rows?"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 min-h-[120px]"
        />

        <div className="mt-4 flex flex-wrap gap-2">

  <button
    onClick={() => setQuestion("How many rows?")}
    className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
  >
    How many rows?
  </button>

  <button
    onClick={() => setQuestion("How many columns?")}
    className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
  >
    How many columns?
  </button>

  <button
    onClick={() => setQuestion("summary")}
    className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
  >
    Summary
  </button>

  <button
    onClick={() => setQuestion("highest average")}
    className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
  >
    Highest Average
  </button>

  <button
    onClick={() => setQuestion("most common")}
    className="bg-slate-800 px-3 py-2 rounded-lg text-sm"
  >
    Most Common Value
  </button>

</div>

        <button
          onClick={handleAsk}
          className="mt-4 bg-cyan-500 px-6 py-3 rounded-lg font-semibold"
        >
          Analyze
        </button>

<div className="mt-8">

  <h2 className="text-2xl font-bold mb-4">
    Conversation
  </h2>

  <div className="space-y-4">

    {messages.length === 0 && (

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

        <p className="text-slate-400">
          No questions yet. Ask something about your dataset.
        </p>

      </div>

    )}

    {messages.map((msg, index) => (

      <div
        key={index}
        className={`rounded-xl p-4 border ${
          msg.role === "user"
            ? "bg-cyan-950 border-cyan-800"
            : "bg-slate-900 border-slate-700"
        }`}
      >

        <strong className="block mb-2">
          {msg.role === "user" ? "You" : "AI Assistant"}
        </strong>

        <p>{msg.content}</p>

      </div>

    ))}

  </div>

</div>
      </div>
    </DashboardLayout>
  );
}