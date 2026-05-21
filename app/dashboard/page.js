"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Ganti dengan kredensial Supabase kamu sendiri
const SUPABASE_URL = "https://xyz.supabase.co";
const SUPABASE_ANON_KEY = "ey..." ;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function DashboardLink() {
  const [kode, setKode] = useState("");
  const [linkTujuan, setLinkTujuan] = useState("");
  const [hasilLink, setHasilLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasilLink("");

    // Bersihkan format kalau kamu input pakai .mp4
    const kodeBersih = kode.replace(/\.mp4$/g, "").trim();

    // Masukkan data ke Supabase
    const { error } = await supabase
      .from("link_jembatan")
      .insert([{ kode_unik: kodeBersih, link_tujuan: linkTujuan }]);

    setLoading(false);

    if (error) {
      alert("Gagal generate! Kode unik mungkin sudah dipakai.");
      console.error(error);
    } else {
      // Ambil domain web jembatan kamu saat ini secara otomatis
      const baseUrl = window.location.origin;
      setHasilLink(`${baseUrl}/${kodeBersih}.map4`); 
      // (.map4 / .mp4 palsu di ujung buat ngecoh bot Facebook)
    }
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "#1e1e1e", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#0099ff" }}>🔗 Jembatan Link Generator</h2>
        
        <form onSubmit={handleGenerate}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Kode Unik / ID Link</label>
            <input 
              type="text" 
              placeholder="Contoh: Ygbz07 atau shopee-diskon" 
              value={kode} 
              onChange={(e) => setKode(e.target.value)}
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #333", backgroundColor: "#252525", color: "#fff" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Link Tujuan (Web Film / Affiliate)</label>
            <input 
              type="url" 
              placeholder="https://cdnviduy.site/watch/... atau link shopee" 
              value={linkTujuan} 
              onChange={(e) => setLinkTujuan(e.target.value)}
              required 
              style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #333", backgroundColor: "#252525", color: "#fff" }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "none", backgroundColor: "#0099ff", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "Sedang Memproses..." : "🚀 Generate Jembatan Link"}
          </button>
        </form>

        {hasilLink && (
          <div style={{ marginTop: "30px", padding: "15px", background: "#252525", borderRadius: "5px", border: "1px solid #0099ff" }}>
            <p style={{ margin: "0 0 10px 0", color: "#0099ff", fontWeight: "bold" }}>Hasil Link Siap Tebar di FB:</p>
            <input 
              type="text" 
              readOnly 
              value={hasilLink} 
              style={{ width: "100%", padding: "10px", backgroundColor: "#1e1e1e", color: "#fff", border: "1px solid #444", borderRadius: "3px", textAlign: "center" }}
              onClick={(e) => { e.target.select(); alert("Link disalin!"); document.execCommand("copy"); }}
            />
            <small style={{ color: "#aaa", display: "block", marginTop: "5px", textAlign: "center" }}>💡 Klik kolom di atas untuk menyalin otomatis</small>
          </div>
        )}
      </div>
    </div>
  );
}
