/**
 * ====================================================================
 * UNDANGAN DIGITAL BALI - MAIN JAVASCRIPT
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Data dari Konfigurasi
    const config = window.UNDANGAN_CONFIG || {};

    // 2. Baca Parameter Nama Tamu dan Tanggal Khusus dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('untuk') || urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
    const guestName = guestParam ? decodeURIComponent(guestParam).trim() : (window.DEFAULT_GUEST_NAME || 'Tamu Undangan');

    // 2.1 Cek apakah Undangan Khusus Tanggal 15 (Kamis, 15 Oktober 2026)
    // Berlaku otomatis untuk tamu "Adat Ngampel", parameter tgl=15, atau window.IS_TGL_15
    const isTgl15 = urlParams.get('tgl') === '15' || 
                    guestName.toLowerCase().includes('ngampel') || 
                    window.IS_TGL_15 === true;

    if (isTgl15) {
        config.acara = config.acara || {};
        config.acara.hariTanggalTeks = 'Kamis, 15 Oktober 2026';
        config.acara.tanggalAcara = '2026-10-15T13:00:00+08:00';
    }

    // Set nama tamu pada cover modal dan RSVP form
    const modalGuestNameEl = document.getElementById('modalGuestName');
    const rsvpNamaEl = document.getElementById('rsvpNama');

    if (modalGuestNameEl) {
        modalGuestNameEl.textContent = guestName;
    }
    if (rsvpNamaEl && (guestParam || window.DEFAULT_GUEST_NAME)) {
        rsvpNamaEl.value = guestName;
    }

    // 3. Render Konten Dinamis dari Config
    renderDynamicContent(config);

    // 4. Audio Controller
    const audio = document.getElementById('bgMusic');
    const audioBtn = document.getElementById('floatingAudioBtn');
    let isPlaying = false;

    if (audio) {
        audio.src = config.musik?.src || 'assets/audio/undangan digital jikogik.wav';
        audio.loop = true;
    }

    function toggleMusic() {
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => {
                isPlaying = true;
                if (audioBtn) {
                    audioBtn.classList.add('playing');
                    audioBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
                }
            }).catch(e => console.log('Audio autoplay prevented:', e));
        } else {
            audio.pause();
            isPlaying = false;
            if (audioBtn) {
                audioBtn.classList.remove('playing');
                audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        }
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', toggleMusic);
    }

    // 5. Buka Undangan (Cover Modal Unlock)
    const btnOpen = document.getElementById('btnOpenInvitation');
    const coverModal = document.getElementById('coverModal');

    if (btnOpen && coverModal) {
        btnOpen.addEventListener('click', () => {
            coverModal.classList.add('hide-modal');
            document.body.classList.remove('modal-open');

            // Autoplay music
            if (config.musik?.autoPlayOnOpen !== false && audio) {
                audio.play().then(() => {
                    isPlaying = true;
                    if (audioBtn) {
                        audioBtn.classList.add('playing');
                        audioBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
                    }
                }).catch(e => console.log('Audio play error:', e));
            }

            // Trigger AOS animations if loaded
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 300);
            }
        });
    }

    // 6. Live Countdown Timer
    initCountdown(config.acara?.tanggalAcara || '2026-10-16T13:00:00+08:00');

    // 7. Galeri Slider Carousel
    initGallerySlider();

    // 8. Lightbox Galeri
    initLightbox();

    // 9. Pemutar Video Momen
    initVideoSection(config, audio, audioBtn);

    // 10. Buku Tamu & RSVP System (Google Sheets + LocalStorage Fallback)
    initRSVPSystem(config);

    // 9. Inisialisasi AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
});

/**
 * Render Konten Dinamis dari config.js
 */
function renderDynamicContent(config) {
    if (!config || !config.acara) return;

    // Render Cover Foto (Modal)
    if (config.coverFoto) {
        const coverImg = document.querySelector('#coverModal .frame-img');
        if (coverImg) coverImg.src = config.coverFoto;
    }

    // Render Hero Background
    const heroBg = config.heroBackgroundFoto || config.coverFoto;
    if (heroBg) {
        const heroHeader = document.querySelector('header.hero-header');
        if (heroHeader) {
            heroHeader.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.38)), url('${heroBg}')`;
        }
    }

    // Render Detail Acara
    if (config.acara) {
        const elTgl = document.getElementById('acaraTanggal');
        if (elTgl && config.acara.hariTanggalTeks) elTgl.textContent = config.acara.hariTanggalTeks;

        const heroDate = document.getElementById('heroDate') || document.querySelector('.hero-date');
        if (heroDate && config.acara.hariTanggalTeks) heroDate.textContent = config.acara.hariTanggalTeks;

        const elWaktu = document.getElementById('acaraWaktu');
        if (elWaktu && config.acara.waktuTeks) elWaktu.textContent = config.acara.waktuTeks;

        const elTempat = document.getElementById('acaraTempat');
        if (elTempat && config.acara.tempat) elTempat.textContent = config.acara.tempat;

        const btnMaps = document.getElementById('btnGoogleMaps');
        if (btnMaps && config.acara.mapsUrl) btnMaps.href = config.acara.mapsUrl;
    }

    // Render Peserta (Mendukung Group Pawiwahan & Mepandes)
    const pesertaContainer = document.getElementById('pesertaContainer');
    if (pesertaContainer) {
        if (config.pesertaGroups && config.pesertaGroups.length > 0) {
            pesertaContainer.innerHTML = config.pesertaGroups.map((group, gIdx) => `
                <div class="peserta-group-section" data-aos="fade-up" data-aos-delay="${gIdx * 120}">
                    ${gIdx > 0 ? `
                        <div class="peserta-category-divider">
                            <img src="assets/images/ornaments/ornament-leaf2.png" alt="Ornamen" style="max-height: 24px; opacity: 0.85;">
                        </div>
                    ` : ''}
                    <div class="peserta-category-header">
                        <h3 class="peserta-category-title">${group.kategori}</h3>
                    </div>
                    <div class="peserta-wrapper">
                        ${group.peserta.map((p, idx) => `
                            <div class="peserta-card" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
                                <div class="peserta-foto-box">
                                    <img src="assets/images/ornaments/daun-1.png" alt="Daun" class="leaf-top-right">
                                    <div class="peserta-img-container">
                                        <img src="${p.foto}" alt="${p.nama}" class="peserta-img">
                                    </div>
                                    <img src="assets/images/ornaments/daun-2.png" alt="Daun" class="leaf-bottom-left">
                                </div>
                                <h3 class="peserta-name">${p.nama}</h3>
                                <p class="peserta-info">${p.keterangan}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } else if (config.peserta && config.peserta.length > 0) {
            pesertaContainer.innerHTML = `
                <div class="peserta-wrapper">
                    ${config.peserta.map((p, idx) => `
                        <div class="peserta-card" data-aos="fade-up" data-aos-delay="${idx * 100}">
                            <div class="peserta-foto-box">
                                <img src="assets/images/ornaments/daun-1.png" alt="Daun" class="leaf-top-right">
                                <div class="peserta-img-container">
                                    <img src="${p.foto}" alt="${p.nama}" class="peserta-img">
                                </div>
                                <img src="assets/images/ornaments/daun-2.png" alt="Daun" class="leaf-bottom-left">
                            </div>
                            <h3 class="peserta-name">${p.nama}</h3>
                            <p class="peserta-info">${p.keterangan}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Render Rekening Amplop
    const rekeningContainer = document.getElementById('rekeningContainer');
    if (rekeningContainer && config.rekening && config.rekening.length > 0) {
        rekeningContainer.innerHTML = config.rekening.map((rek, idx) => `
            <div class="atm-card" data-aos="fade-up" data-aos-delay="${idx * 150}">
                <div class="atm-header">
                    <span class="atm-bank-name">${rek.bank}</span>
                    <div class="atm-chip"></div>
                </div>
                <div class="atm-number" id="rekNo_${idx}">${rek.nomor}</div>
                <div class="atm-holder">${rek.atasNama}</div>
                <button class="btn-salin-rek" onclick="copyRekening('rekNo_${idx}', this)">
                    <i class="fas fa-copy"></i> <span>Salin No Rekening</span>
                </button>
            </div>
        `).join('');
    }

    // Render Galeri Foto Dinamis (Slider Track & Grid Fallback)
    const galleryTrack = document.getElementById('galleryTrack');
    if (galleryTrack && config.galeri && config.galeri.length > 0) {
        galleryTrack.innerHTML = config.galeri.map((item, idx) => `
            <div class="gallery-slide gallery-item" data-src="${item.src}" data-index="${idx}">
                <div class="gallery-slide-card">
                    <img src="${item.src}" alt="Dokumentasi ${idx + 1}" loading="${idx < 3 ? 'eager' : 'lazy'}" decoding="async">
                </div>
            </div>
        `).join('');
    }

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid && config.galeri && config.galeri.length > 0) {
        galleryGrid.innerHTML = config.galeri.map((item, idx) => `
            <div class="gallery-item" data-src="${item.src}" data-aos="fade-up" data-aos-delay="${(idx % 4) * 80}">
                <img src="${item.src}" alt="${item.caption || `Dokumentasi ${idx + 1}`}" loading="lazy">
                <div class="gallery-item-overlay">
                    <i class="fas fa-search-plus fa-2x"></i>
                </div>
            </div>
        `).join('');
    }

    // Google Calendar Link Setup
    const btnCalendar = document.getElementById('btnAddToCalendar');
    if (btnCalendar && config.acara) {
        const eventTitle = encodeURIComponent(config.acara.jenis || 'Pawiwahan & Mepandes');
        const eventDesc = encodeURIComponent(config.acara.deskripsi || 'Undangan Acara');
        const eventLoc = encodeURIComponent(config.acara.tempat || 'Bali');
        
        const startDate = new Date(config.acara.tanggalAcara || '2026-10-16T19:00:00+08:00');
        const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000));

        const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${eventDesc}&location=${eventLoc}`;

        btnCalendar.href = gcalUrl;
    }
}

/**
 * Hitung Mundur Waktu (Live Countdown)
 */
function initCountdown(targetDateStr) {
    const targetDate = new Date(targetDateStr).getTime();

    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMinutes = document.getElementById('cdMinutes');
    const cdSeconds = document.getElementById('cdSeconds');

    if (!cdDays) return;

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            cdDays.textContent = '00';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            return;
        }

            const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        cdDays.textContent = String(days).padStart(2, '0');
        cdHours.textContent = String(hours).padStart(2, '0');
        cdMinutes.textContent = String(minutes).padStart(2, '0');
        cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Inisialisasi Galeri Slider / Carousel dengan Touch & Auto-Slide
 */
function initGallerySlider() {
    const track = document.getElementById('galleryTrack');
    const viewport = document.getElementById('galleryViewport');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    const dotsContainer = document.getElementById('galleryDots');
    const currentNumEl = document.getElementById('galleryCurrentIndex');
    const totalNumEl = document.getElementById('galleryTotalCount');

    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.gallery-slide'));
    const totalSlides = slides.length;
    if (totalSlides === 0) return;

    if (totalNumEl) totalNumEl.textContent = totalSlides;

    let currentIndex = 0;
    let autoSlideTimer = null;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragThresholdPassed = false;

    // Render Pagination Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Lihat foto ${i + 1}`);
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(i);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.gallery-dot')) : [];

    function updateSlider(animate = true) {
        const activeSlide = slides[currentIndex];
        if (!activeSlide || !viewport) return;

        if (animate) {
            track.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        } else {
            track.style.transition = 'none';
        }

        // Posisi tepat di tengah viewport sehingga foto sebelum & sesudah terlihat di kiri dan kanan
        const viewportWidth = viewport.offsetWidth;
        const slideWidth = activeSlide.offsetWidth;
        const slideLeft = activeSlide.offsetLeft;
        const centerOffset = (viewportWidth / 2) - (slideLeft + (slideWidth / 2));

        track.style.transform = `translateX(${centerOffset}px)`;

        // Update active class on slides for depth/scale effect
        slides.forEach((slide, idx) => {
            const isActive = idx === currentIndex;
            slide.classList.toggle('active', isActive);
            slide.classList.toggle('is-prev', idx === (currentIndex - 1 + totalSlides) % totalSlides);
            slide.classList.toggle('is-next', idx === (currentIndex + 1) % totalSlides);
        });

        // Update dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });

        // Update counter
        if (currentNumEl) {
            currentNumEl.textContent = currentIndex + 1;
        }
    }

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSlider(true);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            resetAutoSlide();
        });
    }

    // Touch & Swipe Event Support for Mobile (iPhone 16 / Android)
    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return;
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            dragThresholdPassed = false;
            stopAutoSlide();
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            if (Math.abs(diffX) > 10) {
                dragThresholdPassed = true;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const diffX = currentX - startX;
            if (diffX < -35) {
                nextSlide();
            } else if (diffX > 35) {
                prevSlide();
            }
            startAutoSlide();
        });

        // Mouse Drag Support for Desktop
        let isMouseDown = false;
        viewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isMouseDown = true;
            startX = e.clientX;
            currentX = startX;
            dragThresholdPassed = false;
            stopAutoSlide();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            currentX = e.clientX;
            const diffX = currentX - startX;
            if (Math.abs(diffX) > 10) {
                dragThresholdPassed = true;
            }
        });

        window.addEventListener('mouseup', () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            const diffX = currentX - startX;
            if (diffX < -40) {
                nextSlide();
            } else if (diffX > 40) {
                prevSlide();
            }
            startAutoSlide();
        });

        // Interaksi klik slide: klik slide samping langsung geser ke slide tsb, klik slide tengah buka lightbox
        slides.forEach((slide, idx) => {
            slide.addEventListener('click', (e) => {
                if (dragThresholdPassed) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    dragThresholdPassed = false;
                    return;
                }
                if (idx !== currentIndex) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    goToSlide(idx);
                    resetAutoSlide();
                }
            });
        });
    }

    // Auto Play Timer (4 seconds)
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(() => {
            const modal = document.getElementById('lightboxModal');
            if (modal && modal.classList.contains('active')) return;
            nextSlide();
        }, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Pause on hover
    if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoSlide);
        viewport.addEventListener('mouseleave', startAutoSlide);
    }

    // Responsive recalculation on screen rotate / window resize
    window.addEventListener('resize', () => {
        updateSlider(false);
    });

    // Inisialisasi awal
    setTimeout(() => {
        updateSlider(false);
    }, 50);
    startAutoSlide();
}

/**
 * Lightbox Preview Galeri Foto
 */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-slide, .gallery-item');

    if (!modal || !modalImg || galleryItems.length === 0) return;

    // Kumpulkan daftar gambar unik
    const imageList = [];
    galleryItems.forEach(item => {
        const src = item.getAttribute('data-src') || item.querySelector('img')?.src;
        if (src && !imageList.includes(src)) {
            imageList.push(src);
        }
    });

    if (imageList.length === 0) return;

    let currentIndex = 0;

    function showImage(index) {
        if (index < 0) index = imageList.length - 1;
        if (index >= imageList.length) index = 0;
        currentIndex = index;
        modalImg.src = imageList[currentIndex];
        modal.classList.add('active');
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src') || item.querySelector('img')?.src;
            const targetIdx = imageList.indexOf(src);
            if (targetIdx !== -1) {
                showImage(targetIdx);
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') modal.classList.remove('active');
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}

/**
 * Inisialisasi Pemutar Video Momen (Lokal MP4 atau YouTube)
 */
function initVideoSection(config, bgAudio, bgAudioBtn) {
    const videoConfig = config.video || {};
    const videoWrapper = document.getElementById('videoWrapper');
    const momenVideo = document.getElementById('momenVideo');
    const playOverlay = document.getElementById('videoPlayOverlay');
    const playBtn = document.getElementById('btnVideoPlay');

    if (!videoWrapper) return;

    // Jika video dimatikan di config
    if (videoConfig.aktif === false) {
        const videoSection = document.getElementById('video');
        if (videoSection) videoSection.style.display = 'none';
        return;
    }

    const videoSrc = videoConfig.src || 'assets/videos/video-momen.mp4';
    const posterSrc = videoConfig.poster || config.coverFoto || 'assets/images/photos/NAS_7364.JPEG';

    // Helper: ekstrak YouTube ID jika URL adalah YouTube
    function getYouTubeId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const ytId = getYouTubeId(videoSrc);

    if (ytId || videoConfig.tipe === 'youtube') {
        // Tampilkan pemutar YouTube Iframe
        videoWrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${ytId || videoSrc}?enablejsapi=1&rel=0&modestbranding=1" 
                title="${videoConfig.judul || 'Video Momen'}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        // Pemutar Video HTML5 Lokal
        if (momenVideo) {
            momenVideo.poster = posterSrc;
            const sourceEl = momenVideo.querySelector('source');
            if (sourceEl) {
                sourceEl.src = videoSrc;
                momenVideo.load();
            }

            function playVideo() {
                // Hentikan musik latar jika video diputar agar suara video terdengar jelas
                if (bgAudio && !bgAudio.paused) {
                    bgAudio.pause();
                    if (bgAudioBtn) {
                        bgAudioBtn.classList.remove('playing');
                        bgAudioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    }
                }

                momenVideo.play().then(() => {
                    if (playOverlay) playOverlay.classList.add('hidden');
                }).catch(err => {
                    console.log('Video play error:', err);
                    if (playOverlay) playOverlay.classList.add('hidden');
                });
            }

            if (playOverlay) {
                playOverlay.addEventListener('click', playVideo);
            }
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    playVideo();
                });
            }

            momenVideo.addEventListener('play', () => {
                if (playOverlay) playOverlay.classList.add('hidden');
                if (bgAudio && !bgAudio.paused) {
                    bgAudio.pause();
                    if (bgAudioBtn) {
                        bgAudioBtn.classList.remove('playing');
                        bgAudioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    }
                }
            });

            momenVideo.addEventListener('ended', () => {
                if (playOverlay) playOverlay.classList.remove('hidden');
                // Lanjutkan kembali musik latar setelah video selesai diputar
                if (bgAudio) {
                    bgAudio.play().then(() => {
                        if (bgAudioBtn) {
                            bgAudioBtn.classList.add('playing');
                            bgAudioBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
                        }
                    }).catch(e => console.log('Audio resume error:', e));
                }
            });
        }
    }
}

/**
 * Sistem RSVP & Buku Tamu Real-time (Google Sheets + LocalStorage Fallback)
 */
function initRSVPSystem(config) {
    const form = document.getElementById('rsvpForm');
    const wishesList = document.getElementById('wishesList');
    const alertSuccess = document.getElementById('rsvpAlertSuccess');
    const submitBtn = form?.querySelector('button[type="submit"]');

    const STORAGE_KEY = 'undangan_digital_bali_wishes';
    let googleSheetsUrl = (config.database?.googleSheetsUrl || '').trim();

    // Validasi format URL Google Sheets
    const isGoogleSheetsConfigured = googleSheetsUrl && googleSheetsUrl.startsWith('https://script.google.com/');

    // Filter untuk membersihkan ucapan dummy test awal
    function filterOutTest(list) {
        if (!Array.isArray(list)) return [];
        return list.filter(w => {
            const n = (w.nama || '').trim().toLowerCase();
            const p = (w.pesan || w.ucapan || '').trim().toLowerCase();
            // Hanya buang baris dummy test awal yang spesifik: nama 'test' dan pesan 'langgeng'
            if (n === 'test' && p === 'langgeng') return false;
            return true;
        });
    }

    // Bersihkan cache test lama jika ada
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored.toLowerCase().includes('"test"') && stored.toLowerCase().includes('"langgeng"')) {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (e) {}

    // Ambil data ucapan yang tersimpan lokal
    function getLocalWishes() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const filtered = filterOutTest(parsed);
                if (filtered.length > 0) return filtered;
            } catch (e) {
                console.error(e);
            }
        }
        return config.ucapanDefault || [];
    }

    function saveLocalWishes(wishes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filterOutTest(wishes)));
    }

    function updateCountBadge(count) {
        const wishesCountText = document.getElementById('wishesCountText');
        if (wishesCountText) {
            wishesCountText.textContent = count > 0 ? `${count} Doa Restu` : 'Belum ada ucapan';
        }
    }

    function renderWishes(wishes) {
        if (!wishesList) return;

        const displayWishes = filterOutTest(wishes);
        updateCountBadge(displayWishes.length);

        if (!displayWishes || displayWishes.length === 0) {
            // Jika kosong, tampilkan ucapan default dari config
            if (config.ucapanDefault && config.ucapanDefault.length > 0) {
                renderWishes(config.ucapanDefault);
                return;
            }
            wishesList.innerHTML = '<p class="text-center text-muted" style="padding: 25px;">Belum ada ucapan doa. Jadilah yang pertama memberikan ucapan!</p>';
            return;
        }

        wishesList.innerHTML = displayWishes.map(w => {
            const initial = w.nama ? w.nama.charAt(0).toUpperCase() : '?';
            let badgeClass = 'hadir';
            if (w.kehadiran === 'Tidak Hadir') badgeClass = 'tidak-hadir';
            if (w.kehadiran === 'Masih Ragu') badgeClass = 'ragu';

            return `
                <div class="wish-item">
                    <div class="wish-header">
                        <div class="wish-sender-info">
                            <div class="wish-avatar">${initial}</div>
                            <div>
                                <h4 class="wish-sender-name">${escapeHtml(w.nama)}</h4>
                                <span class="wish-time">${w.waktu || 'Baru saja'}</span>
                            </div>
                        </div>
                        <span class="wish-badge ${badgeClass}">${escapeHtml(w.kehadiran || 'Hadir')}</span>
                    </div>
                    <div class="wish-body">
                        ${escapeHtml(w.pesan || w.ucapan || '')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 1. Muat Ucapan Awal (Live dari Google Sheets dengan Cache Buster)
    function loadInitialWishes(isSilent = false) {
        const refreshIcon = document.getElementById('refreshIcon');
        const wishesCountText = document.getElementById('wishesCountText');

        if (refreshIcon) refreshIcon.classList.add('fa-spin');
        if (!isSilent && wishesCountText) wishesCountText.textContent = 'Memperbarui doa restu...';

        if (isGoogleSheetsConfigured) {
            // Pasang timestamp nocache agar browser tidak menggunakan cache lama
            const noCacheUrl = googleSheetsUrl + (googleSheetsUrl.includes('?') ? '&' : '?') + 'nocache=' + Date.now();
            console.log('📡 Mengambil komentar terbaru dari Google Sheets...');

            fetch(noCacheUrl)
                .then(res => res.json())
                .then(res => {
                    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
                    if (res && res.status === 'success' && Array.isArray(res.data)) {
                        console.log('✅ Komentar sinkron dengan Google Sheets. Jumlah:', res.data.length);
                        const cleanData = filterOutTest(res.data);
                        if (cleanData.length > 0) {
                            saveLocalWishes(cleanData);
                            renderWishes(cleanData);
                        } else {
                            renderWishes(config.ucapanDefault || []);
                        }
                    } else {
                        renderWishes(getLocalWishes());
                    }
                })
                .catch(err => {
                    if (refreshIcon) refreshIcon.classList.remove('fa-spin');
                    console.warn('⚠️ Gagal mengambil live dari Google Sheets, menggunakan data cache lokal.', err);
                    renderWishes(getLocalWishes());
                });
        } else {
            if (refreshIcon) refreshIcon.classList.remove('fa-spin');
            console.log('ℹ️ Google Sheets URL belum diisi di config.js. Menggunakan mode penyimpanan lokal browser.');
            renderWishes(getLocalWishes());
        }
    }

    // Panggil saat halaman dibuka
    loadInitialWishes(false);

    // Tombol refresh manual
    const btnRefresh = document.getElementById('btnRefreshWishes');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            loadInitialWishes(false);
        });
    }

    // Auto-sync saat tab dibuka kembali oleh pengguna
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            loadInitialWishes(true);
        }
    });

    // 2. Kirim Ucapan Baru
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('rsvpNama').value.trim();
            const kehadiran = document.querySelector('input[name="kehadiran"]:checked')?.value || 'Hadir';
            const pesan = document.getElementById('rsvpPesan').value.trim();

            if (!nama || !pesan) {
                alert('Silakan lengkapi nama dan ucapan Anda.');
                return;
            }

            const newWish = {
                nama: nama,
                kehadiran: kehadiran,
                pesan: pesan,
                waktu: 'Baru saja'
            };

            // Tampilkan seketika di layar dan simpan ke cache lokal
            const currentWishes = getLocalWishes();
            currentWishes.unshift(newWish);
            saveLocalWishes(currentWishes);
            renderWishes(currentWishes);

            // Tampilkan animasi loading pada tombol
            const origBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Mengirimkan Doa...</span>';
            }

            // Kirim ke Google Sheets
            if (isGoogleSheetsConfigured) {
                console.log('📤 Mengirim ucapan ke Google Sheets...');
                
                const postParams = new URLSearchParams();
                postParams.append('nama', nama);
                postParams.append('kehadiran', kehadiran);
                postParams.append('ucapan', pesan);
                postParams.append('pesan', pesan);

                fetch(googleSheetsUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: postParams.toString()
                }).then(() => {
                    console.log('✅ Request terkirim ke Google Sheets!');
                    handleSuccess();
                }).catch(err => {
                    console.error('❌ Error kirim ke Google Sheets:', err);
                    handleSuccess();
                });
            } else {
                handleSuccess();
            }

            function handleSuccess() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnText;
                }

                // Reset field pesan saja jika nama tamu dikunci dari URL
                const rsvpPesan = document.getElementById('rsvpPesan');
                if (rsvpPesan) rsvpPesan.value = '';

                const urlParams = new URLSearchParams(window.location.search);
                const guestParam = urlParams.get('untuk') || urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
                if (!guestParam && !window.DEFAULT_GUEST_NAME) {
                    form.reset();
                }

                if (alertSuccess) {
                    alertSuccess.style.display = 'block';
                    setTimeout(() => {
                        alertSuccess.style.display = 'none';
                    }, 4000);
                }

                // Sinkronkan kembali dari Google Sheets setelah 1.5 detik
                setTimeout(() => {
                    loadInitialWishes(true);
                }, 1500);
            }
        });
    }
}

/**
 * Salin Nomor Rekening 1-Klik
 */
window.copyRekening = function(elementId, btnElement) {
    const textEl = document.getElementById(elementId);
    if (!textEl) return;

    const textToCopy = textEl.innerText.replace(/\s+/g, '').trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalContent = btnElement.innerHTML;
        btnElement.classList.add('copied');
        btnElement.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin!</span>';

        setTimeout(() => {
            btnElement.classList.remove('copied');
            btnElement.innerHTML = originalContent;
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin:', err);
    });
};

/**
 * Helper Escape HTML untuk mencegah XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

