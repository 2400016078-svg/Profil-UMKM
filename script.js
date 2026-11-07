// ===== DATA =====

// Daftar menu Gepuk Burger
const produk = [
    { nama: 'Gepuk Original', harga: 18000, keterangan: 'Daging sapi gepuk, keju cheddar, acar timun, dan saus rahasia.', foto: 'gambar/original.jpg' },
    { nama: 'Gepuk Keju Leleh', harga: 23000, keterangan: 'Dua lapis keju yang meleleh di atas daging panas.', foto: 'gambar/keju-leleh.jpg' },
    { nama: 'Gepuk Sambal Bawang', harga: 22000, keterangan: 'Pedas gurih dengan sambal bawang racikan sendiri.', foto: 'gambar/sambal-bawang.jpg' },
    { nama: 'Gepuk Dobel', harga: 29000, keterangan: 'Dua daging gepuk, dua keju, untuk yang lapar berat.', foto: 'gambar/dobel.jpg' },
    { nama: 'Gepuk Sosis', harga: 30000, keterangan: 'tiga daging sosis gepuk, dua keju, untuk yang suka sosis.', foto: 'gambar/burgersosis.jpeg' },
    { nama: 'Gepuk Saos mushroom', harga: 35000, keterangan: 'dua daging gepuk, saos mushroom, untuk yang suka manis gurih.', foto: 'gambar/burgermushroom.jpeg' },
];

// Jam buka (format 24 jam), harus sama dengan teks jam buka di index.html
const jamBuka = 10;
const jamTutup = 22;

// Nomor WhatsApp (format 62..., tanpa tanda +), harus sama dengan link di index.html
const nomorWA = '6282284231303';

// Jumlah pesanan setiap menu. Urutannya sama dengan array produk.
// Contoh: [2, 0, 1, 0, 0, 0] artinya Original 2, Sambal Bawang 1.
const jumlah = [];


// ===== FUNGSI BANTUAN =====

function rupiah(angka) {
    return 'Rp' + angka.toLocaleString('id-ID');
}


// ===== KARTU PRODUK =====

function tampilkanProduk() {
    const wadah = document.getElementById('daftar-produk');
    wadah.innerHTML = '';

    for (let i = 0; i < produk.length; i++) {
        const p = produk[i];
        jumlah.push(0);   // setiap menu mulai dari 0

        const kartu = document.createElement('article');
        kartu.className = 'kartu';
        kartu.id = 'kartu-' + i;
        kartu.innerHTML = `
            <img class="foto" src="${p.foto}" alt="${p.nama}">
            <h3>${p.nama}</h3>
            <p>${p.keterangan}</p>
            <div class="kaki-kartu">
                <p class="harga">${rupiah(p.harga)}</p>
                <div class="atur-jumlah">
                    <button class="btn-jumlah kurang" aria-label="Kurangi ${p.nama}">&minus;</button>
                    <span id="jumlah-${i}">0</span>
                    <button class="btn-jumlah tambah" aria-label="Tambah ${p.nama}">+</button>
                </div>
            </div>
        `;

        // Pasang event klik pada tombol - dan + milik kartu ini
        kartu.querySelector('.kurang').addEventListener('click', function () {
            ubahJumlah(i, -1);
        });
        kartu.querySelector('.tambah').addEventListener('click', function () {
            ubahJumlah(i, 1);
        });

        wadah.appendChild(kartu);
    }
}

function ubahJumlah(index, perubahan) {
    jumlah[index] = jumlah[index] + perubahan;

    // Jumlah tidak boleh kurang dari 0
    if (jumlah[index] < 0) {
        jumlah[index] = 0;
    }

    document.getElementById('jumlah-' + index).textContent = jumlah[index];

    // Beri tanda pada kartu yang sudah dipilih
    const kartu = document.getElementById('kartu-' + index);
    if (jumlah[index] > 0) {
        kartu.classList.add('dipilih');
    } else {
        kartu.classList.remove('dipilih');
    }

    perbaruiKeranjang();
}


// ===== KERANJANG =====

function perbaruiKeranjang() {
    const daftar = document.getElementById('daftar-pesanan');
    daftar.innerHTML = '';

    let total = 0;
    let totalItem = 0;

    for (let i = 0; i < produk.length; i++) {
        if (jumlah[i] > 0) {
            const subtotal = produk[i].harga * jumlah[i];
            total = total + subtotal;
            totalItem = totalItem + jumlah[i];

            const baris = document.createElement('li');
            baris.innerHTML = `
                <span>${produk[i].nama} &times; ${jumlah[i]}</span>
                <span>${rupiah(subtotal)}</span>
            `;
            daftar.appendChild(baris);
        }
    }

    if (totalItem === 0) {
        daftar.innerHTML = '<li class="kosong">Belum ada pesanan. Tekan tombol + pada menu di atas.</li>';
    }

    document.getElementById('total-harga').textContent = rupiah(total);

    // Tombol kirim dan kosongkan mati kalau belum ada pesanan
    document.getElementById('kirim-pesanan').disabled = totalItem === 0;
    document.getElementById('kosongkan').disabled = totalItem === 0;

    // Bar ringkasan di bawah layar
    document.getElementById('ringkas-pesanan').hidden = totalItem === 0;
    document.getElementById('ringkas-teks').textContent = totalItem + ' item';
    document.getElementById('ringkas-total').textContent = rupiah(total);
}

function kirimPesanan() {
    const nama = document.getElementById('nama-pemesan').value.trim();
    const catatan = document.getElementById('catatan').value.trim();
    const pesanError = document.getElementById('pesan-error');

    // Validasi: nama tidak boleh kosong
    if (nama === '') {
        pesanError.textContent = 'Nama pemesan tidak boleh kosong.';
        document.getElementById('nama-pemesan').focus();
        return;
    }
    pesanError.textContent = '';

    // Susun isi pesan WhatsApp
    let teks = 'Halo Gepuk Burger, saya mau pesan:\n';
    let total = 0;

    for (let i = 0; i < produk.length; i++) {
        if (jumlah[i] > 0) {
            const subtotal = produk[i].harga * jumlah[i];
            total = total + subtotal;
            teks = teks + '- ' + produk[i].nama + ' x' + jumlah[i] + ' = ' + rupiah(subtotal) + '\n';
        }
    }

    teks = teks + '\nTotal: ' + rupiah(total);
    teks = teks + '\nNama: ' + nama;
    if (catatan !== '') {
        teks = teks + '\nCatatan: ' + catatan;
    }

    // Buka WhatsApp di tab baru dengan pesan yang sudah terisi
    const alamat = 'https://wa.me/' + nomorWA + '?text=' + encodeURIComponent(teks);
    window.open(alamat, '_blank');
}

function kosongkanKeranjang() {
    for (let i = 0; i < produk.length; i++) {
        jumlah[i] = 0;
        document.getElementById('jumlah-' + i).textContent = 0;
        document.getElementById('kartu-' + i).classList.remove('dipilih');
    }
    perbaruiKeranjang();
}


// ===== STATUS BUKA =====

function tampilkanStatusBuka() {
    const jam = new Date().getHours();
    const buka = jam >= jamBuka && jam < jamTutup;
    const el = document.getElementById('status-buka');
    el.textContent = buka ? 'Buka sekarang' : 'Sedang tutup';
    el.className = buka ? 'buka' : 'tutup';
}


// ===== SLIDER =====

function aturSlider() {
    const wadah = document.getElementById('daftar-produk');
    const tombolKiri = document.getElementById('geser-kiri');
    const tombolKanan = document.getElementById('geser-kanan');

    // Jarak satu kali geser = lebar satu kartu + jarak antarkartu (20px)
    function jarakGeser() {
        const kartu = wadah.querySelector('.kartu');
        return kartu.offsetWidth + 20;
    }

    tombolKiri.addEventListener('click', function () {
        wadah.scrollBy({ left: -jarakGeser() });
    });

    tombolKanan.addEventListener('click', function () {
        wadah.scrollBy({ left: jarakGeser() });
    });

    // Matikan tombol kalau sudah di ujung kiri atau ujung kanan
    function perbaruiTombol() {
        tombolKiri.disabled = wadah.scrollLeft <= 0;
        tombolKanan.disabled = wadah.scrollLeft + wadah.clientWidth >= wadah.scrollWidth - 1;
    }

    wadah.addEventListener('scroll', perbaruiTombol);
    window.addEventListener('resize', perbaruiTombol);
    perbaruiTombol();
}


// ===== JALANKAN SAAT HALAMAN DIBUKA =====

tampilkanProduk();
tampilkanStatusBuka();
aturSlider();
perbaruiKeranjang();

document.getElementById('kirim-pesanan').addEventListener('click', kirimPesanan);
document.getElementById('kosongkan').addEventListener('click', kosongkanKeranjang);
