// src/config/robotConfig.js

export const AMR1_LABELS = [
  "Empty Pick Box", 
  "Shopping", 
  "Pick By UR30"
];

export const AMR2_LABELS = [
  "Pick Pallet Ready", 
  "Drop Pallet Ready", 
  "Pick Pallet Supply", 
  "Drop Pallet Supply"
];

export const getCurrentDockInfo = (status, labels) => {
  // --- PERUBAHAN UTAMA ADA DI SINI ---
  // Gunakan `lastIndexOf` untuk menemukan indeks '1' dari paling kanan.
  const lastActiveIndex = status.lastIndexOf(1);
  
  const activeLabel = lastActiveIndex !== -1 ? labels[lastActiveIndex] : undefined;

  return {
    // dockNumber sekarang berdasarkan indeks terakhir yang aktif.
    dockNumber: lastActiveIndex !== -1 ? lastActiveIndex + 1 : null,

    // Pesan tetap sama, menggunakan label dari dok yang benar-benar aktif.
    message: activeLabel
      ? `On going to : ${activeLabel}`
      : "Waiting Activities...",
      
    // isActive juga berdasarkan apakah ada dok yang aktif atau tidak.
    isActive: lastActiveIndex !== -1,

    // Kita tambahkan informasi baru untuk view, yaitu indeks dok yang aktif.
    // Ini akan membantu kita di 'TrackingCard' untuk menentukan mana yang harus diceklis.
    lastActiveIndex: lastActiveIndex 
  };
};
// Anda bisa menambahkan konfigurasi lain di sini di masa depan,
// misalnya warna untuk setiap robot, dll.