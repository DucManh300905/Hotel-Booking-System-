import { useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import Modal from "../common/Modal";
import InputField from "../common/InputField";
import { fmtPrice } from "../../utils/calculateNights";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_BASE}/${image}`;
}

const AMENITY_OPTIONS = [
  "🛏️ Giường đôi cao cấp", "🛏️ Giường đơn", "❄️ Điều hòa nhiệt độ",
  "📶 WiFi miễn phí", "📺 TV màn hình phẳng", "🚿 Phòng tắm riêng",
  "🛁 Bồn tắm", "☕ Minibar & Cà phê", "🅿️ Bãi đỗ xe", "🍳 Bếp nhỏ",
  "🪟 View biển", "🪟 View núi", "🏊 Hồ bơi riêng", "💆 Dịch vụ Spa",
];

export default function AdminRooms({ showToast }) {
  const navigate = useNavigate();
  const [rooms,      setRooms]      = useState([]);
  const [modal,      setModal]      = useState(null);
  const [delModal,   setDelModal]   = useState(null);
  const [form,       setForm]       = useState({ name: "", price: "", description: "", area: "", capacity: "2" });
  const [amenities,  setAmenities]  = useState([]);
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [galleryFiles,   setGalleryFiles]   = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const fileInputRef    = useRef(null);
  const galleryInputRef = useRef(null);

  const load = useCallback(() => {
    axiosClient.get("/rooms").then(setRooms).catch(console.error);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ name: "", price: "", description: "", area: "", capacity: "2" });
    setAmenities([]); setImgFile(null); setImgPreview(null);
    setGalleryFiles([]); setGalleryPreviews([]);
    setModal({ mode: "add" });
  };

  const openEdit = (r) => {
    setForm({ name: r.name, price: String(r.price), description: r.description || "", area: r.area ? String(r.area) : "", capacity: r.capacity ? String(r.capacity) : "2" });
    setAmenities(r.amenities || []);
    setImgFile(null); setImgPreview(r.image ? getImageUrl(r.image) : null);
    setGalleryFiles([]); setGalleryPreviews((r.gallery || []).map(getImageUrl));
    setModal({ mode: "edit", room: r });
  };

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImgFile(file); setImgPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setGalleryFiles(files);
    setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const toggleAmenity = (a) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const save = async () => {
    if (!form.name || !form.price) { showToast("Điền đầy đủ tên và giá phòng", "error"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("price",       form.price);
      formData.append("description", form.description);
      formData.append("area",        form.area);
      formData.append("capacity",    form.capacity);
      formData.append("amenities",   JSON.stringify(amenities));
      if (imgFile) formData.append("image", imgFile);
      galleryFiles.forEach(f => formData.append("gallery", f));

      const cfg = { headers: { "Content-Type": "multipart/form-data" } };
      if (modal.mode === "edit") {
        await axiosClient.put(`/rooms/${modal.room._id}`, formData, cfg);
        showToast("Cập nhật thành công!", "success");
      } else {
        await axiosClient.post("/rooms", formData, cfg);
        showToast("Thêm phòng thành công!", "success");
      }
      setModal(null); load();
    } catch (e) { showToast(e.message, "error"); }
    setLoading(false);
  };

  const del = async () => {
    if (!delModal) return;
    setLoading(true);
    try {
      await axiosClient.delete(`/rooms/${delModal._id}`);
      showToast("Xóa phòng thành công!", "success");
      setDelModal(null); load();
    } catch (e) { showToast(e.message, "error"); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 13, color: "rgba(12,15,20,.45)" }}>{rooms.length} phòng trong hệ thống</p>
        <button onClick={openAdd} style={{
          padding: "10px 22px", background: "linear-gradient(135deg,#b8922a,#8a6a18)",
          border: "none", borderRadius: 10, color: "#fff",
          fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>+ Thêm phòng</button>
      </div>

      {rooms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "rgba(12,15,20,.35)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12, opacity: .4 }}>🏨</div>
          <p>Chưa có phòng nào.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.2rem" }}>
          {rooms.map((room, i) => (
            <div key={room._id} style={{
              background: "#fff", border: "1.5px solid rgba(12,15,20,.07)",
              borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,.05)",
              animation: `slideUp .3s ease ${i * 0.05}s both`,
            }}>
              <div
                onClick={() => navigate(`/rooms/${room._id}`)}
                style={{
                  height: 140, overflow: "hidden", cursor: "pointer",
                  background: "linear-gradient(135deg,#ede5d5,#d8cbb5)",
                  display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                }}
              >
                {room.image
                  ? <img src={getImageUrl(room.image)} alt={room.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: "2.4rem" }}>🏨</span>
                }
                {room.gallery?.length > 0 && (
                  <span style={{
                    position: "absolute", bottom: 8, right: 8,
                    background: "rgba(0,0,0,.5)", color: "#fff",
                    fontSize: 10, padding: "2px 7px", borderRadius: 5,
                  }}>🖼 {1 + room.gallery.length}</span>
                )}
              </div>
              <div style={{ padding: "1.1rem" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(12,15,20,.35)", marginBottom: 4 }}>
                  {room.area ? `${room.area}m²` : "Standard"}
                  {room.capacity ? ` · ${room.capacity} khách` : ""}
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#0c0f14", marginBottom: 4 }}>{room.name}</div>
                <div style={{ color: "#b8922a", fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
                  {fmtPrice(room.price)} <span style={{ fontSize: 11, color: "rgba(184,146,42,.5)", fontWeight: 400 }}>VND/đêm</span>
                </div>
                {room.amenities?.length > 0 && (
                  <div style={{ fontSize: 11, color: "rgba(12,15,20,.4)", marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {room.amenities.slice(0, 3).join(" · ")}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(room)} style={{
                    flex: 1, padding: "7px 0", border: "1.5px solid rgba(12,15,20,.08)", borderRadius: 8,
                    background: "transparent", fontFamily: "var(--font-sans)", fontSize: 12, cursor: "pointer", color: "#0c0f14", fontWeight: 500,
                  }}>✎ Sửa</button>
                  <button onClick={() => setDelModal(room)} style={{
                    flex: 1, padding: "7px 0", border: "1.5px solid rgba(192,57,43,.2)", borderRadius: 8,
                    background: "rgba(192,57,43,.06)", fontFamily: "var(--font-sans)", fontSize: 12, cursor: "pointer", color: "#c0392b", fontWeight: 500,
                  }}>✕ Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal thêm/sửa */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && setModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(12,15,20,.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16, backdropFilter: "blur(5px)", overflowY: "auto",
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: 32, width: "100%", maxWidth: 560,
            boxShadow: "0 24px 64px rgba(0,0,0,.16)", margin: "auto",
            animation: "scaleIn .2s ease", maxHeight: "90vh", overflowY: "auto",
          }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 400, color: "#0c0f14", marginBottom: 20 }}>
              {modal.mode === "edit" ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
            </h3>

            {/* Thông tin cơ bản */}
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(12,15,20,.4)", marginBottom: 12, fontWeight: 600 }}>
              Thông tin cơ bản
            </div>
            <InputField label="Tên phòng" placeholder="VD: Phòng Deluxe 201" value={form.name} onChange={setF("name")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <InputField label="Giá / đêm (VND)" type="number" placeholder="500000" value={form.price} onChange={setF("price")} min="0" />
              <InputField label="Diện tích (m²)" type="number" placeholder="35" value={form.area} onChange={setF("area")} min="0" />
              <InputField label="Sức chứa" type="number" placeholder="2" value={form.capacity} onChange={setF("capacity")} min="1" max="10" />
            </div>
            <InputField label="Mô tả" placeholder="View biển, nội thất hiện đại..." value={form.description} onChange={setF("description")} />

            {/* Tiện nghi */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(12,15,20,.4)", marginBottom: 12, fontWeight: 600 }}>
                Tiện nghi
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AMENITY_OPTIONS.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)} style={{
                    padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                    border: `1.5px solid ${amenities.includes(a) ? "#b8922a" : "rgba(12,15,20,.1)"}`,
                    background: amenities.includes(a) ? "rgba(184,146,42,.1)" : "transparent",
                    color: amenities.includes(a) ? "#b8922a" : "rgba(12,15,20,.5)",
                    fontFamily: "var(--font-sans)", transition: "all .2s",
                  }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Ảnh chính */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(12,15,20,.4)", marginBottom: 12, fontWeight: 600 }}>
                Ảnh chính
              </div>
              {imgPreview && (
                <div style={{ width: "100%", height: 140, borderRadius: 10, overflow: "hidden", marginBottom: 10, position: "relative" }}>
                  <img src={imgPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => { setImgFile(null); setImgPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{
                    position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.55)",
                    border: "none", borderRadius: "50%", width: 28, height: 28,
                    color: "#fff", cursor: "pointer", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>✕</button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: "none" }} id="main-img" />
              <label htmlFor="main-img" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 0", border: "1.5px dashed rgba(184,146,42,.4)", borderRadius: 10,
                cursor: "pointer", color: "#b8922a", fontSize: 13, fontWeight: 500,
                background: "rgba(184,146,42,.04)",
              }}>
                📷 {imgPreview ? "Đổi ảnh chính" : "Chọn ảnh chính"}
              </label>
            </div>

            {/* Ảnh gallery */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(12,15,20,.4)", marginBottom: 12, fontWeight: 600 }}>
                Ảnh gallery (tối đa 5 ảnh)
              </div>
              {galleryPreviews.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  {galleryPreviews.map((p, i) => (
                    <div key={i} style={{ width: 80, height: 60, borderRadius: 8, overflow: "hidden" }}>
                      <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              )}
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryChange} style={{ display: "none" }} id="gallery-img" />
              <label htmlFor="gallery-img" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 0", border: "1.5px dashed rgba(12,15,20,.15)", borderRadius: 10,
                cursor: "pointer", color: "rgba(12,15,20,.4)", fontSize: 13, fontWeight: 500,
                background: "rgba(12,15,20,.02)",
              }}>
                🖼 {galleryPreviews.length > 0 ? `Đổi ${galleryPreviews.length} ảnh gallery` : "Chọn ảnh gallery"}
              </label>
              <p style={{ fontSize: 11, color: "rgba(12,15,20,.35)", marginTop: 5 }}>JPG, PNG, WEBP · Tối đa 5MB/ảnh</p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{
                flex: 1, padding: "11px 0", background: "rgba(12,15,20,.04)",
                border: "1.5px solid rgba(12,15,20,.08)", borderRadius: 10,
                fontFamily: "var(--font-sans)", fontSize: 14, cursor: "pointer", color: "#0c0f14",
              }}>Hủy</button>
              <button onClick={save} disabled={loading} style={{
                flex: 2, padding: "11px 0", border: "none", borderRadius: 10,
                background: loading ? "rgba(12,15,20,.2)" : "linear-gradient(135deg,#b8922a,#8a6a18)",
                color: "#fff", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .5 : 1,
              }}>
                {loading ? "Đang lưu..." : modal.mode === "edit" ? "Lưu thay đổi" : "Thêm phòng"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xóa */}
      {delModal && (
        <Modal
          title="Xóa phòng"
          sub={`Xóa "${delModal.name}"? Hành động này không thể hoàn tác.`}
          onClose={() => setDelModal(null)}
          confirmText="Xóa phòng" danger
          onConfirm={del} loading={loading}
        >{null}</Modal>
      )}
    </div>
  );
}
