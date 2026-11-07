// TODO: ganti dengan produk UMKM kalian. Gambar boleh dikosongkan dulu.
const produk = [
    { nama: 'Produk pertama', harga: 15000, keterangan: 'Keterangan singkat produk.' },
    { nama: 'Produk kedua', harga: 20000, keterangan: 'Keterangan singkat produk.' },
    { nama: 'Produk ketiga', harga: 25000, keterangan: 'Keterangan singkat produk.' },
];

// TODO: sesuaikan jam buka (format 24 jam)
const jamBuka = 8;
const jamTutup = 17;

function rupiah(angka) {
    return 'Rp' + angka.toLocaleString('id-ID');
}

function tampilkanProduk() {
    const wadah = document.getElementById('daftar-produk');
    wadah.innerHTML = '';
    for (const p of produk) {
        const kartu = document.createElement('article');
        kartu.className = 'kartu';
        kartu.innerHTML = `
            <div class="foto">Foto</div>
            <h3>${p.nama}</h3>
            <p>${p.keterangan}</p>
            <p class="harga">${rupiah(p.harga)}</p>
        `;
        wadah.appendChild(kartu);
    }
}

function tampilkanStatusBuka() {
    const jam = new Date().getHours();
    const buka = jam >= jamBuka && jam < jamTutup;
    const el = document.getElementById('status-buka');
    el.textContent = buka ? 'Buka sekarang' : 'Sedang tutup';
    el.className = buka ? 'buka' : 'tutup';
}

tampilkanProduk();
tampilkanStatusBuka();
