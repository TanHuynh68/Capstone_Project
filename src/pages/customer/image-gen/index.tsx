import React, { useState } from "react";

const ImageEditor = () => {
  const [imageFile, setImageFile] = useState(null);
  const [maskFile, setMaskFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = `Replace the red bow on the Labubu plush toy with a blue bow. Keep the bow style and size the same, only change the color to sky blue. Make sure the texture remains soft fabric, and the overall lighting and background stay unchanged.`;

  const handleEditImage = async () => {
    if (!imageFile || !maskFile) {
      alert("Vui lòng chọn cả ảnh và mask đúng chuẩn 1024x1024 PNG.");
      return;
    }

    setLoading(true);
    setImageUrl("");
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("mask", maskFile);
      formData.append("prompt", prompt);
      formData.append("n", "1");
      formData.append("size", "1024x1024");

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          // Không thêm Content-Type → để browser tự thêm boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        console.error(data);
        alert(`Lỗi API: ${data.error.message || "Chi tiết lỗi không rõ"}`);
      } else {
        setImageUrl(data.data[0].url);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi gửi yêu cầu chỉnh sửa ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🎨 AI Image Editor (DALL·E 2 Image Edit)</h2>
      <div style={{ marginBottom: 10 }}>
        <label>Ảnh Labubu 1024x1024 PNG:</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Mask PNG 1024x1024 (vùng nơ trong suốt):</label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setMaskFile(e.target.files[0])}
        />
      </div>
      <button onClick={handleEditImage} disabled={loading}>
        {loading ? "Đang xử lý..." : "Chỉnh sửa ảnh"}
      </button>
      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Kết quả:</h3>
          <img src={imageUrl} alt="Edited AI" style={{ width: 400 }} />
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
