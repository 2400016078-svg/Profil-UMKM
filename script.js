// Daftar menu Gepuk Burger
const produk = [
    { nama: 'Gepuk Original', harga: 18000, keterangan: 'Daging sapi gepuk, keju cheddar, acar timun, dan saus rahasia.', foto: 'gambar/original.jpg' },
    { nama: 'Gepuk Keju Leleh', harga: 23000, keterangan: 'Dua lapis keju yang meleleh di atas daging panas.', foto: 'gambar/keju-leleh.jpg' },
    { nama: 'Gepuk Sambal Bawang', harga: 22000, keterangan: 'Pedas gurih dengan sambal bawang racikan sendiri.', foto: 'gambar/burgersambalbawang.png.jpeg' },
    { nama: 'Gepuk Dobel', harga: 32000, keterangan: 'Dua daging gepuk, dua keju, untuk yang lapar berat.', foto: 'gambar/burgerdobel.png.jpeg' },
];

// Jam buka (format 24 jam), harus sama dengan teks jam buka di index.html
const jamBuka = 10;
const jamTutup = 22;

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
            <img class="foto" src="${p.foto}" alt="${p.nama}">
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
