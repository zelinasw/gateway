export async function onRequest(context) {
  const request = context.request;
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. DAFTAR CRAWLER & BOT PEMINDAI META / PLATFORM SOSIAL
  const isBot = /facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher|twitterbot|slackbot|bytespider|ia_archiver/i.test(userAgent);

  // 2. JIKA YANG AKSES ADALAH BOT CRAWLER:
  // Kirim halaman artikel bersih statis langsung dari level server edge (HTTP 200 OK)
  if (isBot) {
    const safeHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Informasi Terkini & Arsip Edukasi</title>
    <meta property="og:title" content="Portal Informasi Terkini">
    <meta property="og:description" content="Pembaruan materi informasi umum dan dokumentasi digital terupdate.">
</head>
<body style="font-family: Arial, sans-serif; padding: 25px; line-height: 1.6; color: #333;">
    <h2>Portal Informasi & Berita Terkini</h2>
    <p>Selamat datang di layanan repositori informasi daring. Konten materi dan dokumentasi digital disinkronisasikan secara bertahap melalui sistem komputasi awan terdistribusi.</p>
    <p>Status peladen: <strong>Optimal (200 OK)</strong></p>
</body>
</html>`;

    return new Response(safeHtml, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  // 3. JIKA PENGUNJUNG MANUSIA (BROWSER BIASA):
  // Lanjutkan request secara normal ke index.html (sistem gateway Supabase tetap jalan)
  return context.next();
}
