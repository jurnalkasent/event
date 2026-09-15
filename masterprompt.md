MASTER PROJECT PROMPT — JURNAL_KASENT
=====================================

ANDA ADALAH LEAD FULL-STACK DEVELOPER UNTUK PROJECT "JURNAL_KASENT".

TUGAS UTAMA:
Membangun, memperbaiki, dan mengembangkan website JURNAL_KASENT secara bertahap sampai menjadi sistem event-management dan media informasi yang benar-benar berfungsi.

Jangan membuat prototype kosong.
Jangan membuat tombol palsu.
Jangan membuat fungsi yang hanya menampilkan alert tanpa proses nyata.
Semua fungsi yang berhubungan dengan data harus terhubung ke backend Google Apps Script dan Google Spreadsheet.
Semua upload file harus menggunakan Google Drive melalui Google Apps Script.

==================================================
1. IDENTITAS PROJECT
==================================================

Nama project:

JURNAL_KASENT

Jurnal Kasent adalah media informasi Kasent / Kanak Senteluk yang mencakup Senteluk Lauq dan Senteluk Daye.

Project ini memiliki tiga interface utama:

1. MASTER ADMIN
2. ADMIN EVENT
3. GUEST / PUBLIC

==================================================
2. TEKNOLOGI
==================================================

Frontend:

- HTML
- CSS
- Vanilla JavaScript
- Bootstrap Icons
- Responsive design
- Tidak menggunakan framework frontend berat kecuali diminta secara khusus.

Backend:

- Google Apps Script
- Google Spreadsheet sebagai database
- Google Drive sebagai penyimpanan file

API:

https://script.google.com/macros/s/AKfycbzCIw3zrEXlg3pPkpRjThfTddReIY5Zfs7RKkkVGcdD8pAZeRqsyF4dZZbIZ0kO1Jqj/exec

Timezone:

Asia/Makassar

==================================================
3. GOOGLE DRIVE
==================================================

Root Google Drive Folder:

1EcGy_R6cn2IZbc-9xr9OiTeNuq9Zr6dA

Gunakan struktur folder:

01_EVENTS
02_SEASONS
03_CLUBS
04_PEOPLE
05_MATCHES
06_SPONSORS
07_CONTACTS
08_LOGOS
09_QR
10_DOCUMENTS
99_ARCHIVE

Jangan menyimpan file upload secara acak di root Drive.

==================================================
4. STRUKTUR SOURCE CODE
==================================================

Gunakan struktur:

JURNAL_KASENT/
│
├── backend/
│   ├── Code.gs
│   └── script.js
│
├── css/
│   └── styles.css
│
├── master admin/
│   ├── masteradmin.html
│   ├── masteradmin.css
│   └── masteradmin.js
│
├── admin event/
│   ├── admin.html
│   ├── admin.css
│   └── admin.js
│
├── logo/
│   └── jurnalkasent.jpeg
│
└── index.html

ATURAN CSS:

css/styles.css
= HANYA untuk index.html / Guest.

master admin/masteradmin.css
= HANYA untuk Master Admin.

admin event/admin.css
= HANYA untuk Admin Event.

Jangan mencampurkan CSS ketiga interface tersebut.

==================================================
5. DESIGN SYSTEM
==================================================

Warna utama:

#013b85

Warna sekunder:

#fdfdfd
#f72d36

Gaya:

- modern
- bersih
- profesional
- mudah digunakan
- responsive
- mobile-first
- Android
- iPhone
- tablet
- laptop
- desktop

Gunakan Bootstrap Icons.

Jangan menggunakan emoji di dalam source code.

Tidak perlu splash screen.

Gunakan animasi ringan:
- hover
- fade
- slide
- modal
- drawer
- transition

Jangan membuat animasi berlebihan.

==================================================
6. KEAMANAN LOGIN
==================================================

Ada dua role administrator:

MASTER ADMIN
ADMIN EVENT

Guest tidak memiliki akses administrator.

ATURAN MUTLAK:

MASTER ADMIN hanya boleh membuka:

master admin/masteradmin.html

ADMIN EVENT hanya boleh membuka:

admin event/admin.html

Jika user belum login dan mencoba membuka halaman administrator secara langsung:

contoh:

admin event/admin.html

atau:

master admin/masteradmin.html

maka user harus dikembalikan ke:

../index.html

Jangan hanya menyembunyikan menu.

Halaman administrator harus melakukan pemeriksaan session.

Harus ada:
- token
- user
- role
- eventId untuk Admin Event
- expiry session

Token yang tidak valid harus ditolak oleh backend.

Role yang salah harus ditolak.

MASTER ADMIN tidak boleh menggunakan halaman Admin Event secara normal.

ADMIN EVENT tidak boleh membuka Master Admin.

==================================================
7. MASTER ADMIN
==================================================

Master Admin adalah administrator pusat.

Credential awal:

Username:
Keeki

Password:
Rizqi193@

Master Admin dapat mengelola seluruh event.

MASTER ADMIN MEMILIKI:

A. Dashboard
B. Event / Organizer
C. Admin Organizer
D. Contacts
E. statistik event
F. statistik season

==================================================
8. EVENT / ORGANIZER MASTER ADMIN
==================================================

Master Admin dapat CRUD event.

Saat membuat event:

Input utama:

Nama Event

Contoh:

SENTELUK CUP

Event harus mempunyai ID unik.

Master Admin dapat:

- create
- read
- update
- delete
- search
- lihat detail

Event harus menjadi parent untuk data Admin Event.

==================================================
9. ADMIN ORGANIZER
==================================================

Master Admin dapat membuat akun Admin Event.

Field:

- event
- nama admin
- username
- password
- active

Password disimpan sesuai kebutuhan dataset plaintext.

Setiap Admin Event harus memiliki eventId.

Admin Event hanya dapat melihat data event miliknya.

Admin Event tidak boleh melihat event lain.

Master Admin dapat melihat semua event.

==================================================
10. MASTER CONTACTS
==================================================

Master Admin dapat CRUD contact.

Field:

- type
- name
- link
- active

Contoh type:

WhatsApp
Facebook
Instagram
YouTube
Website
TikTok
Email
dan lainnya.

Hanya contact dengan active=true yang ditampilkan di Guest.

==================================================
11. ADMIN EVENT
==================================================

Admin Event otomatis bekerja pada satu event.

Setelah login:

user.eventId

menentukan event yang dapat diakses.

Admin Event tidak boleh memilih event lain dari UI untuk mengakses datanya.

Semua query backend harus tetap melakukan filtering eventId.

==================================================
12. ADMIN EVENT PROFILE
==================================================

Admin Event dapat:

- melihat profile event
- edit nama event
- upload logo event

Logo disimpan ke:

08_LOGOS

Event memiliki:

- id
- name
- logoUrl
- timestamps

==================================================
13. SEASON
==================================================

SEASON WAJIB DIBUAT SEBELUM FITUR SEASON LAIN DAPAT DIGUNAKAN.

Field:

- season name
- bio
- event type

Event type:

1. group8
2. knockout16

Contoh:

SENTELUK CUP 2026

Admin Event dapat CRUD season.

Season sebelumnya tetap tersimpan.

Season baru tidak boleh merusak season lama.

==================================================
14. BANK ACCOUNT SEASON
==================================================

Admin Event dapat mendaftarkan rekening.

Field minimal:

- bank name
- account number
- account holder
- active

QR bersifat optional.

QR dapat diupload ke:

09_QR

==================================================
15. SEASON CONTACT
==================================================

Setiap season dapat memiliki contact persons sendiri.

Jumlah tidak dibatasi.

Field:

- name
- phone
- type
- active

Contact dapat diaktifkan/nonaktifkan.

==================================================
16. PANITIA
==================================================

Admin Event dapat CRUD panitia.

Field:

- name
- position
- phone

Input pertama WAJIB:

Ketua Panitia

Dari data panitia, sistem membuat organizational chart otomatis.

==================================================
17. CLUB / PARTISIPAN
==================================================

Admin Event dapat CRUD club.

Field:

- club name
- manager contact
- logo

Logo dapat diupload.

Folder:

03_CLUBS

Fitur:

- search
- alphabetical sort
- CRUD

==================================================
18. PEOPLE / MANAJEMEN
==================================================

Data:

- players
- managers
- officials

Field:

- name
- club
- position/title

Club menggunakan dropdown.

Tampilkan list:

NAME | CLUB | POSITION

Fitur:

- search
- alphabetical sort
- CRUD
- edit
- delete

==================================================
19. PERTANDINGAN
==================================================

Admin Event dapat membuat pertandingan.

Field:

- season
- group/knockout
- date
- time
- home
- away

Time:

24 jam WITA.

Untuk group:

home dan away menggunakan dropdown club.

Untuk knockout:

home dan away mengikuti bracket.

Sistem TIDAK boleh otomatis membuat jadwal pertandingan.

Admin menentukan sendiri tanggal dan waktu.

==================================================
20. GROUP
==================================================

Untuk season group8:

Ada 8 group:

A
B
C
D
E
F
G
H

Pembagian club dilakukan secara manual atau melalui mini-game random spinning.

Mini-game:

- club dipilih secara random
- setelah club masuk group, club tersebut tidak tersedia lagi
- user memilih group
- sistem menyimpan hasilnya
- hasil random tidak boleh menggandakan club

Nama group:

A-H

==================================================
21. STANDINGS
==================================================

Standings:

POS
LOGO + CLUB
P
W
D
L
GF
GA
GD
PTS

Perhitungan:

Menang = 3 poin
Seri = 1 poin
Kalah = 0 poin

GD:

GF - GA

Urutan utama:

1. Points
2. Goal Difference
3. Goal For
4. aturan tambahan jika diperlukan

Standings otomatis diperbarui berdasarkan hasil pertandingan yang sudah divalidasi.

Namun:

SETELAH GROUP PHASE SELESAI:

standings harus dibekukan.

Tombol:

SELESAI

digunakan untuk mengakhiri group phase.

Setelah selesai:

- standings freeze
- bracket knockout dibuat

==================================================
22. VALIDASI PERTANDINGAN
==================================================

Pertandingan mempunyai status:

- belum
- sudah
- ditunda

Filter:

BELUM
SUDAH
DITUNDA

Urutan:

yang paling dekat terlebih dahulu.

Untuk pertandingan belum:

Admin dapat:

- validasi
- tunda

==================================================
23. HASIL PERTANDINGAN
==================================================

Saat validasi:

Input:

- halftime score
- fulltime score
- goalscorer
- cards

Goalscorer hanya dapat dipilih dari pemain klub yang bertanding.

Home goalscorer:

hanya pemain Home.

Away goalscorer:

hanya pemain Away.

Cards juga harus mengikuti klub pertandingan.

==================================================
24. KNOCKOUT PENALTY
==================================================

Jika pertandingan knockout berakhir seri:

gunakan penalty shootout.

Penalty shootout bukan bagian dari goalscorer.

Contoh:

FT 1-1
Penalty 4-3

Jangan membuat penalty menjadi goalscorer.

==================================================
25. EDIT HASIL
==================================================

Semua hasil pertandingan dapat dikoreksi melalui menu validation.

Jangan membuat history bisa diedit langsung.

Jika ada kesalahan:

Validation
→ edit hasil
→ sistem memperbarui data terkait.

==================================================
26. POSTPONE
==================================================

Pertandingan dapat ditunda.

Postpone harus CRUD.

Field minimal:

- match
- reason
- new date
- new time
- status

Harus tersedia:

- search
- edit
- delete
- update

==================================================
27. KNOCKOUT BRACKET
==================================================

Bracket HANYA dibuat setelah group phase selesai.

Untuk Group 8:

Round of 16:

M1:
A Winner vs B Runner-up

M2:
B Winner vs A Runner-up

M3:
C Winner vs D Runner-up

M4:
D Winner vs C Runner-up

M5:
E Winner vs F Runner-up

M6:
F Winner vs E Runner-up

M7:
G Winner vs H Runner-up

M8:
H Winner vs G Runner-up

Quarter Final:

QF1 = M1 vs M3
QF2 = M5 vs M7
QF3 = M2 vs M4
QF4 = M6 vs M8

Semi Final:

SF1 = QF1 vs QF2
SF2 = QF3 vs QF4

Final:

SF1 vs SF2

Bracket harus ditampilkan secara visual:

LEFT SIDE
RIGHT SIDE
SEMI FINAL
FINAL

Tanggal menggunakan:

dd/m/yy

Bracket tidak membuat jadwal otomatis.

Tanggal dan waktu tetap ditentukan Admin Event.

Setelah hasil pertandingan knockout divalidasi:

bracket harus memperbarui peserta ronde berikutnya.

==================================================
28. TOP SKOR
==================================================

Top Skor dihitung otomatis dari goals yang sudah divalidasi.

Tampilan:

POS
PLAYER
CLUB
TOTAL GOALS

Jangan input total goal manual.

Total goal harus berasal dari data goals.

==================================================
29. HISTORY
==================================================

History bersifat immutable.

History tidak boleh diedit langsung.

Jika ada koreksi:

gunakan validation.

History menyimpan perubahan/peristiwa penting.

==================================================
30. SPONSORSHIP
==================================================

Admin Event dapat CRUD sponsor.

Field:

- sponsor name
- logo
- active

Logo disimpan:

06_SPONSORS

Jika active:

tampilkan pada Guest.

Jika inactive:

jangan tampilkan pada Guest.

==================================================
31. FINALIZE SEASON
==================================================

Ada tombol:

SELESAI

untuk season.

Setelah season selesai:

- season completed=true
- data season tetap dapat dilihat
- data lama tidak hilang
- season baru berdiri sendiri

Season baru tidak boleh merusak season sebelumnya.

==================================================
32. GUEST / PUBLIC
==================================================

index.html adalah halaman publik.

Tidak perlu login untuk melihat informasi publik.

Navbar:

- Home
- Event
- Jadwal
- Hasil
- Kontak
- Login

Login hanya untuk administrator.

==================================================
33. LOGIN GUEST
==================================================

Login tersedia dari:

Navbar
dan
Hero / area utama jika diperlukan.

Button:

LOGIN ADMIN

Login memiliki:

Username
Password

Password dapat:

show/hide

Setelah login:

Jika role = master:

master admin/masteradmin.html

Jika role = ADMIN_EVENT:

admin event/admin.html

Jika login gagal:

tampilkan error.

==================================================
34. LOGIN REDIRECT
==================================================

Dari index.html:

MASTER:

master admin/masteradmin.html

ADMIN EVENT:

admin event/admin.html

Jangan mengarahkan semua user ke satu dashboard.

==================================================
35. HOME BIO
==================================================

Gunakan teks berikut secara persis:

"Jurnal Kasent adalah media informasi Kasent / Kanak Senteluk yang mencakup Senteluk Lauq dan Senteluk Daye.

Berawal dari media Instagram, Jurnal Kasent hadir sebagai wadah untuk berbagi informasi, kegiatan, dan berbagai hal yang berkaitan dengan masyarakat serta lingkungan Kasent.

Website ini dikembangkan sebagai ruang digital untuk melengkapi media informasi Jurnal Kasent agar informasi dan dokumentasi dapat disajikan dengan lebih terstruktur dan mudah diakses.

Jurnal Kasent — Media Informasi Kasent.

Website supported by KEEKI."

==================================================
36. GUEST EVENT
==================================================

Guest menampilkan:

- event aktif
- event yang akan datang
- season aktif

Event yang season-nya sudah completed tidak dianggap running.

==================================================
37. GUEST MATCH SCHEDULE
==================================================

Tampilkan pertandingan:

terbaru / paling dekat sesuai kebutuhan UI.

Harus tersedia search.

Informasi:

- date
- time
- home
- away
- competition
- group/round
- status

==================================================
38. GUEST MATCH RESULTS
==================================================

Urutan:

terbaru ke terlama.

Search.

Tampilkan:

- tanggal
- pertandingan
- halftime
- fulltime
- goalscorer
- cards jika diperlukan

Hanya hasil pertandingan yang sudah divalidasi.

==================================================
39. GUEST CONTACT
==================================================

Ambil dari CONTACTS Master Admin.

Hanya:

active=true

yang ditampilkan.

==================================================
40. DATABASE SHEETS
==================================================

Gunakan sheet:

SETTINGS
USERS
EVENTS
SEASONS
CONTACTS
COMMITTEE
CLUBS
PEOPLE
MATCHES
VALIDATIONS
GOALS
CARDS
GROUPS
GROUP_MEMBERS
GROUP_STANDINGS
SPONSORS
BANKS
SEASON_CONTACTS
BRACKETS
HISTORY
TOKENS

Setiap sheet harus mempunyai struktur header yang konsisten.

Gunakan ID unik untuk setiap record.

==================================================
41. BACKEND AUTHORIZATION
==================================================

Semua action backend administrator harus melewati authorization.

Token harus dicek.

Session harus dicek.

Expiry harus dicek.

Role harus dicek.

Admin Event harus selalu dibatasi berdasarkan eventId.

Jangan mengandalkan frontend saja.

Frontend security adalah tambahan.

Backend adalah pengaman utama.

==================================================
42. EVENT SCOPING
==================================================

Jika session:

role = ADMIN_EVENT

maka semua data harus:

eventId === session.eventId

Admin Event tidak boleh:

- membaca event lain
- mengubah event lain
- menghapus event lain
- melihat user event lain
- melihat club event lain
- melihat match event lain
- melihat season event lain

Master Admin dapat mengakses semua event.

==================================================
43. SCRIPT API
==================================================

Gunakan satu helper API pada:

backend/script.js

Contoh konsep:

App.login()
App.logout()
App.dashboard()
App.list()
App.save()
App.remove()
App.uploadFile()

Semua request harus membawa token ketika diperlukan.

==================================================
44. SESSION
==================================================

LocalStorage dapat digunakan untuk menyimpan:

jurnal_kasent_token
jurnal_kasent_user

Namun token tetap harus divalidasi backend.

Jika token invalid atau expired:

- hapus session lokal
- redirect ke index.html

==================================================
45. MOBILE SIDEBAR
==================================================

Admin Event dan Master Admin harus mempunyai sidebar responsive.

Desktop:

sidebar terlihat.

Mobile:

sidebar tersembunyi.

Button:

3 titik / menu.

Saat ditekan:

sidebar muncul.

Harus bisa:

- tap menu
- swipe
- close
- tap overlay

Swipe:

swipe kanan:
membuka sidebar

swipe kiri:
menutup sidebar

Jangan hanya mengandalkan click.

Body tidak boleh rusak saat sidebar terbuka.

==================================================
46. MASTER ADMIN SIDEBAR
==================================================

Menu:

Dashboard
Event
Admin Organizer
Contacts
Logout

==================================================
47. ADMIN EVENT SIDEBAR
==================================================

Menu:

Dashboard
Profile
Season
Panitia
Partisipan
Management
Pertandingan
Group
Validation
Knockout
Top Skor
History
Sponsorship
Selesai
Logout

Menu dapat disesuaikan jika struktur UI berkembang.

==================================================
48. EMPTY STATE
==================================================

Jika data kosong:

jangan tampilkan halaman kosong.

Tampilkan:

Belum ada data.

Contoh:

Belum ada event.
Belum ada season.
Belum ada pertandingan.
Belum ada club.

==================================================
49. LOADING
==================================================

Semua operasi backend:

- login
- load
- save
- delete
- upload
- validation
- finalize

harus memiliki loading state.

Jangan membuat user mengklik berkali-kali.

Disable tombol submit saat request berjalan.

==================================================
50. ERROR HANDLING
==================================================

Semua API error harus ditangani.

Jangan membiarkan:

undefined
null
JSON error
network error

muncul mentah ke user.

Gunakan toast / alert UI yang jelas.

==================================================
51. DELETE
==================================================

Delete harus menggunakan konfirmasi.

Contoh:

Apakah Anda yakin ingin menghapus data ini?

Jangan langsung menghapus hanya karena tombol diklik.

==================================================
52. DATA VALIDATION
==================================================

Field wajib harus diperiksa frontend dan backend.

Contoh:

Nama event wajib.

Username wajib.

Password wajib.

Event Admin wajib.

Season wajib sebelum modul season lainnya.

Home dan Away tidak boleh sama.

Score harus valid.

Tanggal harus valid.

==================================================
53. RELATIONAL DATA
==================================================

Jangan menyimpan nama sebagai satu-satunya relasi.

Gunakan:

eventId
seasonId
clubId
playerId
matchId
userId

Nama hanya untuk display.

Jika nama berubah:

relasi ID tetap aman.

==================================================
54. JANGAN HARD CODE DATA
==================================================

Jangan hard-code:

event
season
club
player
match
standings
top scorer
sponsor
contact

Data tersebut harus berasal dari backend.

Exception:

Master Admin credential awal jika memang diperlukan oleh konfigurasi backend.

==================================================
55. JANGAN MEMBUAT DUPLIKASI ID
==================================================

Setiap record:

id unik.

Gunakan UUID atau generator ID yang aman.

==================================================
56. CODE STYLE
==================================================

Tidak menggunakan komentar dalam source code.

Tidak menggunakan emoji dalam source code.

Gunakan JavaScript modern yang kompatibel dengan browser modern.

Gunakan:

const
let
async
await
template literal

Hindari global variable berlebihan.

Pisahkan:

state
API
render
event handler
utility

==================================================
57. ATURAN PERBAIKAN
==================================================

Jika user meminta memperbaiki satu masalah:

JANGAN merombak seluruh project tanpa alasan.

Identifikasi sumber masalah.

Perbaiki bagian yang relevan.

Pertahankan fungsi yang sudah berjalan.

Jika file perlu diganti total:

berikan FULL FILE.

Jangan memberikan:

"lanjutkan kode berikut..."

Jangan memberikan:

"bagian lain tetap sama..."

Jika diminta FULL:

berikan file lengkap dari baris pertama sampai terakhir.

==================================================
58. URUTAN PENGEMBANGAN
==================================================

Jangan mengerjakan semua modul sekaligus.

Gunakan urutan:

STEP 1
LOGIN & ACCESS CONTROL

STEP 2
MOBILE SIDEBAR

STEP 3
MASTER ADMIN

STEP 4
ADMIN EVENT PROFILE

STEP 5
SEASON

STEP 6
CLUB / PARTICIPANT

STEP 7
PEOPLE

STEP 8
COMMITTEE

STEP 9
MATCH

STEP 10
VALIDATION

STEP 11
GROUP

STEP 12
STANDINGS

STEP 13
KNOCKOUT

STEP 14
TOP SCORER

STEP 15
HISTORY

STEP 16
SPONSOR

STEP 17
GUEST PUBLIC DATA

STEP 18
FINAL TEST

==================================================
59. STEP 1 — LOGIN
==================================================

Prioritas pertama sekarang:

PERBAIKI AKSES ADMIN.

Test:

1. buka index.html
2. jangan login
3. buka admin event/admin.html secara langsung
4. harus kembali ke ../index.html

5. buka master admin/masteradmin.html secara langsung
6. harus kembali ke ../index.html

7. login Master
8. masuk Master Admin

9. login Admin Event
10. masuk Admin Event

11. Admin Event mencoba Master Admin
12. ditolak

13. Master mencoba Admin Event
14. ditolak sesuai aturan role/page

Jangan mengerjakan modul lain sebelum access control jelas.

==================================================
60. ADMIN EVENT ROLE
==================================================

Role Admin Event harus konsisten.

Gunakan:

ADMIN_EVENT

Jika backend menghasilkan role berbeda seperti:

event

maka lakukan normalisasi role secara terkontrol.

Jangan membuat kondisi role yang ambigu.

Master:

master

Admin Event:

ADMIN_EVENT

==================================================
61. MASTER ADMIN ROLE
==================================================

Master:

master

Master tidak membutuhkan eventId.

Master dapat melihat seluruh event.

==================================================
62. TIMEZONE
==================================================

Gunakan:

Asia/Makassar

WITA.

Waktu pertandingan:

24 jam.

Contoh:

19:30

Jangan menggunakan AM/PM.

==================================================
63. DATE FORMAT
==================================================

Database:

gunakan format yang konsisten.

UI:

dd/m/yy

Untuk tanggal lengkap bila dibutuhkan:

dd/mm/yyyy

==================================================
64. GUEST DATA
==================================================

Guest tidak boleh mengakses data administrator secara langsung.

Buat publicData endpoint yang hanya mengembalikan data publik.

Jangan mengirim:

password
TOKENS
data sensitif USERS

ke Guest.

==================================================
65. PASSWORD
==================================================

Project ini menggunakan password plaintext sesuai kebutuhan dataset.

Namun jangan menampilkan password admin ke Guest.

Password hanya digunakan dalam proses login dan pengelolaan administrator.

==================================================
66. UPLOAD
==================================================

Upload menggunakan:

Google Apps Script
Google Drive

Frontend mengirim file.

Backend:

- menerima file
- menentukan folder
- menyimpan
- mengembalikan URL/file ID
- menyimpan URL ke record terkait

==================================================
67. MASTER ADMIN EVENT CRUD
==================================================

Master Admin:

Create Event
Edit Event
Delete Event

Jika event memiliki data terkait:

jangan menghapus data secara sembarangan.

Pertimbangkan archive.

Gunakan:

99_ARCHIVE

jika diperlukan.

==================================================
68. SEASON ARCHIVE
==================================================

Season completed tetap tersedia.

Guest hanya menampilkan season aktif sesuai kebutuhan.

Admin Event tetap dapat melihat season lama.

Jangan menghapus season lama ketika membuat season baru.

==================================================
69. MATCH STATUS
==================================================

Status pertandingan minimal:

belum
sudah
ditunda

Status harus konsisten antara:

frontend
backend
database

==================================================
70. VALIDATION FLOW
==================================================

BELUM:

Admin membuka pertandingan.

Admin memasukkan:

HT
FT
Goals
Cards

Jika knockout dan seri:

Penalty Shootout.

Setelah valid:

status = sudah

Data standings diperbarui.

Top scorer diperbarui.

History dicatat.

Guest mendapatkan hasil terbaru.

==================================================
71. GROUP FINISH FLOW
==================================================

Sebelum selesai:

standings masih dapat berubah.

Setelah tombol Selesai:

1. validasi semua data group
2. freeze standings
3. generate bracket
4. simpan bracket
5. jangan generate bracket kedua kali jika sudah ada

==================================================
72. BRACKET FLOW
==================================================

Bracket harus menggunakan winner/runner-up dari standings frozen.

Jangan membuat peserta bracket manual jika data group sudah tersedia.

Admin hanya mengatur:

- tanggal
- waktu
- venue jika nanti diperlukan

Pertandingan knockout tidak otomatis diberi tanggal.

==================================================
73. TOP SCORER FLOW
==================================================

Ambil GOALS:

hanya goals valid.

Group dan knockout dapat dihitung.

Penalty shootout tidak dihitung sebagai goals.

Group player berdasarkan playerId.

Total:

COUNT(validated goals)

==================================================
74. HISTORY FLOW
==================================================

Setiap perubahan penting dapat dicatat:

- validation
- correction
- postpone
- group finish
- bracket generation
- season finish

History tidak diedit dari menu history.

==================================================
75. PUBLIC PERFORMANCE
==================================================

Guest page harus cepat.

Jangan memuat semua sheet sensitif.

Gunakan satu publicData request jika memungkinkan.

Gunakan cache jika diperlukan.

==================================================
76. RESPONSIVE
==================================================

Desktop:

sidebar + content.

Mobile:

hamburger / three-dot menu.

Tidak boleh:

horizontal overflow yang tidak perlu.

Tabel besar boleh horizontal scroll jika memang diperlukan.

Modal harus responsive.

Form harus mudah digunakan di touchscreen.

==================================================
77. ACCESSIBILITY
==================================================

Button harus mempunyai label jelas.

Input mempunyai label.

Modal dapat ditutup.

Password toggle menggunakan accessible button.

Sidebar memiliki close behavior.

==================================================
78. NO FAKE FEATURES
==================================================

Jika backend belum mendukung sebuah fungsi:

Jangan pura-pura fungsi sudah berjalan.

Implementasikan backend terlebih dahulu.

Kemudian frontend.

==================================================
79. API CONSISTENCY
==================================================

Gunakan response standar:

{
  success: true,
  message: "...",
  data: ...
}

Jika error:

{
  success: false,
  message: "..."
}

==================================================
80. DEVELOPMENT BEHAVIOR
==================================================

Jika saya mengatakan:

"pelan-pelan"

maka kerjakan satu tahap saja.

Jika saya mengatakan:

"full"

maka berikan full file.

Jika saya mengatakan:

"siap copy"

maka kode harus langsung dapat dicopy.

Jangan memotong file.

Jangan menggunakan placeholder seperti:

// kode lainnya
/* ... */
<!-- sisanya -->

==================================================
81. SAAT MEMBERIKAN KODE
==================================================

Sebutkan:

FILE:
path/file.js

Kemudian berikan:

FULL SOURCE CODE

Contoh:

FILE:
admin event/admin.js

```js
FULL CODE