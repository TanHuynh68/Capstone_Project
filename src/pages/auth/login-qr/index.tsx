import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://192.168.2.6:3001";

const QRLoginPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<string>("⏳ Đang chờ quét...");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showModal, setShowModal] = useState<boolean>(false);

  const createSession = async () => {
    const newSession = uuidv4();
    console.log("🧾 QR Session ID được tạo:", newSession);
    setSessionId(newSession);
    setUserId("");
    setStatus("⏳ Đang chờ quét...");
    setTimeLeft(60);
    setShowModal(false);
    await axios.post(`${API_BASE}/api/create-session`, {
      sessionId: newSession,
    });
  };

  useEffect(() => {
    createSession();
  }, []);

  // Countdown 60s
  useEffect(() => {
    if (!sessionId) return;
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setStatus("⛔ Mã QR đã hết hạn. Hãy tạo lại.");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [sessionId]);

  // Polling login state
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/check-session/${sessionId}`
        );
        if (res.data.loggedIn) {
          setUserId(res.data.userId);
          setStatus("✅ Đã đăng nhập!");
          clearInterval(interval);
          setShowModal(true);
          setTimeout(() => {
            window.location.href = `http://localhost:5173/?user=${res.data.userId}`;
          }, 3000);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra session:", err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Đăng nhập bằng mã QR</h2>

        {sessionId && (
          <>
            <div style={styles.qrContainer}>
              <QRCodeSVG value={sessionId} size={220} />
            </div>
            <p style={styles.status}>{status}</p>
            {timeLeft > 0 && (
              <p style={styles.timer}>⏳ Còn lại: {timeLeft}s</p>
            )}
            {userId && <p style={styles.userId}>👤 Tài khoản: {userId}</p>}
          </>
        )}

        <button style={styles.button} onClick={createSession}>
          🔄 Tạo lại mã QR
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: 12 }}>🎉 Đăng nhập thành công!</h3>
            <p>Đang chuyển hướng đến trang chính...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    padding: "24px 16px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
    position: "relative",
  },
  title: {
    marginBottom: 20,
    fontSize: "22px",
    color: "#333",
  },
  qrContainer: {
    padding: 16,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    display: "inline-block",
    marginBottom: 16,
    border: "1px solid #ddd",
  },
  status: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  timer: {
    fontSize: "14px",
    color: "#888",
    marginBottom: 8,
  },
  userId: {
    fontSize: "14px",
    color: "#666",
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "24px 32px",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
};

export default QRLoginPage;
