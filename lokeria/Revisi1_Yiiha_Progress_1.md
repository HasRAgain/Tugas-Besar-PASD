



Lokeria: Aplikasi Filtering dan Rekomendasi Lowongan Kerja dengan
Menggunakan Model TF-IDF + Cosine Similarity dan SBERT

Yiihaa – DS-48-03
## Nama Anggota
## 1. Jihan Fauziah Rahmah – 103052430010
## 2. Nayma Najely – 103052430004
## 3. Najwa Anisa Putri – 103052400054
## 4. Hasna Rofifah Wardani – 103052400050
## 5. Rosandi Setiano – 103052400028

## Matakuliah Perancangan Aplikasi Sains Data
## Tahun Ajaran 2025/2026 Semester Genap


i

## Ceklis Progress Tugas Besar
Tugas  besar  pada  matakuliah  PASD  dibagi  menjadi  3  (tiga)  pelaporan  progress  beserta  1  (satu)
pelaporan akhir, adapun tabel dibawah ini adalah log untuk penilaian kelompok bersangkutan telah
mengerjakan sesuai tahapan yang diperbolehkan.

## Yiiha Ketua: Jihan Fauziah Rahmah – 103052430010
## Anggota:
## 1. Nayma Najely – 103052430004
## 2. Najwa Anisa Putri – 103052400054
## 3. Hasna Rofifah Wardani – 103052400050
## 4. Rosandi Setiano – 103052400028
Judul Proyek Lokeria: Aplikasi Filtering dan Rekomendasi Lowongan Kerja dengan
Menggunakan Model TF-IDF + Cosine Similarity dan SBERT
## Ceklis Progress Diperiksa Oleh Nilai Tanggal
## Progress 1
## Progress 2
## Progress 3
## Final




ii

## Daftar Isi
Ceklis Progress Tugas Besar ............................................................................................................ i
Bab 1 – Pendahuluan ...................................................................................................................... 1
1.1. Latar Belakang ................................................................................................................ 1
1.2. Tujuan dan Manfaat ........................................................................................................ 2
1.3. Ruang Lingkup dan Batasan ........................................................................................... 3
Bab 2 - Analisis Kebutuhan Sistem ................................................................................................ 5
2.1. Kebutuhan Fungsional .................................................................................................... 5
2.2. Kebutuhan Non-Fungsional ............................................................................................ 6
2.3. Use Case Diagram & Skenario....................................................................................... 6
Bab 3 - Analisis dan Perancangan Data .......................................................................................... 8
3.1. Sumber Data.................................................................................................................... 8
3.2. Kamus Data (Data Dictionary) ....................................................................................... 9
3.3. Rencana Pra-pemprosesan Data (Preprocessing) .......................................................... 10
3.4. EDA (Exploratory Data Analysis) ................................................................................ 12
Bab 4 - Perancangan Model Analitik ............................................................................................ 17
4.1. Pemilihan Algoritma ..................................................................................................... 17
4.2. Skenario Pembagian Data ............................................................................................. 19
4.3. Metrik Evaluasi ............................................................................................................. 19
Bab 5 - Perancangan Arsitektur dan Antarmuka .......................................................................... 21
5.1. Arsitektur Sistem .......................................................................................................... 21
5.2. Draf Antarmuka (Wireframe) ....................................................................................... 21
5.3. Desain API .................................................................................................................... 26
Bab 6 - Rencana Manajemen Proyek ............................................................................................ 27
6.1. Jadwal (timeline) ........................................................................................................... 27
6.2. Pemabgian Peran ........................................................................................................... 27
Referensi ....................................................................................................................................... 28



## 1

## Bab 1 – Pendahuluan
## 1.1. Latar Belakang
Perkembangan teknologi informasi dan komunikasi yang pesat telah mengubah cara
manusia  mencari  pekerjaan  secara  fundamental.  Saat  ini,  sebagian  besar  lowongan
pekerjaan  dipublikasikan  secara  daring  melalui  berbagai  platform  digital.  Namun,
melimpahnya  informasi  yang  tersedia  justru  menimbulkan  tantangan  baru  bagi  para
pencari kerja dalam menavigasi pasar tenaga kerja yang semakin kompleks.
## 1

Tingkat   pengangguran   terbuka   di   Indonesia   masih   menjadi   persoalan   serius.
Berdasarkan data Badan Pusat Statistik (BPS) tahun 2023, tingkat pengangguran terbuka
Indonesia mencapai 5,32%, dengan kelompok lulusan perguruan tinggi sebagai salah satu
segmen yang paling terdampak.
## 2
Ironisnya, kondisi ini terjadi bukan semata-mata karena
kurangnya  lapangan  kerja,  melainkan  juga  akibat  ketidaksesuaian  (mismatch)  antara
kualifikasi pencari kerja dengan kebutuhan dunia industri.
## 1,3

Fenomena skills mismatch telah diakui sebagai salah satu hambatan struktural utama
di   pasar   kerja   global   maupun   domestik.   Kajian   sistematis   oleh   Signore   et   al.
mengungkapkan  bahwa  platform  pencarian  kerja  digital  belum  sepenuhnya  mampu
menjembatani  kesenjangan  antara  profil  pelamar  dengan  kebutuhan  riil  perusahaan.
## 4

Permasalahan  ini  diperparah  oleh  kenyataan  bahwa  banyak  sistem  rekomendasi  kerja
yang  ada  saat  ini  masih  bergantung  pada  pencocokan  kata  kunci  sederhana  tanpa
mempertimbangkan relevansi semantik.
## 5

Di  sisi  lain,  para  pelamar  kerja  kerap  menghadapi  kesulitan  dalam  menemukan
lowongan yang benar-benar sesuai dengan preferensi spesifik mereka, seperti lokasi kerja,
rentang  gaji  yang  diharapkan,  jenis  pekerjaan  (full-time, part-time, remote),  maupun
tingkat pengalaman yang dipersyaratkan.
## 6
Akibatnya, banyak pelamar membuang waktu
dan  energi  untuk  melamar  posisi  yang  tidak  relevan,  yang  pada  akhirnya  menurunkan
peluang keberhasilan mereka.
## 7

Solusi  berbasis  Sains  Data  dan Natural  Language  Processing (NLP)  menawarkan
potensi  besar  untuk  mengatasi  permasalahan  ini.  Metode  TF-IDF  (Term  Frequency–
Inverse    Document    Frequency)    yang    diperkenalkan    oleh    Salton    dan    Buckley
memungkinkan  sistem  untuk  mengukur  relevansi  kata  kunci  terhadap  dokumen  dalam
koleksi  besar.
## 8,9
Representasi  vektor  tersebut  kemudian  digunakan  dalam  perhitungan


## 2

Cosine  Similarity untuk  mengukur  tingkat  kemiripan  antara  profil  pencari  kerja  dan
deskripsi  lowongan  pekerjaan,  sehingga  sistem  dapat  menentukan  tingkat  kecocokan
secara kuantitatif.
## 10,11
Namun, pendekatan berbasis TF-IDF dan Cosine Similarity masih
memiliki  keterbatasan  dalam  memahami  makna  dan  konteks  kalimat  secara  mendalam.
Oleh  karena  itu,  metode  ini  dikombinasikan  dengan Sentence-BERT  (SBERT) yang
mampu  menghasilkan  representasi  semantik  dari  kalimat  dan  memahami  hubungan
makna  antar  kata  dalam  suatu  konteks.
## 12,13
Dengan  demikian,  sistem  tidak  hanya
mengandalkan  kecocokan  kata  kunci,  tetapi  juga  mampu  menangkap  kesamaan  makna
antara preferensi pengguna dan deskripsi pekerjaan.
Dengan memanfaatkan kombinasi metode TF-IDF, Cosine Similarity, dan Sentence-
BERT,  proses  pencarian  pekerjaan  dapat  dilakukan  secara  lebih  cerdas,  akurat,  dan
personal,  sehingga  mampu  meningkatkan  relevansi  hasil  pencarian  serta  membantu
pencari kerja dalam menemukan pekerjaan yang sesuai dengan kebutuhannya.
Berdasarkan pemaparan di atas, terdapat kebutuhan nyata untuk membangun sebuah
platform  pencarian  kerja  yang  cerdas  dan  adaptif,  yang  mengintegrasikan  teknik  Sains
Data  guna  menjembatani  kesenjangan  informasi  antara  pencari  kerja  dan  peluang  kerja
yang tersedia. Kelompok Yiiha mengembangkan aplikasi berbasis web Smart Job Search
& Filtering Platform sebagai respons terhadap permasalahan tersebut.
1.2. Tujuan dan Manfaat
Tujuan utama dari proyek ini adalah membangun sebuah aplikasi web pencarian dan
penyaringan lowongan pekerjaan berbasis Sains Data yang mampu:
a. Membangun  aplikasi  berbasis  web  yang  mampu  melakukan  pencarian  lowongan
pekerjaan secara cerdas berdasarkan kata kunci dan preferensi pengguna.
b. Mengembangkan  sistem  yang  dapat  mengukur  tingkat  relevansi  antara  input
pengguna dengan data lowongan pekerjaan menggunakan metode seperti TF-IDF,
Cosine Similarity, dan Sentence-BERT.
c. Menyediakan  fitur  filtering  berdasarkan  berbagai  kriteria  seperti  lokasi,  negara,
rentang gaji, pengalaman kerja, dan jenis pekerjaan.
d. Menampilkan  hasil  pencarian  yang  diurutkan  berdasarkan  tingkat  relevansi,  gaji
tertinggi/terendah,   maupun   lowongan   terbaru   untuk   membantu   pengambilan
keputusan pencari kerja.


## 3

Manfaat yang diharapkan dari pengembangan aplikasi ini adalah sebagai berikut:
a. Membantu pencari kerja menemukan lowongan yang sesuai dengan keterampilan
dan preferensi mereka secara lebih cepat dan efisien.
b. Mengurangi kemungkinan terjadinya skill mismatch dalam proses pencarian kerja
c. Memberikan rekomendasi pekerjaan yang lebih relevan berdasarkan analisis data.
d. Memudahkan   pengguna   dalam   menyaring   dan   membandingkan   lowongan
pekerjaan berdasarkan berbagai kriteria.
1.3. Ruang Lingkup dan Batasan
Sistem yang dikembangkan merupakan aplikasi berbasis web (web-based application)
yang dapat diakses melalui browser modern tanpa memerlukan instalasi perangkat lunak
tambahan. Ruang lingkup pengembangan mencakup komponen-komponen berikut:
a. Ruang Lingkup:
i. Aplikasi yang dikembangkan berbasis web.
ii. Sistem berfokus pada fitur Smart Job Search & Filtering.
iii. Data yang digunakan berasal dari dataset lowongan pekerjaan yang hanya
menampilkan rekomendasi berdasarkan kata kunci yang dimasukkan user.
iv. Tersedia fitur filter seperti:
## 1. Lokasi
## 2. Negara
- Rentang gaji
- Pengalaman kerja
- Jenis pekerjaan (full-time, part-time, remote, hybrid)
v. Sistem menampilkan hasil pencarian dalam bentuk daftar lowongan beserta
informasi detail seperti deskripsi pekerjaan dan benefit.
b. Batasan:
i. Aplikasi   hanya   berfungsi   sebagai   sistem   pencarian   dan   rekomendasi
pekerjaan,  tidak  mencakup  proses  rekrutmen  seperti  pengiriman  lamaran
atau wawancara.
ii. Fitur  rekomendasi  masih  berbasis  pada  data  dan  filter  yang  tersedia,
sehingga   belum   menerapkan   sistem   yang    kompleks   seperti   deep
personalization.  Namun,  pada  saat  pembuatan  akun,  pengguna  diminta


## 4

untuk memasukkan data riwayat atau preferensi awal sebagai dasar untuk
memberikan rekomendasi yang lebih relevan dan bersifat personalized.



## 5

## Bab 2 - Analisis Kebutuhan Sistem
## 2.1. Kebutuhan Fungsional
Berikut daftar kebutuhan fungsional yang bisa dilakukan oleh pengguna:
a. Pengguna dapat membuat/mendaftar jika belum mempunyai sebuah akun atau bisa
langsung melakukan login kedalam sistem
b. Pengguna  dapat  memasukkan  parameter  perusahaan,  job  title  atau  skill  yang
dimiliki
c. Pengguna dapat melakukan filter pencarian lowongan berdasarkan: Lokasi, Negara,
rentang gaji, pengalaman kerja, jenis pekerjaan (full-time, part-time, remote, dll)
d. Pengguna dapat melihat fact check yang disediakan sistem seperti lowongan aktif,
perusahaan, pencari kerja serta kepuasan pekerja.
e. Pengguna  dapat  melihat  detail  informasi  lowongan  pekerjaan,  seperti:  deskripsi
pekerjaan, perusahaan, lokasi, gaji, benefit
f. Pengguna dapat menyimpan (bookmark) lowongan pekerjaan untuk dilihat kembali
di bagian profil & dashboard pengguna.
Berikut daftar kebutuhan fungsional yang bisa dilakukan oleh sistem:
a. Sistem  dapat  memproses  input  pengguna  dan  mencari  lowongan  yang  relevan
menggunakan metode pencocokan (TF-IDF serta Cosine Similarity dan SBERT).
b. Sistem dapat menampilkan hasil pencarian berdasarkan tingkat relevansi.
c. Sistem  dapat  mengurutkan  hasil  pencarian  berdasarkan:  gaji  tertinggi  /  terendah,
tanggal posting terbaru.
d. Sistem  harus  menyediakan  opsi  filter  berdasarkan  lokasi,  rentang  gaji,  tingkat
pengalaman, dan tipe pekerjaan (Full-time/Contract/Remote).
e. Sistem harus dapat menampilkan informasi lengkap (deskripsi dan benefit) ketika
salah satu lowongan dipilih.
f. Sistem  dapat  menampilkan  rekomendasi  pekerjaan  berdasarkan  profil  dan  skill
pengguna.



## 6

2.2. Kebutuhan Non-Fungsional
Berikut adalah kebutuhan non-fungsional dari sistem Smart Job Search & Filtering:
a. Performance (Kinerja)
Sistem  dapat  menampilkan  hasil  pencarian  lowongan  pekerjaan  dengan  waktu
respon  yang maksimal.
b. Availability (Ketersediaan)
Sistem  dapat  diakses  oleh  pengguna  selama  24  jam  sehari  dan  7  hari  seminggu
(24/7) melalui browser.
c. Usability (Kemudahan Penggunaan)
Sistem  memiliki  antarmuka  yang  sederhana,  intuitif,  dan  mudah  digunakan  oleh
pengguna dari berbagai latar belakang.
d. Reliability (Keandalan)
Sistem  dapat  memberikan  hasil  pencarian  yang  konsisten  dan  minim  error  saat
digunakan.
e. Compatibility (Kompatibilitas)
Sistem dapat berjalan dengan baik pada berbagai browser (Chrome, Edge, Firefox)
dan perangkat (desktop/laptop).
## 2.3. Use Case Diagram & Skenario
Diagram  Use  Case  pada  sistem  Smart  Job  Search  &  Filtering  menggambarkan
interaksi  antara  aktor  utama  yaitu  User  dengan  sistem  pencarian  kerja  berbasis  web.
Diagram ini menunjukkan berbagai fitur yang dapat diakses oleh pengguna dalam mencari
dan mengelola lowongan pekerjaan. Aktor User merupakan pengguna utama sistem yang
dapat  melakukan  berbagai  aktivitas  seperti  registrasi,  login,  mencari  pekerjaan,  hingga
melamar pekerjaan.


## 7


Berikut     penjelasan     dari     masing-masing     use     case     yang     terdapat     pada
diagram:Registrasi/Login:    Jika  pengguna  sudah  pernah  mendaftar  lalu  masuk  kedalam
web  job  &  filtering  maka  akan  melakukan  login  terlebih  dahulu.  Disini  pengguna  juga
memungkinkan untuk membuat akun baru dengan mengisi data yang diperlukan.
a. Mencari  lowongan  kerja:  Pengguna  dapat  mencari  lowongan  kerja  berdasarkan
kata kunci seperti job title, skill atau salary.
b. Filter  pencaharian  (<<include>>):  Use  case  ini  merupakan  bagian  dari  proses
pencarian lowongan. Pengguna dapat mempersempit hasil pencarian berdasarkan
kriteria tertentu seperti lokasi, gaji, pengalaman, dan jenis pekerjaan.
c. Melihat  detail  lowongan:  Pengguna  jika  dapat  melihat  informasi  lengkap  dari
lowongan yang dipilih baik deskripsi pekerjaan, perusahaan dan benefit.
d. Simpan lowongan: Pengguna dapat menyimpan lowongan pekerjaan yang diminati
untuk bisa di akses lagi kemudian hari.
e. Melamar  pekerjaan:  Setelah  pengguna  menemukan  lowongan  yang  diminati  dan
sesuai pengguna dapat melamar langsung melalui sistem.
f. Melihat profil: Pengguna dapat melihat / mengelola informasi profil serta aktivitas
yang telah dilakukan seperti riwayat lamaran serta notifikasi.


## 8

Bab 3 - Analisis dan Perancangan Data
Menurut  Sugiyono  (2019),  analisis  data  adalah  proses  mengolah  dan  menafsirkan  data
untuk  memperoleh  informasi  yang  bermakna  serta  mendukung  pengambilan  keputusan.
## 14
dapat
diambil kesimpulan bahwa analisis data adalah suatu proses atau kegiatan untuk mengubah data
mentah  atau  abstrak  ke  dalam  bentuk  yang  lebih  tersusun  dan  sistematis  agar  dapat  digunakan
untuk  memperoleh  informasi.  Kelompok  kami  melakukan  analisis  secsara  bertahap,  mulai  dari
mengumpulkan   data,   membersihkan   data   yang   kotor,   melakukan   eksplorasi,   kemudian
melanjutkan ke tahap pemodelan untuk mendapatkan informasi dan keputusan yang sesuai.
## 3.1. Sumber Data
Data  diambil  dari  situs  web  kaggle tanpa  adanya  tambahan  data  sintetis  dari  luar
dikarenakan data yang diambil telah memenuhi ketentuan minimal baris dan jumlah data.
Data sintetis merupakan data yang dibuat secara artifisial dengan tujuan merepresentasikan
pola dan struktur dari data asli, sehingga dapat digunakan untuk analisis tanpa melibatkan
data  yang  bersifat  sensitif  atau  rahasia.
## 15
Menurut  deskripsi  yang  tertera  pada  website
kaggle tersebut, dataset ini berisi kumpulan lowongan pekerjaan buatan (data sintetis) yang
dirancang  untuk  keperluan  analisis  dan  penelitian.  Data  yang  tersedia  cukup  beragam,
mencakup   berbagai   jenis   pekerjaan dan   industri,   sehingga   dapat   digunakan   untuk
mengeksplorasi tren pasar kerja maupun sebagai bahan latihan dalam pengolahan bahasa
alami  (NLP)  dan  machine  learning.  Pemrosesan  Bahasa  Alami  (Natural  Language
Processing/NLP)  merupakan  bidang  dalam  kecerdasan buatan  yang  memungkinkan
komputer  untuk  memahami,  menginterpretasi,  dan  berinteraksi  dengan  bahasa  manusia
secara  alami.
## 16
Machine  Learning  merupakan  metode  dalam  kecerdasan  buatan  yang
memungkinkan sistem untuk belajar dari data, mengenali pola, serta membuat keputusan
atau  prediksi  secara  otomatis.
## 17
Dataset  ini  terdiri  dari  1615940  baris  dan  23  kolom.
Terdapat 23 atribut dari dataset ini, atribut - atribut tersebut yaitu:
a. Job ID: ID unik untuk setiap lowongan pekerjaan.
b. Experience: Pengalaman kerja yang dibutuhkan atau diutamakan.
c. Qualifications: Kualifikasi pendidikan yang diperlukan.
d. Salary Range: Kisaran gaji atau kompensasi yang ditawarkan.
e. Location: Kota atau wilayah tempat pekerjaan berada.
f. Country: Negara lokasi pekerjaan.


## 9

g. Latitude: Koordinat lintang dari lokasi pekerjaan.
h. Longitude: Koordinat bujur dari lokasi pekerjaan.
i. Work Type: Jenis pekerjaan (misalnya full-time, part-time, atau kontrak).
j. Company Size: Perkiraan ukuran atau skala perusahaan.
k. Job Posting Date: Tanggal lowongan dipublikasikan.
l. Preference: Preferensi atau persyaratan khusus untuk pelamar (misalnya hanya pria,
hanya wanita, atau keduanya).
m. Contact Person: Nama orang yang bisa dihubungi terkait lowongan.
n. Contact: Informasi kontak untuk pertanyaan terkait pekerjaan.
o. Job Title: Nama posisi atau jabatan yang ditawarkan.
p. Role:  Peran  atau  kategori  pekerjaan  (misalnya  software  developer,  marketing
manager).
q. Job Portal: Platform atau website tempat lowongan diposting.
r. Job Description: Penjelasan detail mengenai tugas dan persyaratan pekerjaan.
s. Benefits:  Informasi  mengenai  fasilitas  atau  tunjangan  yang  diberikan  (misalnya
asuransi kesehatan, dana pensiun).
t. Skills: Keterampilan yang dibutuhkan untuk pekerjaan tersebut.
u. Responsibilities: Tanggung jawab atau tugas yang harus dilakukan.
v. Company Name: Nama perusahaan yang membuka lowongan.
w. Company Profile: Gambaran singkat tentang perusahaan dan tujuannya.
https://www.kaggle.com/datasets/ravindrasinghrana/job-description-dataset
3.2. Kamus Data (Data Dictionary)
Atribut  yang  ada  pada  sumber  data  tidak  semuanya  digunakan.  Untuk  memenuhi
spesifikasi  website,  atribut  yang  digunakan  berjumlah  19  atribut.  Dibawah  ini  adalah
atribut data kaggle Job Dataset yang akan digunakan beserta keterangannya.
## Nama Kolom Tipe Data Keerengan
Job Title Object Posisi pekerjaan yang ditawarkan
Skills Object Keterampilan yang dibutuhkan
Job Description Object Deskripsi lengkap pekerjaan
Responsibilities Object Tugas dan tanggung jawab pekerjaan
Qualificatons Object persyaratan pelamar


## 10

Role Object Kategori pekerjaan
Experience Object Informasi pengalaman kerja
Salary Range Object Rentang gaji
Location Object Lokasi pekerjaan
country Object Negara tempat pekerjaan berada
Work Type Object Jenis pekerjaan
Company Name Object Nama perusahaan
## Company Profile Object Deskripsi
Job Posting Date Object Tanggal publikasi lowongan
Benefits Object Fasilitas atau keuntungan yang ditawarkan
Preference Object Persyaratan khusus pelamar (laki-laki/perempuan)
Contact Person Object Nama orang yang dapat dihubungi terkait lowongan
Contact Object Nomor orang yang dapat dihubungi terkait lowongan
Job Portal Object Website lowongan di posting
Data yang diperoleh melalui website kaggle tersebut akan dieksplorasi untuk dipahami
isinya sehingga data ini dapat dimanfaatkan dengan maksimal sebagai fondasi dari website
yang akan dirancang.
3.3. Rencana Pra-pemprosesan Data (Preprocessing)
Menurut  penelitian  di Jurnal  Informatics  and  Computer  Science  (JINACS), data
preprocessing adalah  proses  penting  dalam  analisis  data  mining  yang  bertujuan  untuk
membersihkan, mengubah format, dan mempersiapkan data mentah sehingga lebih mudah,
akurat,  dan  layak  digunakan  untuk  analisis  atau  pemodelan  lebih  lanjut.  Tahapan  ini
meliputi pembersihan data, transformasi, seleksi fitur, dan pengkodean variabel agar data
siap  diproses  oleh  algoritma  data  mining.  sebelum  melakukan  eksplorasi,  data  akan
dibersihkan terlebih dahulu dari missing value, data duplikat, inkonsistensi data, serta nilai
yang tidak valid. Proses ini dikenal sebagai data cleaning. Data cleaning merupakan tahap
penting dalam preprocessing data karena data mentah sering mengandung missing values
dan outlier.
## 18
Selain itu, data cleaning dilakukan untuk meningkatkan kualitas data.
## 19
## Pada
tahap identifikasi awal, ditemukan bahwa sebagian besar data masih bertipe object. Data
ini kemudian harus dikonversi ke tipe data yang sesuai, misalnya integer, float, atau string,
sehingga  memungkinkan  pengolahan  dan  analisis  data  berjalan  secara  tepat.  Setelah


## 11

melakukan  konversi  dan  melakukan Data  Cleaning, Diperoleh  data  yang  telah  bersih
dengan keterangan atribut seperti pada lampiran di bawah ini

Data yang telah dibersihkan kini memiliki 28 atribut. Terdapat beberapa atribut yang
dipecah menjadi dua karena menunjukkan kisaran nilai, serta atribut yang dipecah menjadi
beberapa  bagian  karena  memuat  berbagai  informasi.  Atribut  yang  dipecah  menjadi  dua
adalah Salary  Range dan Experience,  sedangkan  atribut  yang  dipecah  menjadi  beberapa
bagian adalah Company Profile, karena mencakup informasi seperti Sector, Industry, City,
State,  Zip  (kode  pos),  Website,  Ticker  (kode  saham),  dan  CEO.  Atribut-atribut  baru ini
tetap akan digunakan dalam perancangan website.
Penanganan  missing  value  pada  data  ini  dilakukan  dengan  cara  mengidentifikasi
jumlah data yang kosong pada setiap atribut kemudian beberapa atribut yang tidak relevan
atau  memiliki  potensi  nilai  kosong  dihapus  dari  dataset.  Dengan  demikian,  data  yang
digunakan pada tahap selanjutnya telah bebas dari permasalahan missing value yang dapat
mempengaruhi hasil analisis. Penanganan missing value dapat dilakukan dengan beberapa
metode, seperti penghapusan data atau imputasi, agar data yang digunakan menjadi lebih
akurat dan konsisten.
## 20
Pada tahap preprocessing teks, dilakukan penggabungan kolom Job
Title, Skills,   dan Job   Description menjadi   satu   fitur   teks.   Selanjutnya,   dilakukan


## 12

penghapusan stopwords untuk  menghilangkan  kata-kata  yang  tidak  memiliki  makna
penting,  sehingga  data  teks  dapat  digunakan  untuk  proses  analisis  dan  pemodelan.  Pada
tahap ini juga dilakukan feature engineering dengan mengolah beberapa atribut yang sudah
ada.  Atribut  seperti  lokasi  (City,  State,  dan  lainnya)  digabungkan  menjadi  satu,  serta
dilakukan   pengolahan   pada   atribut   Ticker   yang   dapat   digunakan   sebagai   identitas
perusahaan. Feature engineering merupakan proses transformasi atribut dari data mentah
menjadi fitur yang lebih representatif untuk meningkatkan kualitas analisis.
## 21

3.4. EDA (Exploratory Data Analysis)
Tahap selanjutnya yaitu eksplorasi data. Eksplorasi data merupakan tahap awal dalam
analisis  data  yang  bertujuan  untuk  memahami  karakteristik  dataset  secara  menyeluruh.
Melalui eksplorasi data, peneliti dapat mengidentifikasi pola, menemukan hubungan antar
variabel,  serta  mendeteksi  adanya  data  yang  tidak  lengkap  atau  menyimpang.  Selain  itu,
eksplorasi  data  juga  membantu  dalam  menentukan  metode  analisis  yang  tepat  sehingga
dapat  meningkatkan  kualitas  dan  akurasi  hasil  analisis.
## 22
Sebelum  memasuki  tahap
eksplorasi data, terdapat beberapa hal yang perlu diketahui dari data tersebut, di antaranya:
a. Bagaimana distribusi jenis pekerjaan (work type) dan tingkat pengalaman?
Ini  penting  untuk  diketahui  agar  dapat  menyesuaikan  fitur  filter  pada  website
dengan kondisi data yang tersedia.
b. Bagaimana  rentang  gaji  yang  ditawarkan  dan  apakah  terdapat  nilai  ekstrem
## (outlier)?
Ini penting untuk menentukan batas yang wajar dalam fitur filter gaji
c. Bagaimana distribusi panjang teks pada job description dan skills?
Ini  penting  untuk  mengidentifikasi  tren  kebutuhan  pasar  kerja  dan  mendukung
sistem rekomendasi.
d. Kata  kunci  apa  saja  yang  sering  muncul  dalam  data?  Keahlian  (skills)  apa  yang
paling banyak dibutuhkan?
Ini penting untuk memahami fokus utama kebutuhan perusahaan, mengidentifikasi
tren    kebutuhan    pasar    kerja    dan    mendukung    sistem    rekomendasi,    serta
meningkatkan relevansi sistem pencarian.
e. Berapa rata-rata gaji tertinggi yang ditawarkan?


## 13

Ini  penting  untuk  memberikan  gambaran  peluang  pekerjaan  dengan  kompensasi
paling kompetitif.
Untuk  menjawab  pertanyaan-pertanyaan  tersebut,  dilakukan  proses  Exploratory  Data
Analysis (EDA) yang menghasilkan beberapa temuan sebagai berikut:
a. Analisis Distribusi Work Type dan Pengalaman

Berdasarkan  grafik,  jumlah  lowongan  untuk  setiap  jenis  pekerjaan  (work
type) seperti Full-Time, Part-Time, Contract, Intern, dan Temporary terlihat hampir
sama,  berada  di  kisaran  sekitar  2800–2900  lowongan.  Untuk  syarat  pengalaman
minimum juga menunjukkan pola yang mirip, di mana jumlah lowongan pada tiap
tingkat  pengalaman  tidak berbeda  jauh  satu  sama  lain.  Dari  hasil  tersebut  bisa
dilihat  bahwa  data  tidak  didominasi  oleh  satu  jenis  pekerjaan  atau  satu  tingkat
pengalaman  saja.  Artinya,  lowongan  pekerjaan  tersebar  cukup  merata.  Peluang
kerja dalam dataset ini terbuka untuk berbagai jenis pekerjaan dan berbagai tingkat
pengalaman, baik untuk pemula maupun yang sudah berpengalaman. Analisis ini
berguna   untuk   pengembangan   fitur   pada   website,   khususnya   bagian   filter
pencarian.  Karena  jumlah  data  di  setiap  jenis  pekerjaan  cukup  seimbang,  semua
kategori bisa ditampilkan sebagai pilihan filter. Selain itu, karena data pengalaman
juga  merata,  pengguna  dengan  tingkat  pengalaman  yang  berbeda  tetap  bisa
mendapatkan hasil pencarian yang sesuai sehingga pengguna juga tidak akan sering
menemukan hasil pencarian yang kosong saat menggunakan filter.



## 14

b. Analisis Rentang Gaji dan Outlier



Dari grafik terlihat bahwa gaji minimum untuk setiap tingkat pendidikan,
seperti bachelor, master, dan doctorate, memiliki rentang yang hampir sama. Nilai
tengah  (median)  dari  ketiganya  juga  berada  di  angka  yang  sama,  yaitu  sekitar
$60.000, dan sebaran datanya tidak menunjukkan perbedaan yang signifikan. Dari
sini bisa dilihat bahwa tingkat pendidikan tidak terlalu mempengaruhi besaran gaji
minimum dalam dataset ini. Artinya, meskipun seseorang memiliki gelar yang lebih
tinggi,  belum  tentu  mendapatkan  gaji minimum  yang  lebih  besar  dibandingkan
dengan  yang  bergelar  lebih  rendah.  Kemungkinan  besar,  faktor  lain  seperti
pengalaman  kerja  atau  keterampilan  lebih  berpengaruh  dalam  menentukan  gaji.
Hasil  ini  bisa  dimanfaatkan  dalam  pengembangan  website,  terutama  pada  sistem
rekomendasi.  Sistem  tidak  perlu  terlalu  fokus  pada  pendidikan  saja,  tetapi  juga
harus mempertimbangkan faktor lain seperti skills atau pengalaman agar hasil yang
diberikan  lebih  relevan.  Selain  itu,  ini  juga  bisa  jadi  informasi  tambahan  bagi
pengguna bahwa gelar pendidikan bukan satu-satunya penentu dalam mendapatkan
gaji yang lebih tinggi.



## 15

c. Analisis Distribusi Panjang Teks

Dari  grafik  terlihat  bahwa  panjang  teks  pada job  description dan skills
sebagian besar berada pada rentang yang tidak terlalu panjang. Artinya, deskripsi
pekerjaan  dan  daftar  skill  yang  dituliskan  cenderung  singkat  dan  tidak  terlalu
bertele-tele, meskipun tetap ada beberapa yang lebih panjang dari yang lain. Dari
sini  bisa  dilihat  bahwa  informasi  yang  diberikan  dalam  lowongan  pekerjaan
umumnya  sudah  cukup  ringkas  dan  langsung  ke  poin  penting.  Hal  ini  juga
menunjukkan  bahwa  perusahaan  lebih  fokus  menyampaikan  informasi  inti  tanpa
terlalu banyak tambahan yang tidak perlu. Hasil ini penting untuk sistem yang akan
dibuat, terutama pada bagian pengolahan teks seperti TF-IDF. Karena teksnya tidak
terlalu panjang, proses pengolahan data bisa berjalan lebih cepat dan ringan. Selain
itu,  sistem  juga  bisa  lebih  mudah  menangkap  kata-kata  penting  yang  dibutuhkan
untuk  pencarian  dan  rekomendasi  pekerjaan,  sehingga  hasil  yang  diberikan  ke
pengguna bisa lebih relevan.
d. Analisis Kata Kunci (Word Frequency / Wordcloud)

Dari hasil analisis, terlihat ada beberapa kata yang sering muncul, terutama
di  bagian job  description dan skills.  Kata-kata  ini  umumnya  berkaitan  dengan


## 16

pekerjaan,  seperti  data,  analisis,  manajemen,  dan  berbagai  keterampilan  lainnya.
Dari sini bisa dilihat kalau kata yang sering muncul itu menggambarkan apa yang
paling dibutuhkan oleh perusahaan. Semakin sering sebuah kata muncul, berarti hal
tersebut  memang  banyak  dicari.  Hasil  ini  bisa  dimanfaatkan  untuk  website,
khususnya di fitur pencarian dan rekomendasi. Dengan mengetahui kata kunci yang
sering muncul, sistem bisa menampilkan lowongan yang lebih sesuai dengan apa
yang dicari pengguna. Selain itu, kata-kata tersebut juga bisa dijadikan acuan agar
rekomendasi yang diberikan lebih relevan dan tidak asal muncul.
e. Analisis Rata-rata Gaji Tertinggi

Dari  hasil  analisis,  terlihat  bahwa  beberapa  negara  memiliki  rata-rata
penawaran gaji maksimum yang tinggi dengan nilai yang tidak berbeda jauh satu
sama lain. Negara seperti Norway, Chad, dan UAE berada di posisi teratas dengan
rata-rata gaji maksimum di atas 100.000 USD. Selain itu, negara lain seperti Bosnia
and Herzegovina, Paraguay, hingga Democratic Republic of Congo juga termasuk
dalam   daftar,   meskipun   nilainya   sedikit   lebih   rendah.   Secara   keseluruhan,
perbedaan  antar  negara  dalam  10  besar  ini  tidak terlalu  jauh.  Hasil  ini  bisa
dimanfaatkan dalam pengembangan website, terutama untuk membantu pengguna
yang  ingin  mencari  pekerjaan  dengan  gaji  tinggi.  Informasi  ini  dapat  digunakan
pada  fitur  filter  maupun  rekomendasi,  sehingga  pengguna  bisa  lebih  mudah
menemukan lowongan yang sesuai dengan ekspektasi gaji mereka.



## 17

## Bab 4 - Perancangan Model Analitik
## 4.1. Pemilihan Algoritma
Berdasarkan  hasil  EDA  sebelumnya, dataset yang  digunakan  mayoritas  berupa  data
teks, seperti Qualifications, location, country, work type, job title, role, job description, dan
sebagainya.  Dengan  dataset  tersebut,  tujuan  akhirnya  adalah  menampilkan  rekomendasi
lowongan pekerjaan berdasarkan masukan kata kunci maupun filter dari user. Oleh sebab
itu,  kami  menggunakan  dua  jenis  algoritma,  yaitu Term  Frequency – Inverse  Document
Frequency (TF-IDF)  dengan Cosine  Similarity serta Sentence  Bidirectional  Encoder
Representations from Transformer (SBERT).
TF-IDF merupakan salah satu algoritma dalam Natural Language Processing (NLP)
yang  dapat  mengidentifikasi  kata-kata  penting  dan  mengurangi  kata-kata  yang  tidak
penting atau umum dalam suatu dokumen.
## 23
Hal tersebut sangat cocok untuk mencari kata
kunci  berdasarkan  masukan  dari user melalui search  bar maupun filter yang  tersedia.
Masukan  tersebut  kemudian  akan  dibandingkan  dengan  data  pada  kolom,  seperti  Job
Description, Skills, Benefits, dan Responsibilities.
TF atau Term Frequency-Inverse mengukur seberapa sering suatu kata muncul dalam
data pada kolom tersebut.
## 23
TF dapat dihitung menggunakan rumus
## 푇퐹
## (
## 푡,푑
## )
## =
## 푓
## 푡,푑
## 훴
## (
## 푡
## ′
## ∈푑
## )
## ⋅ 푓
## 푡
## ′
## ,푑

dengan 푓
## 푡,푑
merepresentasikan  banyaknya  kata 푡 pada  dokumen 푑.  Sedangkan 훴
## (푡′∈푑)
## ⋅
## 푓
## 푡′,푑
adalah  banyaknya  kata 푡 di  seluruh  dokumen 푑.
## 24
Jika  skor  TF  tinggi,  maka  kata
tersebut  sering  muncul  dalam  dokumen  tersebut  dan  mengindikasikan  kata  tersebut
kemungkinan penting dalam dokumen tersebut.
## 25
Sedangkan IDF atau Inverse Document
Frequency memberikan bobot yang lebih besar pada kata-kata yang jarang muncul dalam
data  kolom  tersebut  sehingga  kata-kata  umum  tidak  mendominasi  analisis  kemiripan.
## 23

IDF dapat dihitung menggunakan
## 퐼퐷퐹
## (푡)
## =푙표푔
## 1+푛
## 1+푑푓(푡)
## +1
dengan 푛 adalah  banyaknya  dokumen  dalam  keseluruhan  data  sedangkan 푑푓
## (푡)
adalah
banyaknya  dokumen  yang  memuat  kata 푡.
## 24
Jika  skor  IDF  rendah,  maka  kata  tersebut
muncul  di  banyak  dokumen,  yang  berarti  kata  tersebut  kurang  penting  atau  tidak  terlalu


## 18

membedakan  antar  dokumen.
## 3
Dari  hasil  TF  dan  IDF,  dapat  dihasilkan  bobot  tingkat
kepentingan sebuah kata dalam dokumen menggunakan rumus:
## 25
## 푊
## (푡,푑)
## =푇퐹
## (푡,푑)
## ×퐼퐷퐹
## (푡)
## .

Dokumen-dokumen, misal masukan user maupun data-data yang tersedia, akan diubah
menjadi vektor hasil dari 푊
## (푡,푑)
## .
## 25
Vektor-vektor tersebut akan dihitung untuk menentukan
seberapa  mirip  antara  masukan user dengan  data  yang  tersedia  menggunakan cosine
similarity, yaitu:
## 24

## 퐶표푠푖푛푒 푠푖푚푖푙푎푟푖푡푦
## (푞,푑
## 푗
## )
## =
## 푞 ⋅ 푑
## 푗
## |푞| ⋅ |푑
## 푗
## |

dengan 푞 merepresentasikan  vektor  masukan user dan 푑
## 푗
merepresentasikan  vektor  data
yang tersedia. Sedangkan |푞||푑
## 푗
| merupakan panjang vektor dari 푞 dan 푑
## 푗
## .
## 24
Jika hasilnya
mendekati   0,   maka   dua   dokumen   tersebut   tidak   memiliki   kemiripan,   begitu   pun
sebaliknya.
## 23

Meskipun TF-IDF dapat  mengidentifikasi kemiripan kata dalam dokumen, algoritma
ini belum bisa memahami konteks kata tersebut dalam dokumen. Dalam kasus ini, makna
kata dibutuhkan, terutama pada kolom Job Description, Skills, dan Responsibilities karena
data pada kolom tersebut memungkin kan untuk memiliki kemiripan kata, tetapi konteks
penggunaannya berbeda. Oleh karena itu, algoritma SBERT digunakan untuk mempelajari
hubungan kata dengan kalimat, seperti sinonim, nuansa, dan syntax kalimat.
## 23

SBERT  merupakan  modifikasi  BERT  yang  menggunakan  jaringan  Siamese  dan
triplet.
## 12
SBERT mampu memproses setiap data pada kolom Job Description, Skills, dan
Responsibilities  secara  terpisah  untuk  menghasilkan  representasi  vektor  berukuran  tetap
(embeddings)   yang   merangkum   keseluruhan   makna   kalimat.
## 12
Algoritma   ini   akan
memastikan  vektor-vektor  tersebut  berdekatan  dengan  teks  yang  memiliki  kemiripan
makna, meskipun terdapat perbedaan kosa kata atau istilah yang digunakan.
## 12

Ketika user melakukan  pencarian,  SBERT  akan  langsung  mengubah  teks  tersebut
menjadi  vektor embedding yang  serupa.  Selanjutnya,  sistem  akan  mencocokan  vektor
masukan  dengan  vektor  dari  data  yang  tersedia  menggunakan  metrik  pengukuran,  sperti
cosine similarity. Pendekatan ini memungkinkan untuk mengevaluasi tingkat kecocokkan
berdasarkan   pemahaman   konteks   yang   mendalam.   Dengan   begitu,   sistem   dapat


## 19

merekomendasikan lowongan pekerjaan yang paling relevan dengan kualifikasi pengguna
lebih akurat.
## 12

## 4.2. Skenario Pembagian Data
Data  akan  dibagi  menjadi  80%  data  training  dan  20%  data  testing.  Data  training
digunakan untuk sistem mempelajari fitur teks, seperti pembentukan matriks TF-IDF dan
embedding   SBERT.   Sedangkan   data   testing   untuk   mengevaluasi   performa   sistem
rekomendasi.   Untuk   memastikan   evaluasi   bagus,   digunakan   metode   K-Fold   Cross
Validation  dengan  K  =  5.  Artinya  dataset  dibagi  menjadi  5  bagian.  Tiap  bagian  akan
bergantian  menjadi  data  testing  dan  sisanya  data  training.  Hal  tersebut  membantu
memastikan model tidak bergantung pada satu bagian data saja. Selain itu, proses fitting
TF-IDF dilakukan pada data training untuk pembentukan vocabulary dan IDF. Sedangkan
SBERT, model pre trained digunakan, namun embedding tetap dihitung berdasarkan data
training dan dibandingkan dengan data testing.
## 4.3. Metrik Evaluasi
Karena    rekomendasi    lowongan    pekerjaan    merupakan recommender    system
berdasarkan  konten,  maka  metrik  evaluasi  yang  digunakan  berfokus  pada  kualitas  hasil
rekomendasi. Beberapa metrik yang digunakan adalah:
a. Precision@K
Precision@K  mengukur  seberapa  banyak  rekomendasi  Top-K  yang  relevan  terhadap
kebutuhan pengguna.
## 26
Rumus yang diapakai adalah
## 푃푟푒푐푖푠푖표푛@퐾=
## 퐽푢푚푙푎ℎ 푖푡푒푚 푟푒푙푒푣푎푛 푝푎푑푎 푇표푝−퐾
## 퐾

Semakin tinggi nilai Precision@K, semakin akurat rekomendasi yang diberikan pada posisi
teratas.
b. Recall@K
Recall@K mengukur seberapa banyak item relevan yang berhasil ditemukan oleh sistem
dari seluruh item relevan yang ada.
## 26
Recall@K menggunakan rumus
## 푅푒푐푎푙푙@퐾=
## 퐽푢푚푙푎ℎ 푖푡푒푚 푟푒푙푒푣푎푛 푝푎푑푎 푇표푝−퐾
## 푇표푡푎푙 푖푡푒푚 푟푒푙푒푣푎푛

Metrik  ini  memastikan  sistem  tidak  melewatkan  banyak  rekomendasi  yang  sebenarnya
relevan.
c. F1-Score@K
F1-Score@K digunakan untuk menyeimbangkan Precision@K dan Recall@K.
## 26



## 20

## 퐹1@퐾=2×
## 푃푟푒푐푖푠푖표푛 × 푅푒푐푎푙푙
## 푃푟푒푐푖푠푖표푛 + 푅푒푐푎푙푙

d. Mean Average Precision (MAP)
MAP  mengukur  kuaitas  rankng  secara  keseluruhan  dengan  memepertimbangkan  posisi
item  relevan  dalam  daftar  rekomendasi.
## 26
Semakin  tinggi  MAP,  semakin  baik  urutan
rekomendasi urutan yang dihasilkan.
## 26

e. Cosine Similarity
Cosine  similarity  juga  digunakan  untuk  membandingkan  performa  TF-IDF  dengan
## SBERT.



## 21

Bab 5 - Perancangan Arsitektur dan Antarmuka
## 5.1. Arsitektur Sistem
Sistem  yang  dikembangkan  merupakan  platform  pencarian  kerja  berbasis  website
yang  memanfaatkan  teknologi  NLP  untuk  memberikan  rekomendasi  pekerjaan  yang
relevan. Arsitektur sistem menggunakan konsep client-server, di mana frontend berfungsi sebagai
antarmuka  pengguna  dan  backend  sebagai  pemroses  data  serta  penghubung  dengan  model
machine  learning.
## 27
Pengguna  memasukkan  kata  kunci,  skill,  atau  preferensi  pekerjaan melalui
website.  Data  tersebut  kemudian  dikirim  ke  backend  melalui  API.
## 28
Selanjutnya,  backend
memproses  input  menggunakan  model  NLP,  yaitu  TF-IDF,  Cosine  Similarity,  dan  Sentence-
BERT   untuk   mengukur   kemiripan   antara   input   pengguna   dan   data   lowongan.
## 12,13
## Hasil
perhitungan digunakan untuk menentukan rekomendasi pekerjaan yang paling relevan, kemudian
dikirim kembali ke frontend untuk ditampilkan kepada pengguna. Berikut alur sistem yang akan
digunakan.

5.2. Draf Antarmuka (Wireframe)
Perancangan antarmuka bertujuan untuk memberikan gambaran tampilan sistem yang
sederhana dan mudah digunakan.
## 29
Halaman utama menampilkan fitur pencarian berupa


## 22

search bar untuk memasukkan kata kunci pekerjaan, skill, atau lokasi. Komponen utama
dalam antarmuka meliputi:
a. Navigation bar (beranda, lowongan, perusahaan, dll)
b. Search bar sebagai input utama pengguna
c. Filter kategori pekerjaan (remote, full-time, part-time, dll)
d. Halaman Profile,  menunjukkan username,  keahlian, level  keahlian,  lowongan
tersimpan, serta rekomendasi pekerjaan.
e. Daftar lowongan pekerjaan dalam bentuk card
f. Detail lowongan pekerjaan
g. Tombol aksi “Simpan”
## Keterangan Elemen Wireframe :
a. Halaman Beranda (Home)


## 23


Alur interaksi:
- Jika pengguna mengetik di search bar (Cari posisi, perusahaan...) lalu klik
“Cari”  →  maka  pengguna  akan  diarahkan  ke  halaman  Daftar  Lowongan
dengan hasil sesuai kata kunci.


## 24

- Jika  pengguna  klik  menu  “Lowongan”  di  navbar  →  langsung  masuk  ke
halaman Daftar Lowongan.
- Jika klik “Masuk” → masuk ke halaman login (walaupun tidak ditampilkan di
wireframe).
- Jika klik “Daftar” → masuk ke halaman Daftar Akun
b. Halaman Daftar Lowongan

Alur interaksi:
- Jika pengguna klik salah satu card lowongan (misalnya Shopee / Tokopedia)
→ maka detail lowongan akan tampil di panel sebelah kanan.
- Jika klik tombol “Lamar Sekarang” → pengguna akan diarahkan ke proses
lamaran (bisa ke form atau sistem apply).
- Jika klik “Simpan Lowongan” → lowongan akan masuk ke menu Lowongan
Tersimpan di dashboard.
- Jika klik filter (Remote, Full-time, Part-time) → daftar lowongan akan terfilter
sesuai pilihan.
c. Halaman Daftar Akun


## 25


Alur interaksi:
- Jika pengguna mengisi form (nama, email, keahlian, jurusan kuliah, dan lain-
lain)  lalu  klik  “Buat  Akun  Sekarang”  →  akun  akan  dibuat  dan  pengguna
diarahkan ke Profil & Dashboard.
- Jika klik “Masuk di sini” → diarahkan ke halaman login.
- Jika klik “Daftar dengan Google” → daftar akun menggunakan Google (login
cepat).



## 26

d. Halaman Profil & Dashboard

Alur interaksi:
- Jika  pengguna  klik  menu  “Lowongan  Tersimpan”  →  menampilkan  daftar
pekerjaan yang sudah disimpan sebelumnya.
- Jika  klik  salah  satu  lowongan  di  Lamaran  Terbaru  →  bisa  melihat  status
lamaran (review, interview, dll).
- Jika melihat bagian Rekomendasi lalu klik salah satu job → akan membuka
detail lowongan tersebut.
- Jika klik Notifikasi → menampilkan update terkait lamaran
5.3. Desain API
API digunakan sebagai  penghubung antara frontend dan backend agar proses
pertukaran  data  dapat  berjalan  dengan  baik.
## 30
API  menerima  input  dari  pengguna,
kemudian  memprosesnya  menggunakan  model  NLP,  dan  mengembalikan  hasil  berupa
rekomendasi pekerjaan.


## 27

## Bab 6 - Rencana Manajemen Proyek
## 6.1. Jadwal (timeline)
a. Minggu 1–2: Eksplorasi dan persiapan data, meliputi pengumpulan dataset dari Kaggle,
data cleaning, serta Exploratory Data Analysis (EDA) untuk memahami karakteristik
data.
b. Minggu  3–4:  Pembuatan  dan  pengembangan  model  menggunakan  metode Natural
Language Processing (NLP) seperti TF-IDF, Cosine Similarity, dan Sentence-BERT
## (SBERT).
c. Minggu 5: Pengembangan sistem, termasuk pembuatan backend, frontend, API, serta
antarmuka pengguna (User Interface/UI).
d. Minggu 6: Integrasi seluruh komponen sistem dan dilakukan pengujian (testing) untuk
memastikan aplikasi berjalan dengan baik dan sesuai kebutuhan.
## 6.2. Pemabgian Peran
## Nama Peran
## Jihan Fauziah Rahmah
Data Engineer. Menentukan sumber data, membuat data dictionary,
serta menyusun rencana preprocesing
## Nayma Najely
Project Manager & Business Analyst. Menyusun latar belakang,
tujuan, batasan, serta timeline
## Najwa Anisa Putri
System Analyst. Menyusun kebutuhan fungsional, non-fungsional,
serta membuat use case dagram & skenaro
## Hasna Rofifah Wardani
Machine Learning Engineer. Memilih algoritma, menentukan
skenario pembagian data, serta menentukan metrik evaluasi
## Rosandi Setiano
Software/UI Engineer. Mendesain arsitektur sistem, membuat
wireframe UI, serta mendesain API



## 28

## Referensi
- World Employment and Social Outlook Trends 2023. 2023. doi:10.54394/SNCP1637
- KEADAAN ANGKATAN KERJA DI INDONESIA Februari 2024. 2024.
https://www.bps.go.id/id/publication/2024/06/07/112a10c79b8cfa70eec9f6f3/keadaan-
angkatan-kerja-di-indonesia-februari-2024.html
- Future of Jobs Report 2023 (INSIGHT REPORT, MAY 2023). 2023.
- Signore C, Della Piana B, Di Vincenzo F. Digital Job Searching and Recruitment
Platforms: A Semi-systematic Literature Review. In: Methodologies and Intelligent
Systems for Technology Enhanced Learning, Workshops - 13th International Conference.
Springer, Cham; 2023:313-322. doi:10.1007/978-3-031-42134-1_31
- Freire MN, de Castro LN. e-Recruitment recommender systems: a systematic review.
Knowl Inf Syst. 2020;63(1):1-20. doi:10.1007/s10115-020-01522-8
## 6. JOBS LOST, JOBS GAINED: WORKFORCE TRANSITIONS IN A TIME OF
AUTOMATION. 2017. www.mckinsey.com/mgi.
- OECD. OECD Employment Outlook 2023: Artificial Intelligence and the Labour Market.
OECD Publishing; 2023. doi:10.1787/08785bba-en
- Saha R. Understanding TF-IDF (Term Frequency-Inverse Document Frequency).
GeeksforGeeks. December 17, 2025. Accessed March 15, 2026.
https://www.geeksforgeeks.org/machine-learning/understanding-tf-idf-term-frequency-
inverse-document-frequency/
- Manning CD., Raghavan Prabhakar, Schütze Hinrich. Introduction to Information
## Retrieval. Vol 35. Cambridge University Press; 2008.
doi:https://doi.org/10.1162/coli.2009.35.2.307?urlappend=%3Futm_source%3Dresearchg
ate.net%26utm_medium%3Darticle
- Krantz T, Jonker A. What is cosine similarity? IBM. Accessed March 15, 2026.
https://www.ibm.com/think/topics/cosine-similarity
- Sharada R. Cosine Similarity. GeeksforGeeks. July 15, 2025. Accessed March 15, 2026.
https://www.geeksforgeeks.org/dbms/cosine-similarity/
- Reimers N, Gurevych I. Sentence-BERT: Sentence Embeddings using Siamese BERT-
Networks. Published online November 2019:3982-3992.
doi:https://doi.org/10.48550/arXiv.1908.10084


## 29

- Jurafsky D, Martin JH. Speech and Language Processing An Introduction to Natural
Language Processing, Computational Linguistics, and Speech Recognition with Language
## Models Third Edition Draft. Third. 2026.
https://web.stanford.edu/~jurafsky/slp3/ed3book_jan26.pdf
- Sugiyono. METODE PENELITIAN KUANTITATIF, KUALITATIF DAN R&D. Alfabet,
## CV.; 2013.
## 15. El Emam Khaled, Mosquera Lucy, Hoptroff Richard. Practical Synthetic Data
Generation : Balancing Privacy and the Broad Availability of Data. O’Reilly Media, Inc.;
- https://cdn.ttgtmedia.com/rms/pdf/Practical_Synthetic_Data_Generation.pdf
- Rumaisa F, Puspitarani Y, Rosita A, Zakiah A, Violina S. Penerapan Natural Language
Processing (NLP) Di Bidang Pendidikan. Jurnal Inovasi Masyarakat. 2021;1(3):232-235.
doi:https://doi.org/10.33197/jim.vol1.iss3.2021.799
- Wardhana RG, Wang G, Sibuea F. PENERAPAN MACHINE LEARNING DALAM
PREDIKSI TINGKAT KASUS PENYAKIT DI INDONESIA. Journal of Information
System Management (JOISM) e-ISSN. 2023;5(1):2715-3088.
doi:https://doi.org/10.24076/joism.2023v5i1.1136
- Pangestu A, Iswahyudi RT. PENGARUH DATA PREPROCESSING TERHADAP
PERFORMA REGRESI LINIER DALAM PREDIKSI SAHAM. ikraith-informatika.
2025;9. doi:10.37817/ikraith-informatika.v9i2
- Santoso L, Priyadi. Mengoptimalkan Proses Pembersihan Data dalam Analisis Big Data
Menggunakan Pipeline Berbasis AI. JURNAL ELEKTRONIKA DAN KOMPUTER.
2024;17(2). doi:10.51903/elkom.v17i2.2311
- Legito, Riau NP, Putro ANS, et al. Penerapan Algoritma K-Nearest Neighbor untuk
Analisis Sentimen Terhadap Isu Khilafah dan Radikalisme di Indonesia. MALCOM:
Indonesian Journal of Machine Learning and Computer Science. 2023;3(2):324-330.
doi:10.57152/malcom.v3i2.893
- Fauzi NPN, Khomsah S, Wicaksono ADP. Penerapan Feature Engineering dan
Hyperparameter Tuning untuk Meningkatkan Akurasi Model Random Forest pada
Klasifikasi Risiko Kredit. Jurnal Teknologi Informasi dan Ilmu Komputer.
2025;12(2):251-262. doi:10.25126/jtiik.2025128472


## 30

## 22. Adam A, Juliadarma M. Sistem Informasi Manajemen. Akademia Pustaka; 2024.
https://www.researchgate.net/publication/387401452_SISTEM_INFORMASI_MANAJE
## MEN
- Hasoon AN, Abdulateef SK, Abdul Ameer RS, Shuwandy ML. An Intelligent Hybrid AI
Course Recommendation Framework Integrating BERT Embeddings and Random Forest
Classification. Published online July 24, 2025. doi:10.20944/preprints202507.2027.v1
- Ayu I, Nandita W, Made I, Dwi Suarjaya A, Putu I, Bayupati A. News Recommendation
System Using Content-Based Filtering through RSS Customization Service. Journal of
Applied Informatics and Computing (JAIC). 2025;9(4):1858.
doi:https://doi.org/10.30871/jaic.v9i4.9807
## 25. Maulidya Prastita Syah, Ajeng Puspa Wardani, Mohammad Idhom, Trimono.
Perbandingan Representasi Teks Tf-Idf Dan Bert Terhadap Akurasi Cosine Similarity
Dalam Penilaian Otomatis Jawaban Berbasis Teks. Data Sciences Indonesia (DSI).
2025;5(1):47-59. doi:10.47709/dsi.v5i1.6021
- Jadon A, Patil A. A Comprehensive Survey of Evaluation Techniques for
Recommendation Systems. Published online July 2024.
doi:https://doi.org/10.13140/RG.2.2.29818.30401
- Fielding RT. Fielding_dissertation. UNIVERSITY OF CALIFORNIA, IRVINE; 2000.
https://roy.gbiv.com/pubs/dissertation/fielding_dissertation.pdf
- What is an API? redhat. June 2, 2022. https://www.redhat.com/en/topics/api/what-are-
application-programming-interfaces
## 29. Nielsen J. Usability Engineering. Academic Press, Inc.; 1993.
- Richardson L, Ruby S. RESTful Web Services. First. O’Reilly Media, Inc; 2007.
https://archive.org/details/RESTfulWebServices


