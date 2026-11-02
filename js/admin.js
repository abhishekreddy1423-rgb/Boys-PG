/**
 * Warden Bed Management Portal Logic
 * Sri Mallikarjuna Swami The Boys PG (Near MITS College, Angallu)
 *
 * Privacy & Architecture:
 * - Public beds.json contains ONLY: room, type, bed, status, updatedAt.
 *   STUDENT NAMES AND PHONE NUMBERS ARE NEVER EXPORTED TO BEDS.JSON.
 * - Private student records are stored separately in localStorage:
 *   - "hostel_students_v1": Current active occupants & reservations
 *   - "hostel_past_students_v1": Past students history with exit dates
 *   - "hostel_beds_v1": Bed status inventory
 *   - "hostel_beds_log_v1": Activity log of last 100 changes
 */

window.AdminPortal = {
  currentStatusFilter: "all",
  currentTypeFilter: "all",
  searchQuery: "",
  beds: [],
  students: {}, // Keyed by `${room}_${bed}`
  pastStudents: [],
  logs: [],
  publishedBedsJson: null,
  pendingAction: null,

  failedAttempts: 0,
  lockoutTimer: null,

  async init() {
    this.checkSession();
    this.bindLoginEvents();
  },

  // ==============================================================
  // 1. Password & Authentication (30 min Session)
  // ==============================================================
  async hashPassword(plainText) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  },

  checkSession() {
    const sessionStr = sessionStorage.getItem("hostel_admin_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const elapsed = Date.now() - (session.timestamp || 0);
        const thirtyMinutes = 30 * 60 * 1000;
        if (session.authenticated && elapsed < thirtyMinutes) {
          this.showDashboard();
          return;
        }
      } catch (e) {
        sessionStorage.removeItem("hostel_admin_session");
      }
    }
    this.showLogin();
  },

  startLockoutCountdown(seconds) {
    const input = document.getElementById("adminPasswordInput");
    const submitBtn = document.querySelector("#adminLoginForm button[type='submit']");
    const errBox = document.getElementById("adminLoginError");

    if (input) input.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    let remaining = Math.max(1, Math.round(seconds));
    if (errBox) {
      errBox.textContent = `Incorrect password. Login locked for ${remaining} seconds.`;
      errBox.style.display = "block";
    }

    if (this.lockoutTimer) clearInterval(this.lockoutTimer);
    this.lockoutTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(this.lockoutTimer);
        this.lockoutTimer = null;
        this.failedAttempts = 0;
        sessionStorage.removeItem("hostel_admin_lockout_until");
        sessionStorage.removeItem("hostel_admin_failed_attempts");
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (submitBtn) submitBtn.disabled = false;
        if (errBox) errBox.style.display = "none";
      } else {
        if (errBox) {
          errBox.textContent = `Incorrect password. Login locked for ${remaining} seconds.`;
        }
      }
    }, 1000);
  },

  bindLoginEvents() {
    const form = document.getElementById("adminLoginForm");
    const input = document.getElementById("adminPasswordInput");
    const errBox = document.getElementById("adminLoginError");
    const toggleBtn = document.getElementById("togglePasswordBtn");

    // Check existing lockout state in sessionStorage
    const savedLockout = sessionStorage.getItem("hostel_admin_lockout_until");
    if (savedLockout) {
      const remaining = Math.round((Number(savedLockout) - Date.now()) / 1000);
      if (remaining > 0) {
        this.startLockoutCountdown(remaining);
      } else {
        sessionStorage.removeItem("hostel_admin_lockout_until");
        sessionStorage.removeItem("hostel_admin_failed_attempts");
        this.failedAttempts = 0;
      }
    } else {
      const savedAttempts = sessionStorage.getItem("hostel_admin_failed_attempts");
      this.failedAttempts = savedAttempts ? Number(savedAttempts) || 0 : 0;
    }

    // Show / Hide password eye toggle
    if (toggleBtn && input) {
      toggleBtn.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        toggleBtn.innerHTML = isPassword ? `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ` : `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check if currently locked out
        const lockoutUntil = sessionStorage.getItem("hostel_admin_lockout_until");
        if (lockoutUntil && Date.now() < Number(lockoutUntil)) {
          const waitSecs = Math.ceil((Number(lockoutUntil) - Date.now()) / 1000);
          if (errBox) {
            errBox.textContent = `Incorrect password. Login locked for ${waitSecs} seconds.`;
            errBox.style.display = "block";
          }
          return;
        }

        const pwd = input.value;
        if (!pwd) return;

        const hash = await this.hashPassword(pwd);
        const cfg = window.HOSTEL_CONFIG || {};
        const expectedHash = window.ADMIN_PASSWORD_HASH || cfg.inventory?.adminPasswordHash || "a79b44494ba830b7e8506959e9ca4fcefea074685f4c798ead557f704eed76da";

        if (hash === expectedHash) {
          // Reset lockout & attempts
          this.failedAttempts = 0;
          sessionStorage.removeItem("hostel_admin_failed_attempts");
          sessionStorage.removeItem("hostel_admin_lockout_until");
          if (this.lockoutTimer) {
            clearInterval(this.lockoutTimer);
            this.lockoutTimer = null;
          }

          sessionStorage.setItem("hostel_admin_session", JSON.stringify({
            authenticated: true,
            timestamp: Date.now()
          }));
          input.value = "";
          if (errBox) errBox.style.display = "none";
          this.showDashboard();
        } else {
          this.failedAttempts++;
          sessionStorage.setItem("hostel_admin_failed_attempts", this.failedAttempts);

          if (this.failedAttempts >= 5) {
            const lockoutTime = Date.now() + 30000;
            sessionStorage.setItem("hostel_admin_lockout_until", lockoutTime);
            this.startLockoutCountdown(30);
          } else {
            if (errBox) {
              errBox.textContent = "Incorrect password";
              errBox.style.display = "block";
            }
            input.focus();
          }
        }
      });
    }

    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("hostel_admin_session");
        this.showLogin();
      });
    }
  },

  showLogin() {
    const loginScreen = document.getElementById("loginScreen");
    const dashboardScreen = document.getElementById("dashboardScreen");
    if (loginScreen) loginScreen.style.display = "flex";
    if (dashboardScreen) dashboardScreen.style.display = "none";
  },

  async showDashboard() {
    const loginScreen = document.getElementById("loginScreen");
    const dashboardScreen = document.getElementById("dashboardScreen");
    if (loginScreen) loginScreen.style.display = "none";
    if (dashboardScreen) dashboardScreen.style.display = "block";

    await this.loadData();
    this.bindDashboardEvents();
    this.render();
  },

  // ==============================================================
  // 2. Data Loading & Persistence
  // ==============================================================
  async loadData() {
    // 1. Fetch published beds.json to detect unpublished changes
    try {
      let resp = await fetch("../data/beds.json", { cache: "no-store" });
      if (!resp.ok) resp = await fetch("../public/data/beds.json", { cache: "no-store" });
      if (!resp.ok) resp = await fetch("data/beds.json", { cache: "no-store" });
      if (resp.ok) {
        this.publishedBedsJson = await resp.text();
      }
    } catch (e) {
      console.warn("Could not fetch published beds.json for comparison", e);
    }

    // 2. Load beds status from localStorage
    const localBeds = localStorage.getItem("hostel_beds_v1");
    if (localBeds) {
      try {
        this.beds = JSON.parse(localBeds);
      } catch (e) {
        console.error("Corrupted hostel_beds_v1", e);
      }
    }

    // First load fallback from published beds.json
    if (!this.beds || !Array.isArray(this.beds) || this.beds.length === 0) {
      if (this.publishedBedsJson) {
        try {
          this.beds = JSON.parse(this.publishedBedsJson);
          localStorage.setItem("hostel_beds_v1", JSON.stringify(this.beds));
        } catch (e) {
          console.error("Error parsing published beds.json", e);
        }
      }
    }

    // 3. Load active students
    const localStudents = localStorage.getItem("hostel_students_v1");
    if (localStudents) {
      try {
        this.students = JSON.parse(localStudents) || {};
      } catch (e) {
        this.students = {};
      }
    } else {
      this.students = {};
    }

    // 4. Load past students
    const localPast = localStorage.getItem("hostel_past_students_v1");
    if (localPast) {
      try {
        this.pastStudents = JSON.parse(localPast) || [];
      } catch (e) {
        this.pastStudents = [];
      }
    } else {
      this.pastStudents = [];
    }

    // 5. Load activity log
    const localLogs = localStorage.getItem("hostel_beds_log_v1");
    if (localLogs) {
      try {
        this.logs = JSON.parse(localLogs) || [];
      } catch (e) {
        this.logs = [];
      }
    } else {
      this.logs = [];
    }
  },

  saveData() {
    localStorage.setItem("hostel_beds_v1", JSON.stringify(this.beds));
    localStorage.setItem("hostel_students_v1", JSON.stringify(this.students));
    localStorage.setItem("hostel_past_students_v1", JSON.stringify(this.pastStudents));
    localStorage.setItem("hostel_beds_log_v1", JSON.stringify(this.logs));

    // Broadcast instant real-time update to public website tabs
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const channel = new BroadcastChannel("hostel_beds_sync");
        channel.postMessage({ type: "BEDS_UPDATED", beds: this.beds });
        channel.close();
      } catch (e) {}
    }

    this.checkUnpublishedChanges();
    this.render();
  },

  checkUnpublishedChanges() {
    const banner = document.getElementById("unpublishedBanner");
    if (!banner) return;

    if (!this.publishedBedsJson) {
      banner.style.display = "none";
      return;
    }

    try {
      const pubBeds = JSON.parse(this.publishedBedsJson);
      const isDifferent = this.beds.some(b => {
        const pub = pubBeds.find(p => p.room.toString() === b.room.toString() && Number(p.bed) === Number(b.bed));
        return !pub || pub.status !== b.status;
      });

      banner.style.display = isDifferent ? "flex" : "none";
    } catch (e) {
      banner.style.display = "none";
    }
  },

  // Helper to log changes (last 100)
  logActivity(room, bed, action, studentName, details) {
    this.logs.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      room: room,
      bed: bed,
      action: action, // Allotted | Vacated | Reserved | Moved | Mark Occupied
      studentName: studentName || "N/A",
      details: details || ""
    });

    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }

    localStorage.setItem("hostel_beds_log_v1", JSON.stringify(this.logs));
  },

  getStudent(room, bed) {
    return this.students[`${room}_${bed}`] || null;
  },

  // ==============================================================
  // 3. Owner Flow 1: Allot a Bed (New Student Joins)
  // ==============================================================
  openAllotModal(room, bed, defaultStatus = "occupied") {
    const modal = document.getElementById("allotModal");
    const cfg = window.HOSTEL_CONFIG || {};
    const roomDefs = cfg.inventory?.rooms || [];
    const rDef = roomDefs.find(r => r.room.toString() === room.toString()) || { type: "3 Sharing", price: 5000 };

    document.getElementById("allotRoomBedDisplay").textContent = `Room ${room} - Bed #${bed} (${rDef.title || rDef.type})`;
    document.getElementById("allotRoom").value = room;
    document.getElementById("allotBed").value = bed;

    // Check if this bed already had reservation details
    const existing = this.getStudent(room, bed);
    document.getElementById("allotName").value = existing?.studentName || "";
    document.getElementById("allotPhone").value = existing?.studentPhone || "";
    document.getElementById("allotParentPhone").value = existing?.parentPhone || "";
    document.getElementById("allotJoinDate").value = existing?.joinDate || new Date().toISOString().split("T")[0];
    document.getElementById("allotRent").value = existing?.monthlyRent || rDef.price;
    document.getElementById("allotAdvance").value = existing?.advancePaid || "";

    const statusSelect = document.getElementById("allotStatusChoice");
    if (statusSelect) {
      statusSelect.value = (defaultStatus === "reserved" || existing?.isReserved) ? "reserved" : "occupied";
    }

    if (modal) modal.classList.add("active");
    setTimeout(() => document.getElementById("allotName")?.focus(), 150);
  },

  handleAllotSubmit(e) {
    e.preventDefault();
    const room = document.getElementById("allotRoom").value;
    const bed = Number(document.getElementById("allotBed").value);
    const name = document.getElementById("allotName").value.trim();
    const phone = document.getElementById("allotPhone").value.trim();
    const parentPhone = document.getElementById("allotParentPhone").value.trim();
    const joinDate = document.getElementById("allotJoinDate").value;
    const rent = Number(document.getElementById("allotRent").value) || 5000;
    const advance = Number(document.getElementById("allotAdvance").value) || 0;
    const statusChoice = document.getElementById("allotStatusChoice")?.value || "occupied";

    if (!name) {
      alert("Please enter student name.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit student phone number (starts with 6, 7, 8, or 9).");
      return;
    }

    const bedObj = this.beds.find(b => b.room.toString() === room.toString() && Number(b.bed) === bed);
    if (!bedObj) return;

    const isReserved = (statusChoice === "reserved");
    bedObj.status = isReserved ? "reserved" : "occupied";
    bedObj.updatedAt = new Date().toISOString();

    const studentRecord = {
      room: room,
      bed: bed,
      studentName: name,
      studentPhone: phone,
      parentPhone: parentPhone,
      joinDate: joinDate,
      monthlyRent: rent,
      advancePaid: advance,
      isReserved: isReserved,
      allottedAt: new Date().toISOString()
    };

    this.students[`${room}_${bed}`] = studentRecord;
    this.logActivity(room, bed, isReserved ? "Reserved" : "Allotted", name, `Rent: ₹${rent}, Adv: ₹${advance}`);
    this.saveData();
    this.closeModals();
    this.showToast(`✓ Room ${room} Bed #${bed} ${isReserved ? "Reserved for" : "Allotted to"} ${name}`);
  },

  // Quick shortcut: Mark Occupied skipping details form
  quickMarkOccupied(room, bed) {
    const bedObj = this.beds.find(b => b.room.toString() === room.toString() && Number(b.bed) === Number(bed));
    if (!bedObj) return;

    bedObj.status = "occupied";
    bedObj.updatedAt = new Date().toISOString();

    this.students[`${room}_${bed}`] = {
      room: room,
      bed: bed,
      studentName: "Occupied (Quick Check-in)",
      studentPhone: "",
      parentPhone: "",
      joinDate: new Date().toISOString().split("T")[0],
      monthlyRent: 5000,
      advancePaid: 0,
      isReserved: false,
      allottedAt: new Date().toISOString()
    };

    this.logActivity(room, bed, "Marked Occupied", "Quick Check-in", "Owner quick shortcut");
    this.saveData();
    this.showToast(`✓ Room ${room} Bed #${bed} marked Occupied.`);
  },

  // ==============================================================
  // 4. Owner Flow 2: Vacate a Bed (Student Leaves)
  // ==============================================================
  openOccupiedDetailsModal(room, bed) {
    const modal = document.getElementById("occupiedModal");
    const student = this.getStudent(room, bed);
    const content = document.getElementById("occupiedModalContent");
    if (!modal || !content) return;

    const studentName = student?.studentName || "Occupied (No details saved)";
    const studentPhone = student?.studentPhone || "Not provided";
    const parentPhone = student?.parentPhone || "Not provided";
    const joinDate = student?.joinDate || "N/A";
    const rent = student?.monthlyRent ? `₹${Number(student.monthlyRent).toLocaleString("en-IN")}/mo` : "Standard";
    const advance = student?.advancePaid ? `₹${Number(student.advancePaid).toLocaleString("en-IN")}` : "None";

    content.innerHTML = `
      <div style="background:var(--bg-alt); padding:16px; border-radius:var(--radius-md); margin-bottom:20px; border:1px solid var(--border-light);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; font-size:1.2rem; color:var(--text-main);">Room ${room} - Bed #${bed}</h4>
          <span class="admin-status-tag status-occupied">Occupied</span>
        </div>
        <p style="margin:4px 0; font-size:1rem; font-weight:700; color:var(--text-main);">👤 ${studentName}</p>
        <p style="margin:4px 0; font-size:0.9rem; color:var(--text-secondary);">
          📞 Student Phone: ${studentPhone !== "Not provided" ? `<a href="tel:+91${studentPhone}" style="color:var(--primary-blue); font-weight:600;">+91 ${studentPhone}</a> &bull; <a href="https://wa.me/91${studentPhone}" target="_blank" style="color:var(--emerald-green); font-weight:600;">WhatsApp</a>` : studentPhone}
        </p>
        <p style="margin:4px 0; font-size:0.9rem; color:var(--text-secondary);">
          👨‍👩‍👦 Parent Phone: ${parentPhone !== "Not provided" ? `<a href="tel:+91${parentPhone}" style="color:var(--primary-blue); font-weight:600;">+91 ${parentPhone}</a>` : parentPhone}
        </p>
        <p style="margin:4px 0; font-size:0.85rem; color:var(--text-muted);">
          📅 Joined on: <strong>${joinDate}</strong> &bull; 💵 Rent: <strong>${rent}</strong> &bull; 💰 Advance: <strong>${advance}</strong>
        </p>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <button type="button" class="admin-btn admin-btn-danger" style="width:100%;" onclick="window.AdminPortal.confirmVacate('${room}', ${bed}, '${studentName.replace(/'/g, "\\'")}')">
          <span>🚪 Student Left - Make Bed Available</span>
        </button>

        <div style="display:flex; gap:10px;">
          <button type="button" class="admin-btn admin-btn-secondary" style="flex:1;" onclick="window.AdminPortal.openMoveStudentModal('${room}', ${bed})">
            <span>🔄 Move Student</span>
          </button>
          <button type="button" class="admin-btn admin-btn-outline" style="flex:1;" onclick="window.AdminPortal.editStudentDetails('${room}', ${bed})">
            <span>✏️ Edit Details</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add("active");
  },

  confirmVacate(room, bed, studentName) {
    this.closeModals();
    this.openConfirmModal(
      `Vacate Bed?`,
      `Room <strong>${room}</strong>, Bed <strong>#${bed}</strong> - <strong>${studentName}</strong> will be marked as left. Continue?`,
      () => {
        this.vacateBed(room, bed);
      }
    );
  },

  vacateBed(room, bed) {
    const bedObj = this.beds.find(b => b.room.toString() === room.toString() && Number(b.bed) === Number(bed));
    if (!bedObj) return;

    const student = this.getStudent(room, bed);
    const studentName = student?.studentName || "Student";

    // Set bed to Available
    bedObj.status = "available";
    bedObj.updatedAt = new Date().toISOString();

    // Move to past students
    if (student) {
      this.pastStudents.unshift({
        ...student,
        leftAt: new Date().toISOString()
      });
      delete this.students[`${room}_${bed}`];
    }

    this.logActivity(room, bed, "Vacated", studentName, "Student left hostel");
    this.saveData();
    this.showToast(`✓ Room ${room} Bed #${bed} marked Available. ${studentName} moved to Past Students.`);
  },

  editStudentDetails(room, bed) {
    this.closeModals();
    this.openAllotModal(room, bed, "occupied");
  },

  // ==============================================================
  // 5. Owner Flow 3: Reserve & Move Student
  // ==============================================================
  openMoveStudentModal(fromRoom, fromBed) {
    this.closeModals();
    const modal = document.getElementById("moveModal");
    const container = document.getElementById("moveModalContent");
    const student = this.getStudent(fromRoom, fromBed);
    if (!modal || !container) return;

    const studentName = student?.studentName || "Student";

    // Find all currently available beds
    const availBeds = this.beds.filter(b => b.status === "available");

    if (availBeds.length === 0) {
      container.innerHTML = `
        <h3 class="admin-modal-title">Move Student</h3>
        <p class="admin-modal-desc" style="color:var(--rose-red);">No other beds are currently available in the hostel.</p>
        <div class="admin-modal-footer">
          <button type="button" class="admin-btn admin-btn-outline btn-modal-close">Close</button>
        </div>
      `;
      modal.classList.add("active");
      return;
    }

    container.innerHTML = `
      <h3 class="admin-modal-title">Move Student to Another Bed</h3>
      <p class="admin-modal-desc">
        Select a new destination bed for <strong>${studentName}</strong> (Currently in Room ${fromRoom} - Bed #${fromBed}).
        The old bed will automatically become Available.
      </p>

      <form id="moveStudentForm" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="display:block; margin-bottom:6px; font-size:0.85rem; font-weight:600; color:var(--text-secondary);">Select Destination Bed:</label>
          <select id="moveTargetBed" class="admin-input" required>
            ${availBeds.map(b => `
              <option value="${b.room}_${b.bed}">
                Room ${b.room} - Bed #${b.bed} (${b.type})
              </option>
            `).join("")}
          </select>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="admin-btn admin-btn-outline btn-modal-close" onclick="window.AdminPortal.closeModals()">Cancel</button>
          <button type="submit" class="admin-btn admin-btn-primary">Confirm Bed Transfer &rarr;</button>
        </div>
      </form>
    `;

    document.getElementById("moveStudentForm").onsubmit = (e) => {
      e.preventDefault();
      const targetVal = document.getElementById("moveTargetBed").value;
      const [toRoom, toBed] = targetVal.split("_");
      this.closeModals();
      this.moveStudent(fromRoom, fromBed, toRoom, Number(toBed));
    };

    modal.classList.add("active");
  },

  moveStudent(fromRoom, fromBed, toRoom, toBed) {
    const oldBedObj = this.beds.find(b => b.room.toString() === fromRoom.toString() && Number(b.bed) === Number(fromBed));
    const newBedObj = this.beds.find(b => b.room.toString() === toRoom.toString() && Number(b.bed) === Number(toBed));
    if (!oldBedObj || !newBedObj) return;

    const student = this.getStudent(fromRoom, fromBed);
    const studentName = student?.studentName || "Student";

    // 1. Free old bed
    oldBedObj.status = "available";
    oldBedObj.updatedAt = new Date().toISOString();

    // 2. Occupy new bed
    newBedObj.status = "occupied";
    newBedObj.updatedAt = new Date().toISOString();

    // 3. Move student record
    if (student) {
      delete this.students[`${fromRoom}_${fromBed}`];
      student.room = toRoom;
      student.bed = toBed;
      this.students[`${toRoom}_${toBed}`] = student;
    }

    this.logActivity(
      `${fromRoom}➔${toRoom}`,
      `${fromBed}➔${toBed}`,
      "Moved",
      studentName,
      `Shifted from Room ${fromRoom} Bed #${fromBed} to Room ${toRoom} Bed #${toBed}`
    );

    this.saveData();
    this.showToast(`✓ ${studentName} moved to Room ${toRoom} Bed #${toBed}.`);
  },

  // ==============================================================
  // 6. Currently Available Beds Quick List (Owner Enquiry Tool)
  // ==============================================================
  openAvailableBedsDrawer() {
    const modal = document.getElementById("availableBedsModal");
    const container = document.getElementById("availableBedsContent");
    if (!modal || !container) return;

    const availBeds = this.beds.filter(b => b.status === "available");
    const cfg = window.HOSTEL_CONFIG || {};
    const roomDefs = cfg.inventory?.rooms || [];

    // Group by sharing type
    const byType = { "2 Sharing": [], "3 Sharing": [], "4 Sharing": [] };
    availBeds.forEach(b => {
      if (b.type.includes("2")) byType["2 Sharing"].push(b);
      else if (b.type.includes("3")) byType["3 Sharing"].push(b);
      else if (b.type.includes("4")) byType["4 Sharing"].push(b);
    });

    if (availBeds.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:30px; color:var(--rose-red);">
          <h3>No Beds Currently Available</h3>
          <p>The hostel is currently 100% full (49/49 beds occupied or reserved).</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="margin-bottom:16px;">
          <h4 style="margin:0 0 4px 0; font-size:1.2rem; color:var(--text-main);">
            ⚡ Quick Vacancy Finder (${availBeds.length} Available)
          </h4>
          <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">
            Tap any available bed below to immediately open the Allotment form for phone enquiries.
          </p>
        </div>

        ${Object.keys(byType).map(typeKey => {
          const list = byType[typeKey];
          if (list.length === 0) return "";
          const price = typeKey.includes("2") ? "₹7,000/mo" : "₹5,000/mo";
          return `
            <div style="margin-bottom:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid var(--border-light); padding-bottom:4px;">
                <strong style="font-size:0.95rem; color:var(--text-main);">${typeKey} (${list.length} beds)</strong>
                <span style="font-size:0.82rem; font-weight:700; color:var(--emerald-green);">${price}</span>
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:8px;">
                ${list.map(b => `
                  <button type="button" class="admin-btn admin-btn-outline" style="padding:8px; font-size:0.85rem; justify-content:center; text-align:center;" onclick="window.AdminPortal.closeModals(); window.AdminPortal.openAllotModal('${b.room}', ${b.bed}, 'occupied')">
                    Room ${b.room}<br><strong style="color:var(--emerald-green);">Bed #${b.bed}</strong>
                  </button>
                `).join("")}
              </div>
            </div>
          `;
        }).join("")}
      `;
    }

    modal.classList.add("active");
  },

  // ==============================================================
  // 7. Privacy-First Downloads, Backups & Restore
  // ==============================================================

  // Download public beds.json (NEVER INCLUDES STUDENT NAMES OR PHONES)
  downloadBedsJson() {
    const publicData = this.beds.map(b => ({
      room: b.room.toString(),
      type: b.type,
      bed: Number(b.bed),
      status: b.status,
      updatedAt: b.updatedAt || new Date().toISOString()
    }));

    const jsonStr = JSON.stringify(publicData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beds.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast("✓ beds.json downloaded! Upload this file to your website repository.");
  },

  // Private Student Data Backup (Keeps students, past records & logs safe)
  backupStudentData() {
    const backupObj = {
      backupType: "Sri Mallikarjuna Swami PG - Full Private Backup",
      exportedAt: new Date().toISOString(),
      students: this.students,
      pastStudents: this.pastStudents,
      beds: this.beds,
      logs: this.logs
    };

    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const todayStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `hostel_student_backup_${todayStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast("✓ Private student records backup downloaded!");
  },

  // Restore Student Data Backup
  handleBackupRestore(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid format");

        this.openConfirmModal(
          "Restore Student Backup?",
          `Restore records from <strong>${file.name}</strong>? This will update active students, past students, and bed states.`,
          () => {
            if (parsed.students) this.students = parsed.students;
            if (parsed.pastStudents) this.pastStudents = parsed.pastStudents;
            if (parsed.beds && Array.isArray(parsed.beds)) this.beds = parsed.beds;
            if (parsed.logs && Array.isArray(parsed.logs)) this.logs = parsed.logs;

            this.logActivity("ALL", "ALL", "Restored", "Backup", `Restored from ${file.name}`);
            this.saveData();
            this.showToast(`✓ Backup restored successfully from ${file.name}!`);
          }
        );
      } catch (err) {
        alert("Restore failed: Invalid backup file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  },

  // Reset to live published beds.json
  confirmReset() {
    this.openConfirmModal(
      "Reset to Published Data?",
      "Are you sure you want to discard local changes and restore from the live <code>beds.json</code> file?",
      async () => {
        try {
          let resp = await fetch("../data/beds.json", { cache: "no-store" });
          if (!resp.ok) resp = await fetch("../public/data/beds.json", { cache: "no-store" });
          if (!resp.ok) resp = await fetch("data/beds.json", { cache: "no-store" });
          if (!resp.ok) throw new Error("Could not load beds.json");
          this.beds = await resp.json();
          this.saveData();
          this.logActivity("ALL", "ALL", "Reset", "Published", "Reset to published beds.json");
          this.showToast("✓ Reset to live published data completed.");
        } catch (e) {
          alert("Reset failed: Unable to fetch live beds.json.");
        }
      }
    );
  },

  // ==============================================================
  // 8. Activity Log & Past Students Modals
  // ==============================================================
  showActivityLog() {
    const modal = document.getElementById("activityLogModal");
    const container = document.getElementById("activityLogContent");
    if (!modal || !container) return;

    if (this.logs.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:30px;">No activity logged yet.</p>`;
    } else {
      container.innerHTML = `
        <table class="admin-log-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Room &amp; Bed</th>
              <th>Student Name</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${this.logs.map(l => {
              const timeFormatted = new Date(l.timestamp).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              });
              return `
                <tr>
                  <td>${timeFormatted}</td>
                  <td><strong>${l.action}</strong></td>
                  <td>Room ${l.room} - Bed #${l.bed}</td>
                  <td style="color:var(--text-main); font-weight:600;">${l.studentName}</td>
                  <td style="color:var(--text-muted); font-size:0.78rem;">${l.details || "-"}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }

    modal.classList.add("active");
  },

  showPastStudentsModal() {
    const modal = document.getElementById("pastStudentsModal");
    const container = document.getElementById("pastStudentsContent");
    if (!modal || !container) return;

    if (this.pastStudents.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:30px;">No past students recorded yet.</p>`;
    } else {
      container.innerHTML = `
        <table class="admin-log-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Room &amp; Bed</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Left On</th>
            </tr>
          </thead>
          <tbody>
            ${this.pastStudents.map(p => {
              const leftFormatted = p.leftAt ? new Date(p.leftAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";
              return `
                <tr>
                  <td style="font-weight:700;">${p.studentName}</td>
                  <td>Room ${p.room} - Bed #${p.bed}</td>
                  <td>${p.studentPhone ? `<a href="tel:+91${p.studentPhone}" style="color:var(--primary-blue);">+91 ${p.studentPhone}</a>` : "N/A"}</td>
                  <td>${p.joinDate || "N/A"}</td>
                  <td style="color:var(--rose-red); font-weight:600;">${leftFormatted}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;
    }

    modal.classList.add("active");
  },

  // ==============================================================
  // 9. Dashboard Rendering & Event Listeners
  // ==============================================================
  bindDashboardEvents() {
    // Toolbar buttons
    document.getElementById("btnDownloadBeds")?.addEventListener("click", () => this.downloadBedsJson());
    document.getElementById("btnBannerDownload")?.addEventListener("click", () => this.downloadBedsJson());
    document.getElementById("btnBackupStudents")?.addEventListener("click", () => this.backupStudentData());
    document.getElementById("btnAvailableQuick")?.addEventListener("click", () => this.openAvailableBedsDrawer());
    document.getElementById("btnResetBeds")?.addEventListener("click", () => this.confirmReset());
    document.getElementById("btnViewLog")?.addEventListener("click", () => this.showActivityLog());
    document.getElementById("btnViewPast")?.addEventListener("click", () => this.showPastStudentsModal());

    // Restore file input
    const btnRestore = document.getElementById("btnRestoreBackup");
    const fileRestore = document.getElementById("fileRestoreBackup");
    if (btnRestore && fileRestore) {
      btnRestore.onclick = () => fileRestore.click();
      fileRestore.onchange = (e) => this.handleBackupRestore(e);
    }

    // Search Box Listener
    const searchInput = document.getElementById("adminSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderRooms();
      });
    }

    // Status Filter buttons
    document.querySelectorAll(".admin-status-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".admin-status-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentStatusFilter = btn.getAttribute("data-status") || "all";
        this.renderRooms();
      });
    });

    // Room Type Filter buttons
    document.querySelectorAll(".admin-type-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".admin-type-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentTypeFilter = btn.getAttribute("data-type") || "all";
        this.renderRooms();
      });
    });

    // Allot Form Submit
    document.getElementById("allotBedForm")?.addEventListener("submit", (e) => this.handleAllotSubmit(e));

    // Modal Close buttons
    document.querySelectorAll(".btn-modal-close").forEach(btn => {
      btn.addEventListener("click", () => this.closeModals());
    });

    // Confirm Action
    document.getElementById("btnConfirmAction")?.addEventListener("click", () => {
      if (typeof this.pendingAction === "function") {
        this.pendingAction();
        this.pendingAction = null;
      }
      this.closeModals();
    });
  },

  render() {
    this.renderStats();
    this.renderRooms();
    this.checkUnpublishedChanges();
  },

  renderStats() {
    let totalAvail = 0;
    let totalReserved = 0;
    let totalOccupied = 0;

    this.beds.forEach(b => {
      if (b.status === "available") totalAvail++;
      else if (b.status === "reserved") totalReserved++;
      else if (b.status === "occupied") totalOccupied++;
    });

    const totalBeds = this.beds.length || 49;
    const occupancyPercent = Math.round((totalOccupied / totalBeds) * 100);

    const statAvail = document.getElementById("adminStatAvail");
    const statReserved = document.getElementById("adminStatReserved");
    const statOccupied = document.getElementById("adminStatOccupied");
    const statTotal = document.getElementById("adminStatTotal");
    const statPercent = document.getElementById("adminStatPercent");
    const btnQuickAvailText = document.getElementById("btnQuickAvailCount");

    if (statAvail) statAvail.textContent = totalAvail;
    if (statReserved) statReserved.textContent = totalReserved;
    if (statOccupied) statOccupied.textContent = totalOccupied;
    if (statTotal) statTotal.textContent = totalBeds;
    if (statPercent) statPercent.textContent = `${occupancyPercent}%`;
    if (btnQuickAvailText) btnQuickAvailText.textContent = totalAvail;
  },

  renderRooms() {
    const grid = document.getElementById("adminRoomsGrid");
    const cfg = window.HOSTEL_CONFIG;
    if (!grid || !cfg) return;

    const roomDefs = cfg.inventory?.rooms || [];

    // Filter by type
    let filteredDefs = roomDefs.filter(r => {
      if (this.currentTypeFilter !== "all" && r.typeId !== this.currentTypeFilter) {
        return false;
      }
      return true;
    });

    // Filter by search query or status filter
    filteredDefs = filteredDefs.filter(r => {
      const roomBeds = this.beds.filter(b => b.room.toString() === r.room.toString());

      // Status filter check
      if (this.currentStatusFilter !== "all") {
        const matchesStatus = roomBeds.some(b => b.status === this.currentStatusFilter);
        if (!matchesStatus) return false;
      }

      // Search query check (Student name, phone, parent phone, or room number)
      if (this.searchQuery) {
        const roomMatches = r.room.toLowerCase().includes(this.searchQuery);
        if (roomMatches) return true;

        const anyStudentMatches = roomBeds.some(b => {
          const student = this.getStudent(b.room, b.bed);
          if (!student) return false;
          return (
            (student.studentName && student.studentName.toLowerCase().includes(this.searchQuery)) ||
            (student.studentPhone && student.studentPhone.includes(this.searchQuery)) ||
            (student.parentPhone && student.parentPhone.includes(this.searchQuery))
          );
        });
        if (!anyStudentMatches) return false;
      }

      return true;
    });

    if (filteredDefs.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);">
          <p style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:6px;">No rooms or students match your filter</p>
          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px;">Try clearing your search query or setting filter to 'All'.</p>
          <button type="button" class="admin-btn admin-btn-outline" onclick="window.AdminPortal.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredDefs.map(r => {
      const roomBeds = this.beds.filter(b => b.room.toString() === r.room.toString());
      const availCount = roomBeds.filter(b => b.status === "available").length;
      const isFull = (availCount === 0);

      const bedsHtml = roomBeds.map(b => {
        const student = this.getStudent(b.room, b.bed);
        const hasStudent = !!student;
        const studentName = student?.studentName || "";

        // Status tags
        let tagClass = "status-available";
        let tagLabel = "Available";
        if (b.status === "occupied") {
          tagClass = "status-occupied";
          tagLabel = "Occupied";
        } else if (b.status === "reserved") {
          tagClass = "status-reserved";
          tagLabel = "Reserved";
        }

        // Tapping action
        // Available or Reserved -> Opens Allot popup
        // Occupied -> Opens Occupied Details popup
        const onClickAction = (b.status === "occupied")
          ? `window.AdminPortal.openOccupiedDetailsModal('${b.room}', ${b.bed})`
          : `window.AdminPortal.openAllotModal('${b.room}', ${b.bed}, '${b.status}')`;

        return `
          <div class="admin-bed-card status-${b.status}">
            <div class="admin-bed-card-main" onclick="${onClickAction}">
              <div class="admin-bed-left">
                <span class="admin-bed-num">🛏️ Bed ${b.bed}</span>
                <span class="admin-status-tag ${tagClass}">${tagLabel}</span>
              </div>
              <div class="admin-bed-student-info">
                ${studentName ? `<span class="occupant-name">👤 ${studentName}</span>` : `<span class="occupant-empty">${b.status === 'available' ? 'Tap to Allot Bed' : 'Tap to View'}</span>`}
              </div>
            </div>

            ${b.status === 'available' ? `
              <button type="button" class="btn-bed-quick-occupy" title="Quick check-in (skip details)" onclick="window.AdminPortal.quickMarkOccupied('${b.room}', ${b.bed})">
                ⚡ Quick Occupy
              </button>
            ` : ''}
          </div>
        `;
      }).join("");

      return `
        <div class="admin-room-card">
          <div class="admin-room-card-header">
            <div>
              <h3 class="admin-room-title">Room ${r.room}</h3>
              <span class="admin-room-meta">${r.title || r.type} &bull; ₹${r.price.toLocaleString("en-IN")}/mo</span>
            </div>
            <div>
              <span class="admin-status-tag ${isFull ? 'status-occupied' : 'status-available'}">
                ${isFull ? 'Full' : availCount + ' Avail'}
              </span>
            </div>
          </div>

          <div class="admin-beds-list">
            ${bedsHtml}
          </div>
        </div>
      `;
    }).join("");
  },

  resetFilters() {
    this.currentStatusFilter = "all";
    this.currentTypeFilter = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("adminSearchInput");
    if (searchInput) searchInput.value = "";
    document.querySelectorAll(".admin-status-filter-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-status") === "all"));
    document.querySelectorAll(".admin-type-filter-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-type") === "all"));
    this.render();
  },

  // ==============================================================
  // 10. Modals & Notifications Helpers
  // ==============================================================
  openConfirmModal(title, descHtml, onConfirm) {
    const modal = document.getElementById("confirmModal");
    const titleEl = document.getElementById("confirmModalTitle");
    const descEl = document.getElementById("confirmModalDesc");

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.innerHTML = descHtml;

    this.pendingAction = onConfirm;
    if (modal) modal.classList.add("active");
  },

  closeModals() {
    document.querySelectorAll(".admin-modal-overlay").forEach(m => m.classList.remove("active"));
    this.pendingAction = null;
  },

  showToast(message) {
    const toast = document.getElementById("adminToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3500);
  }
};

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.AdminPortal.init();
});
