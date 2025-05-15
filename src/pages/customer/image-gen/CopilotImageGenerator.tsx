import { useState } from "react";

const CopilotImageGenerator = () => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Vui lòng nhập mô tả (prompt)!");
      return;
    }
    const url = `https://copilot.microsoft.com/images/create?q=${encodeURIComponent(
      prompt
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "50px auto",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <h2>Tạo Ảnh AI Miễn Phí (DALL·E 3 qua Copilot)</h2>
      <input
        type="text"
        placeholder="Nhập prompt mô tả ảnh..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <br />
      <br />
      <button
        onClick={handleGenerate}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#0078d4",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Tạo ảnh với Copilot
      </button>
    </div>
  );
};

export default CopilotImageGenerator;
