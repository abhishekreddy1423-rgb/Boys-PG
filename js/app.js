/**
 * Main Application Controller - Enhanced with Visual Slider & Room Carousels
 * =========================================================================
 * Sri Mallikarjuna Swami The Boys PG
 */

window.App = {
  currentMenuDay: "",
  foodMenuData: null,
  galleryFilter: "All",
  currentHeroSlide: 0,
  heroSlideTimer: null,
  roomSlideIndices: {}, // Track active slide index per room ID
  lightboxItems: [], // Dynamic list of photos currently in lightbox
  lightboxIndex: 0,
  touchStartX: 0,
  touchEndX: 0,

  init() {
    this.bindStaticConfig();
    this.setupHeroSlider();
    this.renderRooms();
    this.setupBedAvailability();
    this.renderFacilities();
    this.renderFoodMenu();
    this.renderGallery();
    this.renderFloorPlan();
    this.renderRules();
    this.renderLandmarks();
    this.renderFaqs();
    this.setupNavigation();
    this.setupLightbox();
    this.setupBookingForm();
    this.setupSmoothScroll();
  },

  onLanguageChange(lang) {
    this.bindStaticConfig();
    this.renderHeroSlideContent();
    this.renderRooms();
    this.renderBedAvailability();
    this.renderFacilities();
    this.renderFoodMenu();
    this.renderGallery();
    this.renderFloorPlan();
    this.renderRules();
    this.renderLandmarks();
    this.renderFaqs();
  },

  isTe() {
    return window.I18N && window.I18N.currentLang === "te";
  },

  bindStaticConfig() {
    const cfg = window.HOSTEL_CONFIG;
    if (!cfg) return;
    const isTe = this.isTe();

    // Phone & WhatsApp links
    const phoneLinks = document.querySelectorAll(".contact-phone-link");
    phoneLinks.forEach(a => {
      a.setAttribute("href", `tel:+${cfg.contact.phoneRaw}`);
      a.textContent = cfg.contact.phoneDisplay;
    });

    const callBtns = document.querySelectorAll(".btn-call-direct");
    callBtns.forEach(a => a.setAttribute("href", `tel:+${cfg.contact.phoneRaw}`));

    const waLinks = document.querySelectorAll(".contact-wa-link");
    const defaultWaUrl = `https://wa.me/${cfg.contact.whatsappNumber}?text=Hi%2C%20I%20am%20interested%20in%20Sri%20Mallikarjuna%20Swami%20The%20Boys%20PG.%20Please%20share%20the%20details.`;
    waLinks.forEach(a => {
      a.setAttribute("href", defaultWaUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    // Quick Info Bar Starting Rent
    const startingRentEl = document.getElementById("quickStatStartingRent");
    if (startingRentEl) {
      startingRentEl.textContent = `Starting from ${cfg.quickStats.startingRent}/month`;
    }

    // Room preference select options
    const roomSelect = document.getElementById("roomPreference");
    if (roomSelect && cfg.rooms) {
      roomSelect.innerHTML = cfg.rooms.map(r => `
        <option value="${r.id}" ${r.id === '3-sharing' ? 'selected' : ''}>${r.title} (₹${r.monthlyRent.toLocaleString('en-IN')}/mo)</option>
      `).join("");
    }

    // Maps links
    document.querySelectorAll(".btn-maps-link").forEach(a => {
      a.setAttribute("href", cfg.contact.googleMapsUrl);
    });
    document.querySelectorAll(".btn-directions-link").forEach(a => {
      a.setAttribute("href", cfg.contact.directionsUrl);
    });

    // Address text
    const addrEl = document.getElementById("footerAddress");
    if (addrEl) {
      addrEl.textContent = isTe ? cfg.contact.address.fullAddressTe : cfg.contact.address.fullAddress;
    }
    const wardenEl = document.getElementById("wardenNameDisplay");
    if (wardenEl) {
      wardenEl.textContent = `${cfg.contact.ownerName} (${isTe ? cfg.contact.ownerRoleTe : cfg.contact.ownerRole})`;
    }
  },

  // 1. Hero 16:9 Slider Controller
  setupHeroSlider() {
    const container = document.getElementById("heroSliderTrack");
    const dotsContainer = document.getElementById("heroSliderDots");
    const prevBtn = document.getElementById("heroPrevBtn");
    const nextBtn = document.getElementById("heroNextBtn");
    if (!container) return;

    const cfg = window.HOSTEL_CONFIG;
    const slides = cfg.heroSlides || [];
    if (!slides.length) return;

    // Render slides HTML
    container.innerHTML = slides.map((slide, index) => `
      <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
        <img src="${slide.image}" alt="${slide.title}" class="hero-slide-bg" loading="${index === 0 ? 'eager' : 'lazy'}">
        <div class="hero-slide-overlay"></div>
      </div>
    `).join("");

    // Render indicator dots
    if (dotsContainer) {
      dotsContainer.innerHTML = slides.map((_, index) => `
        <button class="hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>
      `).join("");

      dotsContainer.querySelectorAll(".hero-dot").forEach(dot => {
        dot.addEventListener("click", () => {
          this.goToHeroSlide(parseInt(dot.getAttribute("data-index"), 10));
        });
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => this.stepHeroSlide(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => this.stepHeroSlide(1));

    this.renderHeroSlideContent();
    this.startHeroAutoAdvance();

    // Pause on hover
    const sliderWrap = document.querySelector(".hero-slider-wrapper");
    if (sliderWrap) {
      sliderWrap.addEventListener("mouseenter", () => clearInterval(this.heroSlideTimer));
      sliderWrap.addEventListener("mouseleave", () => this.startHeroAutoAdvance());
    }
  },

  startHeroAutoAdvance() {
    clearInterval(this.heroSlideTimer);
    this.heroSlideTimer = setInterval(() => {
      this.stepHeroSlide(1);
    }, 5500);
  },

  stepHeroSlide(dir) {
    const cfg = window.HOSTEL_CONFIG;
    const total = cfg.heroSlides.length;
    const nextIndex = (this.currentHeroSlide + dir + total) % total;
    this.goToHeroSlide(nextIndex);
  },

  goToHeroSlide(index) {
    this.currentHeroSlide = index;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");

    slides.forEach((s, idx) => {
      s.classList.toggle("active", idx === index);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle("active", idx === index);
    });

    this.renderHeroSlideContent();
  },

  renderHeroSlideContent() {
    const cfg = window.HOSTEL_CONFIG;
    if (!cfg.heroSlides || !cfg.heroSlides[this.currentHeroSlide]) return;
    const slide = cfg.heroSlides[this.currentHeroSlide];
    const isTe = this.isTe();

    const captionEl = document.getElementById("heroSlideCaption");
    if (captionEl) {
      captionEl.textContent = isTe ? slide.captionTe : slide.caption;
    }
  },

  // 2. Rooms & Pricing with 3-Image Carousels & Lightbox Integration
  renderRooms() {
    const container = document.getElementById("roomsGrid");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    container.innerHTML = cfg.rooms.map(room => {
      const title = isTe ? room.titleTe : room.title;
      const desc = isTe ? room.descriptionTe : room.description;
      const badge = isTe ? room.badgeTe : room.badge;
      const badgeClass = room.badgeType === "warning" ? "badge-warning" : "badge-success";
      const images = room.images || [{ src: room.image, caption: title, captionTe: title }];
      const currentIdx = this.roomSlideIndices[room.id] || 0;

      const featuresHtml = room.features.map(f => {
        const text = isTe ? f.te : f.en;
        return `
          <li class="room-feature-item">
            <svg class="check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${text}</span>
          </li>
        `;
      }).join("");

      // Carousel images HTML
      const imagesHtml = images.map((img, idx) => {
        const cap = isTe ? img.captionTe : img.caption;
        return `
          <div class="room-carousel-slide ${idx === currentIdx ? 'active' : ''}" data-idx="${idx}">
            <img src="${img.src}" alt="${cap}" loading="lazy" class="room-carousel-img">
            <div class="room-carousel-caption">${cap}</div>
          </div>
        `;
      }).join("");

      // Carousel dots HTML
      const dotsHtml = images.map((_, idx) => `
        <span class="room-carousel-dot ${idx === currentIdx ? 'active' : ''}" data-idx="${idx}"></span>
      `).join("");

      return `
        <div class="room-card" data-room-id="${room.id}">
          <div class="room-carousel-box" id="carousel-${room.id}">
            <div class="room-carousel-track">
              ${imagesHtml}
            </div>

            <!-- Carousel Controls -->
            <button class="room-carousel-prev" data-room-id="${room.id}" aria-label="Previous photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="room-carousel-next" data-room-id="${room.id}" aria-label="Next photo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div class="room-carousel-dots">
              ${dotsHtml}
            </div>

            <span class="room-badge ${badgeClass}">${badge}</span>
            
            <button class="btn-view-photos" data-room-id="${room.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <span>${isTe ? "ఫోటోలు చూడండి" : "View Photos"}</span>
            </button>
          </div>

          <div class="room-card-body">
            <h3 class="room-title">${title}</h3>
            <p class="room-desc">${desc}</p>
            
            <div class="room-pricing">
              <div class="rent-wrap">
                <span class="currency">₹</span>
                <span class="rent-amount">${room.monthlyRent.toLocaleString("en-IN")}</span>
                <span class="rent-period">${isTe ? "/ నెలకు" : "/ month"}</span>
              </div>
              <div class="deposit-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>${isTe ? "డిపాజిట్: ₹" + room.deposit : "Deposit: ₹" + room.deposit} (${isTe ? "వాపస్" : "Refundable"})</span>
              </div>
            </div>

            <div class="room-amenities">
              <div class="amenities-label">${isTe ? "లభించే సౌకర్యాలు:" : "Included Amenities:"}</div>
              <ul class="room-features-list">
                ${featuresHtml}
              </ul>
            </div>

            <div class="room-card-footer">
              <a href="https://wa.me/${cfg.contact.whatsappNumber}?text=${encodeURIComponent(`Hi, I am interested in the ${room.id === '2-sharing' ? '2 Sharing' : room.id === '3-sharing' ? '3 Sharing' : '4 Sharing'} room (₹${room.monthlyRent.toLocaleString('en-IN')}/month) at Sri Mallikarjuna Swami The Boys PG.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block select-room-btn" data-room-id="${room.id}" data-room-name="${title}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.761.88 2.796.88 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.243c-.144.405-.837.774-1.17.824-.312.045-.694.06-1.11-.073-.255-.081-.57-.197-.98-.375-1.74-.757-2.87-2.525-2.958-2.641-.088-.116-.708-.941-.708-1.796 0-.855.449-1.277.61-1.451.161-.173.351-.217.468-.217.116 0 .234 0 .336.005.107.005.252-.041.391.292.146.35.498 1.213.542 1.301.044.088.073.19.015.307-.059.117-.088.19-.175.292-.088.102-.185.228-.264.307-.088.088-.18.184-.078.36.103.175.457.754.98 1.22 1.05.936 1.937 1.226 2.213 1.363.277.136.438.117.6-.07.161-.187.688-.804.872-1.079.183-.275.366-.231.614-.141.249.09 1.573.741 1.842.875.27.135.45.202.516.315.066.113.066.653-.078 1.058z"/></svg>
                <span>${isTe ? "బుకింగ్ / విచారణ (WhatsApp)" : "Book / Enquire on WhatsApp"}</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind Carousel Prev / Next buttons
    container.querySelectorAll(".room-carousel-prev").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const roomId = btn.getAttribute("data-room-id");
        this.stepRoomCarousel(roomId, -1);
      });
    });

    container.querySelectorAll(".room-carousel-next").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const roomId = btn.getAttribute("data-room-id");
        this.stepRoomCarousel(roomId, 1);
      });
    });

    // Bind "View Photos" button to open the 3 photos in the lightbox
    container.querySelectorAll(".btn-view-photos").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const roomId = btn.getAttribute("data-room-id");
        const room = cfg.rooms.find(r => r.id === roomId);
        if (room && room.images) {
          const items = room.images.map(img => ({
            image: img.src,
            title: isTe ? room.titleTe : room.title,
            caption: isTe ? img.captionTe : img.caption,
            category: isTe ? "రూమ్ ఫోటోలు" : "Room Photos"
          }));
          this.openLightboxWithItems(items, 0);
        }
      });
    });

    // Bind "Book This Bed"
    container.querySelectorAll(".select-room-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const roomId = btn.getAttribute("data-room-id");
        const select = document.getElementById("roomPreference");
        if (select) select.value = roomId;
        const formSection = document.getElementById("booking");
        if (formSection) {
          formSection.scrollIntoView({ behavior: "smooth", block: "start" });
          const nameInput = document.getElementById("studentName");
          if (nameInput) nameInput.focus();
        }
      });
    });
  },

  stepRoomCarousel(roomId, dir) {
    const cfg = window.HOSTEL_CONFIG;
    const room = cfg.rooms.find(r => r.id === roomId);
    if (!room || !room.images) return;

    const current = this.roomSlideIndices[roomId] || 0;
    const total = room.images.length;
    const nextIdx = (current + dir + total) % total;
    this.roomSlideIndices[roomId] = nextIdx;

    const box = document.getElementById(`carousel-${roomId}`);
    if (!box) return;

    const slides = box.querySelectorAll(".room-carousel-slide");
    const dots = box.querySelectorAll(".room-carousel-dot");

    slides.forEach((s, idx) => s.classList.toggle("active", idx === nextIdx));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === nextIdx));
  },

  // 3. 2D Architectural Floor Plan Graphic Viewer
  renderFloorPlan() {
    const container = document.getElementById("floorPlanContainer");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();
    const fp = cfg.floorPlan;
    if (!fp) return;

    const title = isTe ? fp.titleTe : fp.title;
    const desc = isTe ? fp.descriptionTe : fp.description;

    container.innerHTML = `
      <div class="floor-plan-card">
        <div class="floor-plan-graphic-wrap" id="floorPlanZoom">
          <img src="${fp.image}" alt="${title}" class="floor-plan-img" loading="lazy">
          <div class="floor-plan-badge-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>${fp.dimensions}</span>
          </div>
        </div>
        <div class="floor-plan-info">
          <h3 class="floor-plan-title">${title}</h3>
          <p class="floor-plan-desc">${desc}</p>
          <button class="btn btn-outline" id="btnEnlargeFloorPlan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            <span>${isTe ? "ప్లాన్ పెద్దదిగా చూడండి" : "Enlarge Blueprint"}</span>
          </button>
        </div>
      </div>
    `;

    const enlargeBtn = document.getElementById("btnEnlargeFloorPlan");
    const planImg = document.getElementById("floorPlanZoom");
    const openPlanInLightbox = () => {
      this.openLightboxWithItems([{
        image: fp.image,
        title: title,
        caption: `${fp.dimensions} • Attached Geyser Washroom • Individual Wardrobes`,
        category: "Floor Plan"
      }], 0);
    };

    if (enlargeBtn) enlargeBtn.addEventListener("click", openPlanInLightbox);
    if (planImg) planImg.addEventListener("click", openPlanInLightbox);
  },

  // 4. Virtual Walkthrough Video Section
  renderVideoTour() {
    const container = document.getElementById("videoTourContainer");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();
    const tour = cfg.videoTour;
    if (!tour) return;

    container.innerHTML = `
      <div class="video-tour-card">
        <div class="video-embed-wrapper">
          <iframe 
            src="${tour.youtubeEmbedUrl}" 
            title="${isTe ? tour.titleTe : tour.title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            loading="lazy" 
            class="video-iframe">
          </iframe>
        </div>
        <div class="video-tour-footer">
          <div class="video-tour-meta">
            <span class="video-duration-tag">⏱️ ${tour.duration} Tour</span>
            <h3 class="video-tour-title">${isTe ? tour.titleTe : tour.title}</h3>
            <p class="video-tour-sub">${isTe ? tour.subtitleTe : tour.subtitle}</p>
          </div>
          <a href="https://wa.me/${cfg.contact.whatsappNumber}?text=Hi%2C%20I%20am%20interested%20in%20Sri%20Mallikarjuna%20Swami%20The%20Boys%20PG.%20Please%20share%20the%20details." class="btn btn-whatsapp contact-wa-link" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.586 1.761.88 2.796.88 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.243c-.144.405-.837.774-1.17.824-.312.045-.694.06-1.11-.073-.255-.081-.57-.197-.98-.375-1.74-.757-2.87-2.525-2.958-2.641-.088-.116-.708-.941-.708-1.796 0-.855.449-1.277.61-1.451.161-.173.351-.217.468-.217.116 0 .234 0 .336.005.107.005.252-.041.391.292.146.35.498 1.213.542 1.301.044.088.073.19.015.307-.059.117-.088.19-.175.292-.088.102-.185.228-.264.307-.088.088-.18.184-.078.36.103.175.457.754.98 1.22 1.05.936 1.937 1.226 2.213 1.363.277.136.438.117.6-.07.161-.187.688-.804.872-1.079.183-.275.366-.231.614-.141.249.09 1.573.741 1.842.875.27.135.45.202.516.315.066.113.066.653-.078 1.058z"/></svg>
            <span>${isTe ? "సందర్శనను బుక్ చేయండి" : "Book an In-Person Visit"}</span>
          </a>
        </div>
      </div>
    `;
  },

  // 5. Facilities Grid
  renderFacilities() {
    const container = document.getElementById("facilitiesGrid");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    const getIconSvg = (iconName) => {
      switch (iconName) {
        case "wifi":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`;
        case "flame":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
        case "droplet":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
        case "shirt":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`;
        case "zap":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
        case "shield-check":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
        case "bike":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
        case "book-open":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
        case "bed":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;
        case "archive":
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`;
        default:
          return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      }
    };

    container.innerHTML = cfg.facilities.map(fac => {
      const title = isTe ? fac.titleTe : fac.title;
      const desc = isTe ? fac.descTe : fac.desc;

      return `
        <div class="facility-card">
          <div class="facility-icon-wrap">
            ${getIconSvg(fac.icon)}
          </div>
          <h3 class="facility-title">${title}</h3>
          <p class="facility-desc">${desc}</p>
        </div>
      `;
    }).join("");
  },

  // 6. Food Menu Table & Day Tabs
  getTodayDayName() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
  },

  isNonVegItem(dishName) {
    if (!dishName) return false;
    const lower = dishName.trim().toLowerCase();
    // Non-veg items: Egg Rice, Chicken Curry, Chicken Kabab, Egg Chapati, Dum Biryani
    const nonVegKeywords = [
      "egg rice",
      "chicken curry",
      "chicken kabab",
      "egg chapati",
      "dum biryani",
      "chicken",
      "egg",
      "biryani"
    ];
    return nonVegKeywords.some(keyword => lower.includes(keyword));
  },

  renderDishBadge(dish) {
    const isNonVeg = this.isNonVegItem(dish);
    const dotClass = isNonVeg ? "diet-dot non-veg" : "diet-dot veg";
    const itemClass = isNonVeg ? "dish-item is-non-veg" : "dish-item";
    const title = isNonVeg ? "Non-Vegetarian" : "Vegetarian";
    return `<span class="${itemClass}"><span class="${dotClass}" title="${title}" aria-label="${title}"></span><span class="dish-name">${dish}</span></span>`;
  },

  async loadFoodMenuData() {
    if (this.foodMenuData && this.foodMenuData.length > 0) {
      return this.foodMenuData;
    }
    try {
      const response = await fetch("data/menu.json");
      if (response.ok) {
        const data = await response.json();
        this.foodMenuData = Array.isArray(data) ? data : (data.schedule || data.menu || []);
        if (this.foodMenuData && this.foodMenuData.length > 0) {
          return this.foodMenuData;
        }
      }
    } catch (err) {
      console.warn("Could not fetch data/menu.json, falling back to config data:", err);
    }
    const cfg = window.HOSTEL_CONFIG;
    this.foodMenuData = (cfg && cfg.foodMenu && cfg.foodMenu.schedule) ? cfg.foodMenu.schedule : [];
    return this.foodMenuData;
  },

  async renderFoodMenu() {
    const container = document.getElementById("foodMenuContainer") || document.getElementById("foodMenuSchedule");
    if (!container) return;

    const todayName = this.getTodayDayName();
    if (!this.currentMenuDay) {
      this.currentMenuDay = todayName;
    }

    const isTe = this.isTe();
    const days = await this.loadFoodMenuData();
    if (!days || days.length === 0) return;

    // Build Desktop Table Rows
    const tableRowsHtml = days.map(d => {
      const isToday = d.day.toLowerCase() === todayName.toLowerCase();
      const bfastDishes = Array.isArray(d.breakfast) ? d.breakfast : [d.breakfast];
      const lunchDishes = Array.isArray(d.lunch) ? d.lunch : [d.lunch];
      const dinnerDishes = Array.isArray(d.dinner) ? d.dinner : [d.dinner];

      return `
        <tr class="menu-table-row ${isToday ? 'is-today' : ''}" data-day="${d.day}">
          <td class="menu-td-day">
            <div class="day-cell-wrap">
              <div class="day-name-en">${d.day}</div>
              <div class="day-name-te">${d.te || ''}</div>
              ${isToday ? `<span class="today-badge"><span class="today-pulse"></span>${isTe ? "ఈ రోజు" : "Today"}</span>` : ''}
            </div>
          </td>
          <td class="menu-td-meal">
            <div class="dish-list">
              ${bfastDishes.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </td>
          <td class="menu-td-meal">
            <div class="dish-list">
              ${lunchDishes.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </td>
          <td class="menu-td-meal">
            <div class="dish-list">
              ${dinnerDishes.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Active day for mobile card
    let activeDayObj = days.find(d => d.day.toLowerCase() === this.currentMenuDay.toLowerCase());
    if (!activeDayObj) {
      activeDayObj = days.find(d => d.day.toLowerCase() === todayName.toLowerCase()) || days[0];
      this.currentMenuDay = activeDayObj.day;
    }

    const isActiveToday = activeDayObj.day.toLowerCase() === todayName.toLowerCase();

    // Mobile tabs
    const mobileTabsHtml = days.map(d => {
      const isSelected = d.day.toLowerCase() === this.currentMenuDay.toLowerCase();
      const isDayToday = d.day.toLowerCase() === todayName.toLowerCase();
      const shortEn = d.day.slice(0, 3);
      const shortTe = (d.te || '').slice(0, 4);

      return `
        <button type="button"
                class="mobile-day-tab ${isSelected ? 'active' : ''} ${isDayToday ? 'is-today-tab' : ''}"
                data-day="${d.day}"
                aria-label="${d.day} Menu">
          <span class="tab-day-short">${shortEn}</span>
          <span class="tab-day-te">${shortTe}</span>
        </button>
      `;
    }).join("");

    // Mobile Active Card Meals
    const mBfast = Array.isArray(activeDayObj.breakfast) ? activeDayObj.breakfast : [activeDayObj.breakfast];
    const mLunch = Array.isArray(activeDayObj.lunch) ? activeDayObj.lunch : [activeDayObj.lunch];
    const mDinner = Array.isArray(activeDayObj.dinner) ? activeDayObj.dinner : [activeDayObj.dinner];

    const mobileCardHtml = `
      <div class="mobile-single-day-card ${isActiveToday ? 'is-today' : ''}" id="mobileActiveDayCard">
        <div class="mobile-card-top">
          <div class="mobile-card-day-title">
            <div class="mobile-card-day-en">
              ${activeDayObj.day}
              ${isActiveToday ? `<span class="today-badge"><span class="today-pulse"></span>${isTe ? "ఈ రోజు" : "Today"}</span>` : ''}
            </div>
            <div class="mobile-card-day-te">${activeDayObj.te || ''}</div>
          </div>
          <div class="mobile-nav-buttons">
            <button type="button" class="mobile-nav-btn" id="menuPrevDayBtn" aria-label="Previous day" title="Previous day">‹</button>
            <button type="button" class="mobile-nav-btn" id="menuNextDayBtn" aria-label="Next day" title="Next day">›</button>
          </div>
        </div>

        <div class="mobile-meals-stack">
          <!-- Breakfast -->
          <div class="mobile-meal-box">
            <div class="mobile-meal-header">
              <div class="mobile-meal-header-left">
                <span class="mobile-meal-icon" aria-hidden="true">🌅</span>
                <span class="mobile-meal-name">${isTe ? "అల్పాహారం" : "Breakfast"}</span>
              </div>
              <span class="mobile-meal-timing">7:30 AM - 9:45 AM</span>
            </div>
            <div class="mobile-meal-dishes">
              ${mBfast.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </div>

          <!-- Lunch -->
          <div class="mobile-meal-box">
            <div class="mobile-meal-header">
              <div class="mobile-meal-header-left">
                <span class="mobile-meal-icon" aria-hidden="true">☀️</span>
                <span class="mobile-meal-name">${isTe ? "మధ్యాహ్న భోజనం" : "Lunch"}</span>
              </div>
              <span class="mobile-meal-timing">12:30 PM - 2:00 PM</span>
            </div>
            <div class="mobile-meal-dishes">
              ${mLunch.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </div>

          <!-- Dinner -->
          <div class="mobile-meal-box">
            <div class="mobile-meal-header">
              <div class="mobile-meal-header-left">
                <span class="mobile-meal-icon" aria-hidden="true">🌙</span>
                <span class="mobile-meal-name">${isTe ? "రాత్రి భోజనం" : "Dinner"}</span>
              </div>
              <span class="mobile-meal-timing">7:30 PM - 9:00 PM</span>
            </div>
            <div class="mobile-meal-dishes">
              ${mDinner.map(item => this.renderDishBadge(item)).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    const noteText = isTe
      ? "అందుబాటు మరియు పండుగల ఆధారంగా మెనూలో స్వల్ప మార్పులు ఉండవచ్చు."
      : "Menu may change slightly based on availability and festivals.";

    // Assemble container HTML
    container.innerHTML = `
      <!-- Veg / Non-Veg Legend -->
      <div class="menu-legend-bar">
        <span class="legend-item">
          <span class="diet-dot veg"></span>
          <span>${isTe ? "శాకాహారం (Veg)" : "Veg"}</span>
        </span>
        <span class="legend-item">
          <span class="diet-dot non-veg"></span>
          <span>${isTe ? "మాంసాహారం (Non-Veg)" : "Non-Veg"}</span>
        </span>
      </div>

      <!-- Desktop Weekly Table (Columns: Day | Breakfast | Lunch | Dinner) -->
      <div class="menu-table-card">
        <table class="menu-desktop-table" aria-label="Weekly Food Menu Table">
          <thead>
            <tr>
              <th class="menu-th-day">
                <span class="th-meal-title">${isTe ? "వారం / రోజు" : "Day"}</span>
              </th>
              <th class="menu-th-meal">
                <div class="th-meal-header">
                  <span class="th-meal-icon" aria-hidden="true">🌅</span>
                  <div class="th-meal-info">
                    <span class="th-meal-title">${isTe ? "అల్పాహారం" : "Breakfast"}</span>
                    <span class="th-meal-timing">7:30 AM - 9:45 AM</span>
                  </div>
                </div>
              </th>
              <th class="menu-th-meal">
                <div class="th-meal-header">
                  <span class="th-meal-icon" aria-hidden="true">☀️</span>
                  <div class="th-meal-info">
                    <span class="th-meal-title">${isTe ? "మధ్యాహ్న భోజనం" : "Lunch"}</span>
                    <span class="th-meal-timing">12:30 PM - 2:00 PM</span>
                  </div>
                </div>
              </th>
              <th class="menu-th-meal">
                <div class="th-meal-header">
                  <span class="th-meal-icon" aria-hidden="true">🌙</span>
                  <div class="th-meal-info">
                    <span class="th-meal-title">${isTe ? "రాత్రి భోజనం" : "Dinner"}</span>
                    <span class="th-meal-timing">7:30 PM - 9:00 PM</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Mobile Tab View with One Card per Day (No Horizontal Scrolling) -->
      <div class="menu-mobile-view">
        <div class="mobile-day-tabs" role="tablist" aria-label="Weekly Menu Days">
          ${mobileTabsHtml}
        </div>
        ${mobileCardHtml}
      </div>

      <!-- Note under menu -->
      <div class="menu-footer-note">
        <svg class="menu-footer-note-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span data-i18n="menuNote">${noteText}</span>
      </div>
    `;

    // Attach Mobile Tab Click Listeners
    container.querySelectorAll(".mobile-day-tab").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        const targetDay = tabBtn.getAttribute("data-day");
        if (targetDay && targetDay !== this.currentMenuDay) {
          this.currentMenuDay = targetDay;
          this.renderFoodMenu();
        }
      });
    });

    // Attach Prev / Next Day navigation
    const prevBtn = container.querySelector("#menuPrevDayBtn");
    const nextBtn = container.querySelector("#menuNextDayBtn");
    if (prevBtn && nextBtn) {
      const dayOrder = days.map(d => d.day);
      const currIdx = dayOrder.findIndex(name => name.toLowerCase() === this.currentMenuDay.toLowerCase());

      prevBtn.addEventListener("click", () => {
        const newIdx = (currIdx - 1 + dayOrder.length) % dayOrder.length;
        this.currentMenuDay = dayOrder[newIdx];
        this.renderFoodMenu();
      });

      nextBtn.addEventListener("click", () => {
        const newIdx = (currIdx + 1) % dayOrder.length;
        this.currentMenuDay = dayOrder[newIdx];
        this.renderFoodMenu();
      });
    }

    // Touch Swipe support on Mobile Card
    const cardEl = container.querySelector("#mobileActiveDayCard");
    if (cardEl) {
      let touchStartX = 0;
      cardEl.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      cardEl.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        if (Math.abs(diffX) > 40) {
          const dayOrder = days.map(d => d.day);
          const currIdx = dayOrder.findIndex(name => name.toLowerCase() === this.currentMenuDay.toLowerCase());
          if (diffX < 0) {
            // Swiped left -> Next Day
            const nextIdx = (currIdx + 1) % dayOrder.length;
            this.currentMenuDay = dayOrder[nextIdx];
            this.renderFoodMenu();
          } else {
            // Swiped right -> Prev Day
            const prevIdx = (currIdx - 1 + dayOrder.length) % dayOrder.length;
            this.currentMenuDay = dayOrder[prevIdx];
            this.renderFoodMenu();
          }
        }
      }, { passive: true });
    }
  },

  // 7. Masonry-Style Photo Gallery with Captions & Lightbox
  renderGallery() {
    const container = document.getElementById("galleryGrid");
    const filtersContainer = document.getElementById("galleryFilters");
    if (!container) return;

    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    if (filtersContainer) {
      const categories = [
        { id: "All", en: "All Photos", te: "అన్ని ఫోటోలు" },
        { id: "Building", en: "Building", te: "భవనం" },
        { id: "Rooms", en: "Rooms", te: "గదులు" },
        { id: "Mess", en: "Mess & Dining", te: "డైనింగ్ & మెస్" },
        { id: "Facilities", en: "Facilities", te: "సౌకర్యాలు" }
      ];

      filtersContainer.innerHTML = categories.map(c => `
        <button class="gallery-filter-btn ${this.galleryFilter === c.id ? 'active' : ''}" data-cat="${c.id}">
          ${isTe ? c.te : c.en}
        </button>
      `).join("");

      filtersContainer.querySelectorAll(".gallery-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.galleryFilter = btn.getAttribute("data-cat");
          this.renderGallery();
        });
      });
    }

    const items = this.galleryFilter === "All"
      ? cfg.gallery
      : cfg.gallery.filter(g => g.category === this.galleryFilter);

    // Prepare active lightbox list
    this.lightboxItems = items.map(g => ({
      image: g.image,
      title: isTe ? g.titleTe : g.title,
      caption: isTe ? g.captionTe : g.caption,
      category: isTe ? g.categoryTe : g.category
    }));

    container.innerHTML = items.map((item, index) => {
      const title = isTe ? item.titleTe : item.title;
      const cat = isTe ? item.categoryTe : item.category;
      const caption = isTe ? item.captionTe : item.caption;

      return `
        <div class="gallery-item" data-index="${index}">
          <div class="gallery-img-box">
            <img src="${item.thumb}" alt="${title}" loading="lazy" class="gallery-img">
            <div class="gallery-overlay">
              <span class="gallery-cat-pill">${cat}</span>
              <h4 class="gallery-item-title">${title}</h4>
              <p class="gallery-item-caption">${caption}</p>
              <button class="btn-lightbox-zoom" aria-label="View photo fullscreen">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".gallery-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10);
        this.openLightboxWithItems(this.lightboxItems, idx);
      });
    });
  },

  // 8. Lightbox with Touch Swipe Support
  setupLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".lightbox-close");
    const nextBtn = modal.querySelector(".lightbox-next");
    const prevBtn = modal.querySelector(".lightbox-prev");

    if (closeBtn) closeBtn.addEventListener("click", () => this.closeLightbox());
    if (nextBtn) nextBtn.addEventListener("click", () => this.stepLightbox(1));
    if (prevBtn) prevBtn.addEventListener("click", () => this.stepLightbox(-1));

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("lightbox-backdrop")) {
        this.closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("active")) return;
      if (e.key === "Escape") this.closeLightbox();
      if (e.key === "ArrowRight") this.stepLightbox(1);
      if (e.key === "ArrowLeft") this.stepLightbox(-1);
    });

    // Touch Swipe Gesture Detection for Mobile
    modal.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  },

  handleSwipe() {
    const threshold = 50; // minimum pixels for swipe
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped Left -> Next Photo
        this.stepLightbox(1);
      } else {
        // Swiped Right -> Previous Photo
        this.stepLightbox(-1);
      }
    }
  },

  openLightboxWithItems(items, startIndex = 0) {
    this.lightboxItems = items;
    this.lightboxIndex = startIndex;
    this.renderLightboxContent();

    const modal = document.getElementById("lightboxModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  renderLightboxContent() {
    const modal = document.getElementById("lightboxModal");
    if (!modal || !this.lightboxItems.length) return;

    const item = this.lightboxItems[this.lightboxIndex];
    const imgEl = modal.querySelector(".lightbox-img");
    const titleEl = modal.querySelector(".lightbox-title");
    const catEl = modal.querySelector(".lightbox-cat");
    const captionEl = modal.querySelector(".lightbox-caption-text");
    const counterEl = modal.querySelector(".lightbox-counter");

    if (imgEl) imgEl.setAttribute("src", item.image);
    if (titleEl) titleEl.textContent = item.title;
    if (catEl) catEl.textContent = item.category || "";
    if (captionEl) captionEl.textContent = item.caption || "";
    if (counterEl) {
      counterEl.textContent = `${this.lightboxIndex + 1} / ${this.lightboxItems.length}`;
    }
  },

  stepLightbox(dir) {
    if (!this.lightboxItems.length) return;
    const total = this.lightboxItems.length;
    this.lightboxIndex = (this.lightboxIndex + dir + total) % total;
    this.renderLightboxContent();
  },

  closeLightbox() {
    const modal = document.getElementById("lightboxModal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  },

  // 9. Rules Section
  renderRules() {
    const container = document.getElementById("rulesContainer");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    const timingsHtml = cfg.rules.timings.map(t => `
      <div class="rule-card rule-timing-card">
        <div class="rule-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <p class="rule-text">${isTe ? t.ruleTe : t.rule}</p>
      </div>
    `).join("");

    const visitorsHtml = cfg.rules.visitors.map(v => `
      <div class="rule-card rule-visitor-card">
        <div class="rule-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <p class="rule-text">${isTe ? v.ruleTe : v.rule}</p>
      </div>
    `).join("");

    const dosHtml = cfg.rules.dosAndDonts.filter(d => d.type === "do").map(d => `
      <li class="dos-item">
        <svg class="do-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${isTe ? d.textTe : d.text}</span>
      </li>
    `).join("");

    const dontsHtml = cfg.rules.dosAndDonts.filter(d => d.type === "dont").map(d => `
      <li class="donts-item">
        <svg class="dont-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span>${isTe ? d.textTe : d.text}</span>
      </li>
    `).join("");

    container.innerHTML = `
      <div class="rules-section-grid">
        <div class="rules-block">
          <div class="rules-block-header">
            <span class="block-badge timing-badge">⏰ ${isTe ? "సమయాలు & గేట్ పాలసీ" : "Gate & Timings"}</span>
          </div>
          <div class="rules-list">${timingsHtml}</div>
        </div>

        <div class="rules-block">
          <div class="rules-block-header">
            <span class="block-badge visitor-badge">👥 ${isTe ? "సందర్శకుల నిబంధనలు" : "Visitors Policy"}</span>
          </div>
          <div class="rules-list">${visitorsHtml}</div>
        </div>

        <div class="rules-block rules-dos-donts-block">
          <div class="rules-dos-col">
            <h4 class="dos-heading">✅ ${isTe ? "చేయవలసినవి (Do's)" : "Permitted & Encouraged (Do's)"}</h4>
            <ul class="dos-list">${dosHtml}</ul>
          </div>
          <div class="rules-donts-col">
            <h4 class="donts-heading">❌ ${isTe ? "ఖచ్చితంగా నిషేధం (Don'ts)" : "Strictly Prohibited (Don'ts)"}</h4>
            <ul class="donts-list">${dontsHtml}</ul>
          </div>
        </div>
      </div>
    `;
  },

  // 10. Landmarks
  renderLandmarks() {
    const tableBody = document.getElementById("landmarksTableBody");
    if (!tableBody) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    const getTypeIcon = (type) => {
      switch(type) {
        case "college": return "🎓";
        case "transport": return "🚌";
        case "medical": return "💊";
        case "grocery": return "🛒";
        case "hospital": return "🏥";
        default: return "📍";
      }
    };

    tableBody.innerHTML = cfg.landmarks.map(lm => {
      const name = isTe ? lm.nameTe : lm.name;
      const dist = isTe ? lm.distanceTe : lm.distance;
      const time = isTe ? lm.timeTe : lm.time;

      return `
        <tr>
          <td class="lm-name-cell">
            <span class="lm-icon">${getTypeIcon(lm.type)}</span>
            <strong>${name}</strong>
          </td>
          <td class="lm-dist-cell">${dist}</td>
          <td class="lm-time-cell">
            <span class="badge-time">🚶 ${time}</span>
          </td>
        </tr>
      `;
    }).join("");
  },

  // 11. Testimonials
  renderTestimonials() {
    const container = document.getElementById("testimonialsGrid");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    container.innerHTML = cfg.testimonials.map(t => {
      const name = isTe ? t.nameTe : t.name;
      const role = isTe ? t.roleTe : t.role;
      const quote = isTe ? t.quoteTe : t.quote;

      return `
        <div class="review-card">
          <div class="review-stars">
            ${'★'.repeat(t.rating)}
          </div>
          <p class="review-quote">“${quote}”</p>
          <div class="review-author">
            <div class="author-avatar">${t.avatar}</div>
            <div class="author-meta">
              <h4 class="author-name">${name}</h4>
              <span class="author-role">${role}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  // 12. FAQ Accordion
  renderFaqs() {
    const container = document.getElementById("faqAccordion");
    if (!container) return;
    const cfg = window.HOSTEL_CONFIG;
    const isTe = this.isTe();

    container.innerHTML = cfg.faqs.map((faq, index) => {
      const q = isTe ? faq.qTe : faq.q;
      const a = isTe ? faq.aTe : faq.a;
      const isOpen = index === 0;

      return `
        <div class="faq-item ${isOpen ? 'active' : ''}">
          <button class="faq-question-btn" aria-expanded="${isOpen ? 'true' : 'false'}" id="faqBtn${index}">
            <span class="faq-q-text">${q}</span>
            <span class="faq-toggle-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </button>
          <div class="faq-answer-pane" id="faqPane${index}" style="${isOpen ? 'max-height: 400px;' : 'max-height: 0px;'}">
            <p class="faq-a-text">${a}</p>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".faq-question-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const pane = item.querySelector(".faq-answer-pane");
        const isActive = item.classList.contains("active");

        container.querySelectorAll(".faq-item").forEach(other => {
          if (other !== item) {
            other.classList.remove("active");
            other.querySelector(".faq-question-btn").setAttribute("aria-expanded", "false");
            other.querySelector(".faq-answer-pane").style.maxHeight = "0px";
          }
        });

        if (isActive) {
          item.classList.remove("active");
          btn.setAttribute("aria-expanded", "false");
          pane.style.maxHeight = "0px";
        } else {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
          pane.style.maxHeight = pane.scrollHeight + 30 + "px";
        }
      });
    });
  },

  // 13. Navigation & Mobile Drawer
  setupNavigation() {
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenuDrawer");
    const backdrop = document.getElementById("menuBackdrop");

    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (isOpen) {
        mobileMenu.classList.remove("open");
        backdrop.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      } else {
        mobileMenu.classList.add("open");
        backdrop.classList.add("active");
        navToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
    };

    if (navToggle) navToggle.addEventListener("click", toggleMenu);
    if (backdrop) backdrop.addEventListener("click", toggleMenu);

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          toggleMenu();
        }
      });
    });

    const header = document.getElementById("siteHeader");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  },

  // 14. Booking Form & WhatsApp Pre-fill
  // 14. Booking Form & WhatsApp Pre-fill
  setupBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) return;

    const modal = document.getElementById("bookingSuccessModal");
    const closeSuccessBtn = document.getElementById("closeSuccessModal");
    const confirmWaBtn = document.getElementById("btnConfirmWhatsApp");
    const confirmWaText = document.getElementById("btnConfirmWhatsAppText");
    const modalDesc = document.getElementById("modalDescription");
    const modalTitle = document.getElementById("modalTitle");

    const submitBtn = document.getElementById("btnSubmitEnquiry");
    const btnSpinner = submitBtn ? submitBtn.querySelector(".btn-spinner") : null;
    const btnIcon = submitBtn ? submitBtn.querySelector(".btn-icon") : null;
    const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
    const originalBtnText = btnText ? btnText.textContent : "Send Booking via WhatsApp";

    const setButtonLoading = (loading, isTe) => {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (btnSpinner) btnSpinner.style.display = loading ? "inline-block" : "none";
      if (btnIcon) btnIcon.style.display = loading ? "none" : "inline-block";
      if (btnText) {
        btnText.textContent = loading
          ? (isTe ? "పంపుతోంది..." : "Sending...")
          : originalBtnText;
      }
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const isTe = this.isTe();

      // 1. Honeypot check (anti-bot)
      const honeypotVal = document.getElementById("formHoneypot")?.value.trim();
      if (honeypotVal) {
        console.warn("Spam honeypot triggered");
        form.reset();
        return;
      }

      // 2. Client-side rate limiting (1 submission per minute)
      const lastSubmit = localStorage.getItem("lastBookingSubmitTime");
      const now = Date.now();
      if (lastSubmit) {
        const elapsed = now - parseInt(lastSubmit, 10);
        if (elapsed < 60000) {
          const waitSec = Math.ceil((60000 - elapsed) / 1000);
          alert(
            isTe
              ? `దయచేసి మరొక విజ్ఞప్తి పంపే ముందు ${waitSec} సెకన్లు వేచి ఉండండి.`
              : `Please wait ${waitSec} seconds before submitting another booking request.`
          );
          return;
        }
      }

      // Form values
      const name = document.getElementById("studentName")?.value.trim() || "";
      const phone = document.getElementById("studentPhone")?.value.trim() || "";
      const parentPhone = document.getElementById("parentPhone")?.value.trim() || "";
      const yearBranch = document.getElementById("yearBranch")?.value.trim() || "";
      const roomPref = document.getElementById("roomPreference")?.value || "";
      const moveInDate = document.getElementById("moveInDate")?.value || "";
      const message = document.getElementById("specialMessage")?.value.trim() || "";

      // 3. Validation: 10-digit Indian phone, name, room type, move-in date required
      const phoneRegex = /^[6-9]\d{9}$/;

      if (name.length < 2) {
        alert(isTe ? "దయచేసి సరైన విద్యార్థి పేరును నమోదు చేయండి." : "Please enter student's full name.");
        document.getElementById("studentName")?.focus();
        return;
      }

      if (!phoneRegex.test(phone)) {
        alert(
          isTe
            ? "దయచేసి సరైన 10 అంకెల విద్యార్థి మొబైల్ నంబర్ నమోదు చేయండి (6-9 తో ప్రారంభం కావాలి)."
            : "Please enter a valid 10-digit Indian mobile number for the student."
        );
        document.getElementById("studentPhone")?.focus();
        return;
      }

      if (!phoneRegex.test(parentPhone)) {
        alert(
          isTe
            ? "దయచేసి సరైన 10 అంకెల తల్లిదండ్రుల మొబైల్ నంబర్ నమోదు చేయండి."
            : "Please enter a valid 10-digit parent/guardian mobile number."
        );
        document.getElementById("parentPhone")?.focus();
        return;
      }

      if (!roomPref) {
        alert(isTe ? "దయచేసి గది రకాన్ని ఎంచుకోండి." : "Please select your preferred room type.");
        document.getElementById("roomPreference")?.focus();
        return;
      }

      if (!moveInDate) {
        alert(isTe ? "దయచేసి చేరాలనుకుంటున్న తేదీని ఎంచుకోండి." : "Please select your expected move-in date.");
        document.getElementById("moveInDate")?.focus();
        return;
      }

      // Resolve room name and price from selection
      const roomMap = {
        "2-sharing": { name: "2 Sharing Executive Room", price: "₹7,000" },
        "3-sharing": { name: "3 Sharing Comfort Room", price: "₹5,000" },
        "4-sharing": { name: "4 Sharing Economy Room", price: "₹5,000" }
      };
      const roomDetails = roomMap[roomPref] || { name: roomPref, price: "₹5,000" };

      // Current formatted time (IST)
      const timeStr = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      // Check for pre-selected room and bed numbers
      const selectedRoom = document.getElementById("selectedRoomNumber")?.value.trim() || "";
      const selectedBed = document.getElementById("selectedBedNumber")?.value.trim() || "";
      const bedLine = (selectedRoom && selectedBed) ? `\n🔢 Bed Choice: Room ${selectedRoom} - Bed #${selectedBed}` : "";

      // Exact WhatsApp message format specified in requirements
      const waText =
        `🏠 New Booking - Sri Mallikarjuna Swami Boys PG\n` +
        `👤 Name: ${name}\n` +
        `📞 Phone: ${phone}\n` +
        `👨‍👩‍👦 Parent: ${parentPhone || "N/A"}\n` +
        `🛏️ Room: ${roomDetails.name} (${roomDetails.price}/month)` +
        bedLine + `\n` +
        `📅 Move-in: ${moveInDate}\n` +
        `🎓 Branch/Year: ${yearBranch || "N/A"}\n` +
        `💬 Message: ${message || "None"}\n` +
        `🕒 Time: ${timeStr}`;

      const cfg = window.HOSTEL_CONFIG || {};
      const ownerWhatsApp = cfg.contact?.whatsappNumber || "916309495985";
      const waUrl = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(waText)}`;

      // Setup payload for Google Apps Script
      const payload = {
        timestamp: timeStr,
        name: name,
        phone: phone,
        parentPhone: parentPhone,
        roomType: roomDetails.name,
        price: roomDetails.price,
        moveInDate: moveInDate,
        branchYear: yearBranch,
        message: message,
        roomNumber: selectedRoom,
        bedNumber: selectedBed,
        honeypot: honeypotVal || ""
      };

      const webhookUrl = cfg.bookingWebhookUrl;

      // Show spinner & disable button
      setButtonLoading(true, isTe);

      const openSuccessModal = (customDesc) => {
        if (confirmWaBtn) {
          confirmWaBtn.href = waUrl;
        }
        if (confirmWaText) {
          confirmWaText.textContent = isTe ? "వాట్సాప్‌లో నిర్ధారించండి" : "Confirm on WhatsApp";
        }
        if (modalTitle) {
          modalTitle.textContent = isTe ? "బుకింగ్ అభ్యర్థన అందింది!" : "Booking Request Received!";
        }
        if (modalDesc) {
          modalDesc.textContent = customDesc || (
            isTe
              ? "బుకింగ్ అభ్యర్థన అందింది! యజమాని త్వరలో మిమ్మల్ని సంప్రదిస్తారు."
              : "Booking request received! The owner will contact you shortly."
          );
        }
        if (modal) {
          modal.classList.add("active");
        }
      };

      const handleFallback = (reason) => {
        console.warn("Using WhatsApp fallback:", reason);
        // On any error, automatically open the same wa.me link as a fallback, so no booking is lost
        window.open(waUrl, "_blank", "noopener,noreferrer");
        localStorage.setItem("lastBookingSubmitTime", Date.now().toString());
        openSuccessModal(
          isTe
            ? "బుకింగ్ అభ్యర్థన అందింది! యజమాని త్వరలో మిమ్మల్ని సంప్రదిస్తారు."
            : "Booking request received! The owner will contact you shortly."
        );
      };

      // If webhook is not configured or placeholder, trigger fallback directly
      if (!webhookUrl || webhookUrl.includes("YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        setButtonLoading(false, isTe);
        handleFallback("Webhook URL not configured yet");
        return;
      }

      // Send to Google Apps Script Web App with 8s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
        .then(() => {
          clearTimeout(timeoutId);
          localStorage.setItem("lastBookingSubmitTime", Date.now().toString());
          openSuccessModal();
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          handleFallback(err);
        })
        .finally(() => {
          setButtonLoading(false, isTe);
        });
    });

    const clearBedBtn = document.getElementById("clearSelectedBedBtn");
    const selectedBedNotice = document.getElementById("selectedBedNotice");
    if (clearBedBtn) {
      clearBedBtn.addEventListener("click", () => {
        const roomInput = document.getElementById("selectedRoomNumber");
        const bedInput = document.getElementById("selectedBedNumber");
        if (roomInput) roomInput.value = "";
        if (bedInput) bedInput.value = "";
        if (selectedBedNotice) selectedBedNotice.style.display = "none";
      });
    }

    if (closeSuccessBtn && modal) {
      closeSuccessBtn.addEventListener("click", () => {
        modal.classList.remove("active");
        form.reset();
        const roomInput = document.getElementById("selectedRoomNumber");
        const bedInput = document.getElementById("selectedBedNumber");
        if (roomInput) roomInput.value = "";
        if (bedInput) bedInput.value = "";
        if (selectedBedNotice) selectedBedNotice.style.display = "none";
      });
    }
  },

  // 14b. Room & Bed Availability (Public Section)
  bedsData: null,
  bedAvailabilityFilter: "all",
  bedAvailabilityEmptyOnly: false,

  async setupBedAvailability() {
    const retryBtn = document.getElementById("btnRetryAvailability");
    const tabs = document.querySelectorAll(".avail-tab-btn");
    const toggle = document.getElementById("toggleEmptyOnly");

    if (retryBtn) {
      retryBtn.addEventListener("click", () => this.fetchAndRenderBeds());
    }

    if (tabs) {
      tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
          tabs.forEach(t => {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
          });
          tab.classList.add("active");
          tab.setAttribute("aria-selected", "true");
          this.bedAvailabilityFilter = tab.getAttribute("data-filter") || "all";
          this.renderBedAvailability();
        });
      });
    }

    if (toggle) {
      toggle.addEventListener("change", (e) => {
        this.bedAvailabilityEmptyOnly = !!e.target.checked;
        this.renderBedAvailability();
      });
    }

    // Real-time synchronization with Admin portal updates
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.bedSyncChannel = new BroadcastChannel("hostel_beds_sync");
        this.bedSyncChannel.onmessage = (e) => {
          if (e.data?.type === "BEDS_UPDATED" && Array.isArray(e.data.beds)) {
            this.bedsData = e.data.beds;
            this.renderBedAvailability();
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel error:", err);
      }
    }

    // Listen for storage events across tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "hostel_beds_v1" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated) && updated.length > 0) {
            this.bedsData = updated;
            this.renderBedAvailability();
          }
        } catch (err) {}
      }
    });

    // Re-check when window gains focus or tab becomes active
    window.addEventListener("focus", () => this.syncLocalBedsIfUpdated());
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.syncLocalBedsIfUpdated();
    });

    await this.fetchAndRenderBeds();
  },

  syncLocalBedsIfUpdated() {
    const localBeds = localStorage.getItem("hostel_beds_v1");
    if (localBeds) {
      try {
        const parsed = JSON.parse(localBeds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.bedsData = parsed;
          this.renderBedAvailability();
        }
      } catch (e) {}
    }
  },

  async fetchAndRenderBeds() {
    const grid = document.getElementById("availRoomsGrid");
    const errState = document.getElementById("availErrorState");
    if (!grid) return;

    // Check if there are updated bed records from the admin in localStorage
    const localBeds = localStorage.getItem("hostel_beds_v1");
    let hasLocal = false;
    if (localBeds) {
      try {
        const parsed = JSON.parse(localBeds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.bedsData = parsed;
          hasLocal = true;
          this.renderBedAvailability();
        }
      } catch (e) {
        console.warn("Could not parse hostel_beds_v1", e);
      }
    }

    if (!hasLocal) {
      if (errState) errState.style.display = "none";
      grid.style.display = "grid";
      grid.innerHTML = `
        <div class="avail-skeleton-card"></div>
        <div class="avail-skeleton-card"></div>
        <div class="avail-skeleton-card"></div>
        <div class="avail-skeleton-card"></div>
      `;
    }

    try {
      let response;
      try {
        response = await fetch("data/beds.json", { cache: "no-store" });
        if (!response.ok) throw new Error("HTTP " + response.status);
      } catch (err1) {
        response = await fetch("public/data/beds.json", { cache: "no-store" });
      }

      if (!response.ok) throw new Error("Could not load beds data");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid beds data");

      // If no local modifications exist, use fetched data
      if (!hasLocal) {
        this.bedsData = data;
        this.renderBedAvailability();
      }
    } catch (err) {
      if (!hasLocal) {
        console.error("Failed to load bed availability:", err);
        grid.style.display = "none";
        if (errState) errState.style.display = "block";
      }
    }
  },

  renderBedAvailability() {
    const grid = document.getElementById("availRoomsGrid");
    const cfg = window.HOSTEL_CONFIG;
    if (!grid || !this.bedsData || !cfg) return;

    const isTe = this.isTe();
    const inventory = cfg.inventory || {};
    const roomDefs = inventory.rooms || [];

    // Group beds by room
    const bedsByRoom = {};
    let newestUpdate = null;
    let totalAvail = 0;
    const availByType = {
      "2-sharing": 0,
      "3-sharing": 0,
      "4-sharing": 0
    };

    this.bedsData.forEach(item => {
      const roomNum = item.room.toString();
      if (!bedsByRoom[roomNum]) bedsByRoom[roomNum] = [];
      bedsByRoom[roomNum].push(item);

      if (item.status === "available") {
        totalAvail++;
        if (item.type.includes("2")) availByType["2-sharing"]++;
        else if (item.type.includes("3")) availByType["3-sharing"]++;
        else if (item.type.includes("4")) availByType["4-sharing"]++;
      }

      if (item.updatedAt) {
        const itemDate = new Date(item.updatedAt);
        if (!newestUpdate || itemDate > newestUpdate) {
          newestUpdate = itemDate;
        }
      }
    });

    // Update Summary Bar
    const totalCountEl = document.getElementById("totalAvailCount");
    if (totalCountEl) totalCountEl.textContent = totalAvail;

    const count2El = document.getElementById("availCount2");
    if (count2El) count2El.textContent = `${availByType["2-sharing"]} / 2`;

    const count3El = document.getElementById("availCount3");
    if (count3El) count3El.textContent = `${availByType["3-sharing"]} / 15`;

    const count4El = document.getElementById("availCount4");
    if (count4El) count4El.textContent = `${availByType["4-sharing"]} / 32`;

    const lastUpdatedEl = document.getElementById("lastUpdatedDate");
    if (lastUpdatedEl) {
      if (newestUpdate && !isNaN(newestUpdate.getTime())) {
        lastUpdatedEl.textContent = newestUpdate.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      } else {
        lastUpdatedEl.textContent = "Recently";
      }
    }

    // Filter room definitions
    let filteredRooms = roomDefs.filter(r => {
      // Filter by type
      if (this.bedAvailabilityFilter !== "all" && r.typeId !== this.bedAvailabilityFilter) {
        return false;
      }
      // Filter by empty only toggle
      if (this.bedAvailabilityEmptyOnly) {
        const roomBeds = bedsByRoom[r.room] || [];
        const hasAvail = roomBeds.some(b => b.status === "available");
        if (!hasAvail) return false;
      }
      return true;
    });

    if (filteredRooms.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">
            ${isTe ? "ఈ ఫిల్టర్‌లో గదులు లేవు" : "No rooms match this filter"}
          </p>
          <p style="font-size: 0.9rem;">
            ${isTe ? "దయచేసి 'అన్ని గదులు' ఎంచుకోండి లేదా టోగుల్‌ను ఆఫ్ చేయండి." : "Please select 'All' or toggle off 'Show only rooms with empty beds'."}
          </p>
        </div>
      `;
      return;
    }

    // Render Room Cards
    const cardsHtml = filteredRooms.map(r => {
      const roomBeds = bedsByRoom[r.room] || [];
      const availBedsCount = roomBeds.filter(b => b.status === "available").length;
      const isFull = (availBedsCount === 0);

      const roomBadgeHtml = isFull
        ? `<span class="avail-room-badge badge-full">${isTe ? "పూర్తిగా నిండింది" : "Full"}</span>`
        : `<span class="avail-room-badge badge-available">${availBedsCount} ${availBedsCount === 1 ? (isTe ? "బెడ్ ఖాళీగా ఉంది" : "bed available") : (isTe ? "బెడ్లు ఖాళీగా ఉన్నాయి" : "beds available")}</span>`;

      // Build Beds HTML
      const bedsHtml = roomBeds.map(b => {
        const status = b.status || "available";
        let statusLabel = isTe ? "అందుబాటులో ఉంది" : "Available";
        if (status === "occupied") statusLabel = isTe ? "నిండిపోయింది" : "Occupied";
        if (status === "reserved") statusLabel = isTe ? "రిజర్వ్ చేయబడింది" : "Reserved";

        const bookBtnHtml = (status === "available")
          ? `<button type="button" class="btn-book-bed" data-room="${r.room}" data-bed="${b.bed}" data-type="${r.type}" data-type-id="${r.typeId}">
               ${isTe ? "ఈ బెడ్ బుక్ చేయండి" : "Book This Bed"}
             </button>`
          : ``;

        return `
          <div class="avail-bed-item status-${status}">
            <div class="avail-bed-info">
              <svg class="bed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
              </svg>
              <div>
                <span class="bed-name">Bed ${b.bed}</span>
                <span class="bed-status-pill">${statusLabel}</span>
              </div>
            </div>
            ${bookBtnHtml}
          </div>
        `;
      }).join("");

      return `
        <div class="avail-room-card" data-room="${r.room}" data-type="${r.typeId}">
          <div class="avail-room-header">
            <div class="avail-room-title-wrap">
              <span class="avail-room-number">🚪 Room ${r.room}</span>
              <span class="avail-room-type">${r.title || r.type}</span>
            </div>
            <div style="text-align: right;">
              ${roomBadgeHtml}
              <div class="avail-room-price">₹${r.price.toLocaleString("en-IN")}/mo</div>
            </div>
          </div>
          <div class="avail-beds-list">
            ${bedsHtml}
          </div>
        </div>
      `;
    }).join("");

    grid.innerHTML = cardsHtml;

    // Attach "Book this bed" listeners
    grid.querySelectorAll(".btn-book-bed").forEach(btn => {
      btn.addEventListener("click", () => {
        const room = btn.getAttribute("data-room");
        const bed = btn.getAttribute("data-bed");
        const type = btn.getAttribute("data-type");
        const typeId = btn.getAttribute("data-type-id");
        this.selectBedForBooking(room, bed, type, typeId);
      });
    });
  },

  selectBedForBooking(room, bed, type, typeId) {
    const roomInput = document.getElementById("selectedRoomNumber");
    const bedInput = document.getElementById("selectedBedNumber");
    const notice = document.getElementById("selectedBedNotice");
    const noticeText = document.getElementById("selectedBedText");
    const roomPrefSelect = document.getElementById("roomPreference");
    const isTe = this.isTe();

    if (roomInput) roomInput.value = room;
    if (bedInput) bedInput.value = bed;

    if (noticeText) {
      noticeText.textContent = isTe
        ? `ఎంచుకున్న బెడ్: రూమ్ ${room} - బెడ్ #${bed} (${type})`
        : `Selected: Room ${room} - Bed #${bed} (${type})`;
    }

    if (notice) {
      notice.style.display = "block";
    }

    if (roomPrefSelect && typeId) {
      roomPrefSelect.value = typeId;
    }

    // Scroll to booking form
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      const headerOffset = 70;
      const elementPosition = bookingSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    // Focus student name field after scroll
    setTimeout(() => {
      const nameInput = document.getElementById("studentName");
      if (nameInput) nameInput.focus();
    }, 600);
  },

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        if (href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      });
    });
  }
};

// Global Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.ThemeManager.init();
  window.I18N.init();
  window.App.init();

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = btn.getAttribute("data-lang");
      window.I18N.setLanguage(lang);
    });
  });

  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.ThemeManager.toggle();
    });
  });
});
