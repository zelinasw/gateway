"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://minnxsggeqyypnzppjdk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbm54c2dnZXF5eXBuenBwamRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDUxMDgsImV4cCI6MjA5MzU4MTEwOH0.DmjA-THOVKD9dovF-Eea1ofToc8mrCB9TUrOEzuUZvY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function RedirectPage({ params }) {
  const [pesan, setPesan] = useState("Menyiapkan Pemutar Video...");

  useEffect(() => {
    async function balikArah() {
      // Ambil slug url dan hilangkan ekstensi palsu (.mp4/.map4) jika ada
      let slugBersih = params.slug.replace(/\.mp4$|\.map4$/g, "");

      // Cari link aslinya di database Supabase
      const { data, error } = await supabase
        .from("link_jembatan")
        .select("link_tujuan")
        .eq("kode_unik", slugBersih)
        .single();

      if (data && data.link_tujuan) {
        // Kasih jeda 3 detik biar lolos bot scanner Facebook
        setTimeout(() => {
          window.location.href = data.link_tujuan;
        }, 3000);
      } else {
        // Jika kode tidak ketemu, balikkan ke domain utama kamu
        setPesan("Link Kedaluwarsa. Mengalihkan ke halaman utama...");
        setTimeout(() => {
          window.location.href = "https://cdnviduy.site";
        }, 2000);
      }
    }
    balikArah();
  }, [params.slug]);

  return (
    <div style={{ backgroundColor: "#111", color: "#fff", height: "100vh", display: "flex", justifyContent: "center", align-items: "center", fontFamily: "sans-serif", textAlign: "center" }}>
      <div>
        <div style={{ border: "4px solid rgba(255,255,255,0.1)", width: "50px", height: "50px", borderRadius: "50%", borderLeftColor: "#0099ff", animation: "spin 1s linear infinite", margin: "0 auto 20px" }}></div>
        <h2>{pesan}</h2>
        <p style={{ color: "#aaa" }}>Mohon tunggu sejenak, sistem sedang mengamankan jalur.</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
