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
    document.getElementById('kirim-telegram').disabled = totalItem === 0;
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

    pesanError.style.color = '';

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
// ===== KIRIM PESANAN VIA TELEGRAM =====

// Username Telegram toko (tanpa tanda @)
const usernameTelegram = 'gepukburger';

function kirimPesananTelegram() {
    const nama = document.getElementById('nama-pemesan').value.trim();
    const catatan = document.getElementById('catatan').value.trim();
    const pesanError = document.getElementById('pesan-error');

    pesanError.style.color = '';

    // Validasi nama
    if (nama === '') {
        pesanError.textContent = 'Nama pemesan tidak boleh kosong.';
        document.getElementById('nama-pemesan').focus();
        return;
    }
    pesanError.textContent = '';

    // Susun isi pesan Telegram
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

    // Link Telegram ke akun toko tidak bisa mengisi pesan otomatis seperti WhatsApp.
    // Jadi pesan disalin dulu, pembeli tinggal menempelnya di chat.
    navigator.clipboard.writeText(teks).then(function () {
        pesanError.style.color = '#15803d';
        pesanError.textContent = 'Pesanan sudah disalin. Tempel (Ctrl + V) di chat Telegram yang terbuka.';
    }).catch(function () {
        pesanError.textContent = 'Pesanan gagal disalin otomatis. Ketik pesananmu di chat Telegram.';
    });

    window.open('https://t.me/' + usernameTelegram, '_blank');
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
document.getElementById('kirim-telegram').addEventListener('click', kirimPesananTelegram);
document.getElementById('kosongkan').addEventListener('click', kosongkanKeranjang);


// ===== ULASAN DAN RATING =====

// Rating yang sedang dipilih di form (0 = belum memilih)
let ratingDipilih = 0;

// Semua ulasan. Setiap ulasan berupa object: { nama, rating, komentar, tanggal }
let ulasan = [];

// Ambil ulasan yang tersimpan di browser (localStorage)
function muatUlasan() {
    try {
        const data = localStorage.getItem('ulasan-gepuk');
        ulasan = data ? JSON.parse(data) : [];
    } catch (e) {
        ulasan = [];
    }
}

// Simpan ulasan ke browser supaya tidak hilang saat halaman di-refresh
function simpanUlasan() {
    try {
        localStorage.setItem('ulasan-gepuk', JSON.stringify(ulasan));
    } catch (e) {
        // Kalau penyimpanan diblokir browser, ulasan tetap tampil sampai halaman ditutup
    }
}

// Ubah angka rating menjadi teks bintang, contoh: 4 -> ★★★★☆
function teksBintang(nilai) {
    return '★'.repeat(nilai) + '☆'.repeat(5 - nilai);
}

// Pasang event klik pada 5 tombol bintang di form
function aturPilihBintang() {
    const semuaTombol = document.querySelectorAll('#pilih-bintang button');
    semuaTombol.forEach(function (tombol) {
        tombol.addEventListener('click', function () {
            ratingDipilih = Number(tombol.dataset.nilai);
            warnaiBintang();
        });
    });
}

// Bintang nomor 1 sampai ratingDipilih diberi warna kuning
function warnaiBintang() {
    const semuaTombol = document.querySelectorAll('#pilih-bintang button');
    semuaTombol.forEach(function (tombol) {
        if (Number(tombol.dataset.nilai) <= ratingDipilih) {
            tombol.classList.add('aktif');
        } else {
            tombol.classList.remove('aktif');
        }
    });
}

function tampilkanUlasan() {
    const daftar = document.getElementById('daftar-ulasan');
    daftar.innerHTML = '';

    // Hitung rata-rata rating
    let totalRating = 0;
    for (let i = 0; i < ulasan.length; i++) {
        totalRating = totalRating + ulasan[i].rating;
    }
    const rataRata = ulasan.length > 0 ? totalRating / ulasan.length : 0;

    document.getElementById('rata-rata').textContent = rataRata.toFixed(1).replace('.', ',');
    document.getElementById('bintang-rata').textContent = teksBintang(Math.round(rataRata));
    document.getElementById('jumlah-ulasan').textContent =
        ulasan.length > 0 ? 'Dari ' + ulasan.length + ' ulasan' : 'Belum ada ulasan';

    if (ulasan.length === 0) {
        daftar.innerHTML = '<li class="kosong">Belum ada ulasan. Jadilah yang pertama!</li>';
        return;
    }

    // Tampilkan dari yang terbaru (indeks terakhir) ke yang terlama
    for (let i = ulasan.length - 1; i >= 0; i--) {
        const u = ulasan[i];
        const item = document.createElement('li');

        const kepala = document.createElement('div');
        kepala.className = 'kepala-ulasan';

        const nama = document.createElement('strong');
        nama.textContent = u.nama;   // textContent: teks ditampilkan apa adanya, kode HTML tidak dijalankan

        const bintang = document.createElement('span');
        bintang.className = 'bintang-tampil';
        bintang.textContent = teksBintang(u.rating);

        kepala.appendChild(nama);
        kepala.appendChild(bintang);

        const komentar = document.createElement('p');
        komentar.textContent = u.komentar;

        const kaki = document.createElement('div');
        kaki.className = 'kaki-ulasan';

        const tanggal = document.createElement('small');
        tanggal.textContent = u.tanggal;

        const tombolHapus = document.createElement('button');
        tombolHapus.className = 'hapus-ulasan';
        tombolHapus.textContent = 'Hapus';
        tombolHapus.addEventListener('click', function () {
            hapusUlasan(i);
        });

        kaki.appendChild(tanggal);
        kaki.appendChild(tombolHapus);

        item.appendChild(kepala);
        item.appendChild(komentar);
        item.appendChild(kaki);
        daftar.appendChild(item);
    }
}

function kirimUlasan(event) {
    event.preventDefault();   // cegah halaman ter-refresh saat form dikirim

    const nama = document.getElementById('nama-ulasan').value.trim();
    const komentar = document.getElementById('isi-ulasan').value.trim();
    const error = document.getElementById('error-ulasan');

    // Validasi: nama, rating, dan komentar wajib diisi
    if (nama === '') {
        error.textContent = 'Nama tidak boleh kosong.';
        return;
    }
    if (ratingDipilih === 0) {
        error.textContent = 'Pilih rating 1 sampai 5 bintang.';
        return;
    }
    if (komentar === '') {
        error.textContent = 'Komentar tidak boleh kosong.';
        return;
    }
    error.textContent = '';

    ulasan.push({
        nama: nama,
        rating: ratingDipilih,
        komentar: komentar,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    simpanUlasan();

    // Kosongkan form lagi
    document.getElementById('form-ulasan').reset();
    ratingDipilih = 0;
    warnaiBintang();

    tampilkanUlasan();
}

function hapusUlasan(index) {
    ulasan.splice(index, 1);   // buang 1 ulasan di posisi index
    simpanUlasan();
    tampilkanUlasan();
}

muatUlasan();
aturPilihBintang();
tampilkanUlasan();
document.getElementById('form-ulasan').addEventListener('submit', kirimUlasan);
