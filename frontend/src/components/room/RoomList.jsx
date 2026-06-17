import { useState, useEffect } from "react";
import roomApi from "../../api/roomApi";
import RoomCard from "./RoomCard";
import Loading from "../common/Loading";

export default function RoomList({ onBook }) {
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    roomApi.getAll()
      .then(setRooms)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (error) return (
    <div style={{
      textAlign: "center", padding: "4rem",
      color: "#c0392b", fontFamily: "var(--font-sans)", fontSize: 14,
    }}>
      ✕ {error}
    </div>
  );

  if (rooms.length === 0) return (
    <div style={{
      textAlign: "center", padding: "5rem 2rem",
      color: "rgba(12,15,20,.35)", fontFamily: "var(--font-sans)",
    }}>
      <div style={{ fontSize: "3rem", marginBottom: 12, opacity: .4 }}>🏨</div>
      <p>Chưa có phòng nào.</p>
    </div>
  );

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "1.4rem",
    }}>
      {rooms.map((room, i) => (
        <RoomCard key={room._id} room={room} index={i} onBook={onBook} />
      ))}
    </div>
  );
}
