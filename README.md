# 🛡️ Aegis Draft — Dota 2 Counter-Picker & Smart Item Guide

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-aegisdraft.is--a.dev-emerald?style=for-the-badge&logo=googlechrome&logoColor=white)](https://aegisdraft.is-a.dev)
![Dota 2](https://img.shields.io/badge/Dota_2-Patch_7.37d-red?style=for-the-badge&logo=steam&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI_v4-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![OpenDota API](https://img.shields.io/badge/Data-OpenDota_API-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

### 🌐 Akses Website: [https://aegisdraft.is-a.dev](https://aegisdraft.is-a.dev)

<p align="center">
  <strong>Aplikasi web modern untuk membantu pemain Dota 2 dalam menentukan counter-pick hero secara real-time dan memberikan panduan pemilihan item (Core vs Situasional) berdasarkan statistik langsung dari OpenDota API.</strong>
</p>

[🌐 Live Website](https://aegisdraft.is-a.dev) • [Fitur Utama](#-fitur-utama) • [Tech Stack](#-tech-stack) • [Cara Menjalankan](#-cara-menjalankan-secara-lokal) • [Struktur Proyek](#-struktur-proyek) • [Atribusi API](#-sumber-data--atribusi)

</div>

---


## 📖 Tentang Proyek

**Aegis Draft** dirancang khusus untuk mempermudah pemain Dota 2 (dari mode santai hingga _ranked draft_) dalam mengambil keputusan strategis:

1. **Siapa hero terbaik untuk meng-counter lineup musuh?**
2. **Item apa yang wajib dibeli (Core Item) dan item apa yang harus dibeli untuk menghadapi ancaman spesifik lawan (Situational Counter Item)?**

Semua data statistik hero, riwayat keunggulan _head-to-head matchup_, hingga frekuensi pembelian item diambil langsung secara dinamis melalui **OpenDota API** dan aset resmi **Valve Steam CDN**.

---

## ✨ Fitur Utama

### 1. 🛡️ Real-Time Counter-Picker & Draft Strategist

- **5 Slot Komposisi Hero Lawan (Dire Lineup)**: Masukkan hingga 5 hero yang dipilih tim musuh, atau gunakan tombol **"🎲 Acak Lawan"** untuk pengujian instan.
- **Kalkulasi Keunggulan Multivariat (Advantage %)**: Menghitung persentase kemenangan dari puluhan ribu data pertandingan OpenDota (`/heroes/{id}/matchups`) terhadap semua hero musuh yang dipilih.
- **Filter Berdasarkan Role**: Pilah rekomendasi counter hero berdasarkan posisi yang ingin Anda mainkan (_Carry_, _Mid_, _Offlane_, atau _Support_).
- **Peringatan Hero yang Harus Dihindari (_Countered By_)**: Mengetahui hero apa saja yang sebaiknya tidak Anda pilih karena rentan dihancurkan oleh lineup lawan.
- **Deteksi Ancaman Taktis Lawan**: Menganalisis potensi bahaya komposisi musuh seperti _Heavy Magic Damage_, _Evasion_, _Strong Passives_, _High Healing/Lifesteal_, hingga _Ilusi_.

### 2. 🎒 Panduan Item Pintar (Core vs Situasional)

- **🌟 Core Items (Item Wajib)**: Rekomendasi item jadi (_finished items_) dengan frekuensi pembelian tertinggi dan lonjakan kekuatan (_power spike_) terbesar untuk hero Anda.
- **🎯 Situational Items (Counter Khusus Lawan)**: Analisis dinamis terhadap hero musuh di draft:
  - 🏹 **Menghadapi Evasion (PA / Windranger)** $\rightarrow$ Rekomendasi **Monkey King Bar (MKB)** & **Bloodthorn** (_True Strike_).
  - 🗡️ **Menghadapi Pasif Tebal (Bristleback / Spectre / Huskar)** $\rightarrow$ Rekomendasi **Silver Edge** (_Break_).
  - ⚡ **Menghadapi Burst Magic / Stun (Lion / Lina / Zeus / Invoker)** $\rightarrow$ Rekomendasi **Black King Bar (BKB)**, **Pipe of Insight**, atau **Glimmer Cape**.
  - 🩸 **Menghadapi Regen / Lifesteal Masif (Morphling / Slark / Necro)** $\rightarrow$ Rekomendasi **Spirit Vessel**, **Eye of Skadi**, atau **Shiva's Guard**.
  - 🔒 **Menghadapi Targeted Spell Bahaya (Doom / Duel / Roar)** $\rightarrow$ Rekomendasi **Linken's Sphere** atau **Lotus Orb**.
  - 👥 **Menghadapi Ilusi / Pasukan Kloning (PL / Naga / Chaos Knight)** $\rightarrow$ Rekomendasi **Mjollnir**, **Battle Fury**, **Radiance**, atau **Shiva's Guard**.
  - 💨 **Menghadapi Hero Licin & Mobilitas Tinggi (Storm / Slark / Weaver)** $\rightarrow$ Rekomendasi **Hex (Scythe of Vyse)**, **Orchid**, atau **Abyssal Blade**.
  - 🛡️ **Menghadapi Physical Carry Berat (Ursa / Sven / PA)** $\rightarrow$ Rekomendasi **Ghost Scepter**, **Heaven's Halberd**, atau **Blade Mail**.
- **⏱️ Pembagian Fase Waktu Terstruktur**:
  - **Starting Items (0:00 - 3:00)**: Laning sustain di bawah 700 Gold.
  - **Early Game (3:00 - 15:00)**: Sepatu dan item transisi statistik.
  - **Core Mid Game (15:00 - 30:00)**: Item utama pelengkap hero.
  - **Late Game & Luxury (30:00+ min)**: Item tier atas 6-slot _endgame_.
- **🔍 Modal Detail Item**: Klik pada item apa saja untuk membaca biaya _gold_, bonus atribut, deskripsi efek kemampuan aktif/pasif, hingga _lore_ resmi Dota 2.

### 3. 👑 Meta Tier List Explorer

- Mengelompokkan seluruh 127 hero Dota 2 ke dalam tingkatan tier: **S+ (Overlord)**, **S (Top Tier)**, **A (Solid)**, **B (Situational)**, dan **C (Off-Meta)**.
- Filter berdasarkan rank bracket: _Herald–Archon_, _Legend–Ancient_, _Divine–Immortal_, atau _Pro Circuit Matches_.
- Dilengkapi pencarian cepat dan filter atribut (_Strength_, _Agility_, _Intelligence_, _Universal_).

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **UI Components**: [DaisyUI v4](https://daisyui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [OpenDota API](https://docs.opendota.com/)
- **Assets**: Valve Corporation CDN (Steam Static Assets)

---

## 🚀 Cara Menjalankan Secara Lokal

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan) di komputer Anda.

### 1. Clone Repositori

```bash
git clone https://github.com/username/dota2-aegis-draft.git
cd dota2-aegis-draft
```

### 2. Instal Dependensi

```bash
npm install
```

### 3. Jalankan Server Pengembangan (Dev Server)

```bash
npm run dev
```

Buka browser Anda dan akses:

```
http://localhost:5173/
```

Atau kunjungi versi publik langsung di: **[https://aegisdraft.is-a.dev](https://aegisdraft.is-a.dev)**

### 4. Build untuk Produksi

```bash
npm run build
```

Hasil build siap produksi akan tersimpan di dalam folder `dist/`.

---

## 📂 Struktur Proyek

```
dota2/
├── public/                 # Aset statis & favicon
├── src/
│   ├── assets/             # Gambar & ikon lokal
│   ├── components/
│   │   ├── Navbar.jsx                  # Header, navigasi responsif, & rank bracket selector
│   │   ├── EnemyDraftPicker.jsx        # 5 slot hero lawan (swipeable di HP)
│   │   ├── CounterRecommendations.jsx  # Algoritma & kartu rekomendasi counter pick
│   │   ├── ItemGuide.jsx               # Panduan Core vs Situational item
│   │   ├── MetaTierList.jsx            # Klasifikasi Tier List S+ hingga C
│   │   └── HeroSelectModal.jsx         # Modal pencarian hero dengan filter atribut
│   ├── data/
│   │   └── situationalRules.js         # Basis data aturan ancaman & counter item Dota 2
│   ├── services/
│   │   └── opendota.js                 # Layanan OpenDota API, cache, & rumus matchup
│   ├── App.jsx             # Komponen utama & state management
│   ├── index.css           # Konfigurasi Tailwind, font, & utilitas responsif
│   └── main.jsx            # Titik masuk React Vite
├── index.html              # HTML shell dengan Google Fonts (Cinzel, Outfit, Inter)
├── tailwind.config.js      # Konfigurasi kustom tema warna Dota 2
├── postcss.config.js       # Konfigurasi PostCSS
└── package.json            # Daftar dependensi & script proyek
```

---

## 🌐 Sumber Data & Atribusi

- Data statistik hero, riwayat _matchup_, dan popularitas pembelian item disediakan oleh **[OpenDota API](https://docs.opendota.com/)** (Open Source Dota 2 Data Platform).
- Gambar avatar hero, ikon hero, dan ikon item bersumber dari CDN resmi **Valve Corporation**.

---

## ⚠️ Disclaimer

_Dota 2 is a registered trademark of Valve Corporation._  
Aplikasi ini merupakan proyek karya penggemar (_fan-made / hobby project_) independen dan tidak berafiliasi atau didukung secara resmi oleh Valve Corporation.

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Silakan gunakan, pelajari, dan kembangkan sesuka Anda!
