document.addEventListener("DOMContentLoaded", () => {
    const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
    const wa = "6281234567890", today = new Date(), todayString = new Date(today - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    $("#tahun").textContent = today.getFullYear(); $("#checkIn").min = todayString; $("#checkOut").min = todayString;
    const heroImages = [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=85",
        "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=2000&q=85",
    ];
    let currentSlide = 0;
    const setHeroImage = (index) => {
        currentSlide = (index + heroImages.length) % heroImages.length;
        document.querySelector(".hero").style.setProperty("--hero-image", `url("${heroImages[currentSlide]}")`);
        $$(".slider-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
            dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
        });
    };
    heroImages.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", `Tampilkan gambar ${i + 1}`);
        dot.addEventListener("click", () => setHeroImage(i));
        $("#sliderDots").append(dot);
    });
    $("#previousSlide").addEventListener("click", () => setHeroImage(currentSlide - 1));
    $("#nextSlide").addEventListener("click", () => setHeroImage(currentSlide + 1));
    setHeroImage(0);
    let slideTimer = setInterval(() => setHeroImage(currentSlide + 1), 5000);
    $(".hero-slider-controls").addEventListener("mouseenter", () => clearInterval(slideTimer));
    $(".hero-slider-controls").addEventListener("mouseleave", () => { slideTimer = setInterval(() => setHeroImage(currentSlide + 1), 5000); });
    const stays = [
        { name: "Anumana Ubud Hotel", location: "Ubud, Bali", rating: "9,1", stars: 4, reviews: 842, price: 1250000, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=700&q=80", tags: ["pool", "breakfast", "freeCancel"], label: "Pilihan favorit" },
        { name: "The Kayon Jungle Resort", location: "Payangan, Bali", rating: "9,4", stars: 5, reviews: 531, price: 2200000, image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=700&q=80", tags: ["pool", "breakfast", "freeCancel"], label: "Luar biasa" },
        { name: "Bali Bohemia Huts", location: "Nusa Penida, Bali", rating: "8,8", stars: 3, reviews: 316, price: 750000, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80", tags: ["pool", "freeCancel"], label: "Harga terbaik" },
        { name: "Maya Sanur Resort & Spa", location: "Sanur, Bali", rating: "9,0", stars: 5, reviews: 1204, price: 1850000, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=700&q=80", tags: ["pool", "breakfast"], label: "Tepi pantai" }
    ];
    let counts = { adults: 2, children: 0, rooms: 1 }, activeType = "Akomodasi";
    const rupiah = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    const updateGuests = () => { $("#adultsCount").textContent = counts.adults; $("#childrenCount").textContent = counts.children; $("#roomsCount").textContent = counts.rooms; $("#guestSummary").textContent = `${counts.adults} dewasa · ${counts.children ? `${counts.children} anak · ` : ""}${counts.rooms} kamar`; };
    function render(items) {
        const destination = $("#searchDestination").value.trim() || "Bali";
        $("#resultsTitle").textContent = activeType === "Akomodasi" ? `Tempat menginap di ${destination}` : `${activeType} di ${destination}`;
        $("#resultsMeta").textContent = `${items.length} pilihan ditemukan · ${counts.adults + counts.children} tamu · ${counts.rooms} kamar`;
        $("#resultList").innerHTML = items.length ? items.map((s) => `<article class="result-card"><img src="${s.image}" alt="${s.name}" loading="lazy"><div><span class="tag">${s.label}</span><h3>${s.name}</h3><p>⌖ ${s.location}</p><div class="hotel-stars" aria-label="Hotel bintang ${s.stars}">${"★".repeat(s.stars)}<span>${"★".repeat(5 - s.stars)}</span></div><div class="rating">★ ${s.rating} <span>· ${s.reviews} ulasan</span></div><p>✓ Pembatalan gratis · ✓ Tidak perlu kartu kredit</p></div><div class="result-price"><small>1 malam, ${counts.rooms} kamar</small><strong>${rupiah(s.price * counts.rooms)}</strong><small>termasuk pajak dan biaya</small><button class="btn btn-success btn-sm select-stay" type="button">Pilih kamar</button></div></article>`).join("") : `<div class="booking-box text-center"><h3>Belum ada hasil yang cocok</h3><p>Coba hapus beberapa filter atau pilih destinasi lain.</p></div>`;
        $$(".select-stay").forEach((b) => b.addEventListener("click", () => { $("#paketWisata").value = "Bali Highlights"; $("#kontak").scrollIntoView({ behavior: "smooth" }); }));
    }
    function filter() { const selected = $$(".filter-check:checked").map((i) => i.dataset.filter), max = +$("#priceFilter").value, sort = $("#sortHotels").value; $("#priceValue").textContent = rupiah(max); const items = stays.filter((s) => selected.every((f) => s.tags.includes(f)) && s.price <= max); if (sort === "cheapest") items.sort((a, b) => a.price - b.price); if (sort === "expensive") items.sort((a, b) => b.price - a.price); if (sort === "rating") items.sort((a, b) => Number.parseFloat(b.rating.replace(",", ".")) - Number.parseFloat(a.rating.replace(",", "."))); render(items); }
    $("#guestToggle").addEventListener("click", () => { const p = $("#guestPopover"); p.classList.toggle("open"); p.setAttribute("aria-hidden", String(!p.classList.contains("open"))); });
    $$('[data-counter]').forEach((b) => b.addEventListener("click", () => { const k = b.dataset.counter; counts[k] = Math.max(k === "adults" || k === "rooms" ? 1 : 0, counts[k] + +b.dataset.change); updateGuests(); }));
    $$(".search-tab").forEach((b) => b.addEventListener("click", () => { $$(".search-tab").forEach((x) => x.classList.remove("active")); b.classList.add("active"); activeType = b.dataset.type; }));
    $("#checkIn").addEventListener("change", () => { $("#checkOut").min = $("#checkIn").value || todayString; });
    $$(".filter-check").forEach((i) => i.addEventListener("change", filter)); $("#priceFilter").addEventListener("input", filter); $("#sortHotels").addEventListener("change", filter); $("#filterToggle").addEventListener("click", () => $("#filterPanel").classList.toggle("open"));
    const destinations = ["Ubud, Bali", "Uluwatu, Bali", "Nusa Penida, Bali", "Sanur, Bali", "Seminyak, Bali"];
    $("#searchDestination").addEventListener("input", (e) => { const matches = destinations.filter((d) => d.toLowerCase().includes(e.target.value.toLowerCase())); $("#destinationSuggestions").innerHTML = matches.map((d) => `<button class="suggestion-item" type="button">⌖ ${d}</button>`).join(""); $("#destinationSuggestions").classList.toggle("open", matches.length > 0); $$(".suggestion-item").forEach((b) => b.addEventListener("click", () => { $("#searchDestination").value = b.textContent.replace("⌖ ", ""); $("#destinationSuggestions").classList.remove("open"); })); });
    $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); if (!$("#searchForm").reportValidity()) return; $("#searchResults").classList.remove("d-none"); filter(); $("#searchResults").scrollIntoView({ behavior: "smooth" }); });
    const form = $("#bookingForm"), result = $("#hasilPesan"), packagePrices = { "Bali Escape": 450000, "Bali Highlights": 950000, "Bali Island Trip": 1650000 };
    $("#tanggal").min = todayString;
    const paymentModal = $("#paymentModal"), paymentStatus = $("#paymentStatus");
    const qrisBox = $("#qrisBox"), qrisImage = $("#qrisImage");
    const updatePaymentMethod = () => {
        const method = document.querySelector("input[name='paymentMethod']:checked").value;
        qrisBox.classList.toggle("show", method === "QRIS");
        $("#payNow").textContent = method === "QRIS" ? "Saya Sudah Membayar" : "Bayar Terlebih Dahulu";
    };
    $$('input[name="paymentMethod"]').forEach((input) => input.addEventListener("change", updatePaymentMethod));
    const closePayment = () => { paymentModal.classList.remove("open"); paymentModal.setAttribute("aria-hidden", "true"); };
    const destinationDetails = {
        "Ubud": { image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85", description: "Ubud adalah pusat seni dan budaya Bali dengan suasana tenang, sawah hijau, serta banyak pengalaman lokal yang berkesan.", longDescription: "Ubud cocok untuk wisatawan yang ingin menikmati sisi Bali yang lebih tenang dan berbudaya. Perjalanan dapat diisi dengan berjalan di antara sawah, mengunjungi galeri seni, menikmati pertunjukan tari tradisional, serta mencicipi kuliner khas Bali. Suasananya ideal untuk liburan keluarga, pasangan, maupun pencinta fotografi.", bestTime: "April–Oktober", duration: "1–2 hari", activities: ["Menjelajahi sawah terasering Tegallalang", "Mengunjungi Monkey Forest dan pura bersejarah", "Menikmati seni, kuliner, dan kerajinan khas Bali"] },
        "Uluwatu": { image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=85", description: "Uluwatu terkenal dengan tebing pantai yang dramatis, ombak yang indah, dan pemandangan matahari terbenam yang menakjubkan.", longDescription: "Uluwatu menawarkan perpaduan antara wisata alam, budaya, dan pantai. Tebing-tebing tinggi menghadap Samudra Hindia menjadi tempat terbaik untuk menikmati sunset, sementara Pura Luhur Uluwatu menghadirkan pengalaman budaya yang khas. Wisatawan juga dapat mengunjungi pantai-pantai favorit peselancar dan menikmati hidangan laut di sekitar Jimbaran.", bestTime: "Mei–September", duration: "1 hari", activities: ["Menonton tari Kecak di Pura Luhur Uluwatu", "Menikmati sunset dari atas tebing", "Bersantai di pantai dan mencoba kuliner tepi laut"] },
        "Nusa Penida": { image: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1000&q=85", description: "Nusa Penida menawarkan laut biru jernih, tebing eksotis, dan pantai-pantai tropis yang cocok untuk petualangan.", longDescription: "Nusa Penida adalah pilihan tepat bagi pencinta petualangan dan pemandangan alam. Pulau ini memiliki tebing ikonik, laguna alami, pantai tersembunyi, dan spot snorkeling dengan kehidupan laut yang beragam. Karena medan jalannya cukup menantang, sebaiknya susun rute sejak awal dan gunakan pemandu lokal agar perjalanan lebih nyaman.", bestTime: "April–Oktober", duration: "2–3 hari", activities: ["Berfoto di Kelingking Beach dan Angel’s Billabong", "Snorkeling melihat ikan dan terumbu karang", "Menjelajahi pantai, bukit, dan spot pemandangan pulau"] }
    };
    const destinationModal = $("#destinationModal");
    const closeDestination = () => { destinationModal.classList.remove("open"); destinationModal.setAttribute("aria-hidden", "true"); };
    $$(".destination-info-btn").forEach((button) => button.addEventListener("click", () => {
        const name = button.dataset.destination, detail = destinationDetails[name];
        $("#destinationTitle").textContent = name;
        $("#destinationImage").src = detail.image;
        $("#destinationImage").alt = `Pemandangan wisata ${name}`;
        $("#destinationDescription").textContent = detail.description;
        $("#destinationLongDescription").textContent = detail.longDescription;
        $("#destinationBestTime").textContent = detail.bestTime;
        $("#destinationDuration").textContent = detail.duration;
        $("#destinationActivities").innerHTML = detail.activities.map((activity) => `<li>${activity}</li>`).join("");
        destinationModal.classList.add("open");
        destinationModal.setAttribute("aria-hidden", "false");
    }));
    $("#closeDestination").addEventListener("click", closeDestination);
    $("#destinationPackage").addEventListener("click", () => { closeDestination(); $("#paket").scrollIntoView({ behavior: "smooth" }); });
    destinationModal.addEventListener("click", (e) => { if (e.target === destinationModal) closeDestination(); });
    const openPayment = () => {
        const packageName = $("#paketWisata").value;
        $("#paymentPackage").textContent = packageName;
        $("#paymentCustomer").textContent = $("#nama").value;
        $("#paymentTotal").textContent = rupiah(packagePrices[packageName] || 0);
        paymentStatus.className = "payment-status d-none";
        paymentStatus.textContent = "";
        $("#payNow").disabled = false;
        updatePaymentMethod();
        qrisImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(`BaliExplore|${packageName}|${packagePrices[packageName] || 0}`)}`;
        paymentModal.classList.add("open");
        paymentModal.setAttribute("aria-hidden", "false");
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); if (!form.reportValidity()) return; openPayment(); });
    $("#closePayment").addEventListener("click", closePayment);
    paymentModal.addEventListener("click", (e) => { if (e.target === paymentModal) closePayment(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (paymentModal.classList.contains("open")) closePayment(); if (destinationModal.classList.contains("open")) closeDestination(); } });
    $("#payNow").addEventListener("click", () => {
        const packageName = $("#paketWisata").value;
        const method = document.querySelector("input[name='paymentMethod']:checked").value;
        const date = new Date(`${$("#tanggal").value}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        paymentStatus.className = "payment-status processing";
        paymentStatus.textContent = `Memproses pembayaran melalui ${method}...`;
        $("#payNow").disabled = true;
        const text = encodeURIComponent(`Halo BaliExplore, pembayaran pesanan saya sudah diproses.\n\nNama: ${$("#nama").value}\nEmail: ${$("#email").value}\nPaket: ${packageName}\nTanggal perjalanan: ${date}\nMetode pembayaran: ${method}`);
        setTimeout(() => {
            paymentStatus.className = "payment-status success";
            paymentStatus.textContent = `Pembayaran berhasil melalui ${method}. Anda akan diarahkan ke WhatsApp admin.`;
            result.className = "alert alert-success mt-3";
            result.textContent = "Pembayaran berhasil. Chat WhatsApp admin dibuka untuk konfirmasi pesanan.";
            setTimeout(() => window.open(`https://wa.me/+6288214618651?text=${text}`, "_blank", "noopener,noreferrer"), 700);
        }, 1500);
    });
    $$(".book-btn").forEach((b) => b.addEventListener("click", () => { $("#paketWisata").value = b.dataset.package; $("#kontak").scrollIntoView({ behavior: "smooth" }); }));
});
