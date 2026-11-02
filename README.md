# Sri Mallikarjuna Swami The Boys PG — Official Website

> **Location:** Opposite MITS College street, Angallu, Kurabala Kota, Andhra Pradesh 517325  
> **Target Audience:** Engineering students of Madanapalle Institute of Technology & Science (MITS) and their parents.  
> **Key Features:** Mobile-first, ultra-lightweight (Lighthouse 95+), bilingual (English & Telugu), Dark/Light theme, interactive Google Maps & walking times, weekly mess schedule, photo lightbox, and instant WhatsApp booking generator with 10-digit Indian phone validation.

---

## 🚀 How to Run Locally

### Option 1: Using npm (Recommended)
```bash
npm start
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Option 2: Direct Double-Click (Zero Setup)
Since this site is built with modern vanilla HTML5, CSS3, and ES6 JavaScript with zero compile dependencies, you can simply **double-click `index.html`** in File Explorer to open it directly in Chrome, Edge, Safari, or Firefox!

### Option 3: Python Built-in Server
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000).

---

## ✏️ How to Edit Rents, Contacts, Food Menu & Rules (Single Config File)

All data across the entire website is managed in a single, well-documented file:
👉 **[`js/config.js`](file:///c:/Users/Koti%20Reddy/OneDrive/Pictures/Desktop/Hostel/js/config.js)**

You can open this file in any text editor (Notepad, VS Code, etc.) to change:
- **Phone & WhatsApp Number:** Update `contact.phoneRaw` and `contact.whatsappNumber` (e.g. `"916309495985"`).
- **Owner / Warden Name:** Change `contact.ownerName`.
- **Monthly Rents & Deposits:** Update `rooms[0].monthlyRent`, `rooms[1].monthlyRent`, etc.
- **Bed Vacancy Status:** Change `currentAvailableBeds` or badge from `"Available"` to `"Filling Fast"` or `"Full"`.
- **Food Menu:** Change breakfast, lunch, snacks, or dinner items for any day of the week in `foodMenu.schedule`.
- **Hostel Rules & Gate Closing:** Edit `rules.timings` or `quickStats.gateClosingTime`.

**No build step or terminal compilation required!** Changes will reflect immediately when you refresh your browser.

---

## 📬 Automated Booking Notifications Setup (100% Free)

This website uses a **100% free, serverless architecture** that saves bookings directly to a Google Sheet and sends an instant WhatsApp alert to the owner's phone via CallMeBot. **No paid APIs, no paid plans, and no credit card required anywhere.**

Follow these 5 simple steps to activate it:

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the sheet **"Sri Mallikarjuna Swami PG Bookings"**.
3. (Optional) Name the first tab **"Bookings"**.

### Step 2: Paste the Script (`Code.gs`)
1. In your Google Sheet, click **Extensions > Apps Script** in the top menu.
2. Delete any default code in the editor (`function myFunction() { ... }`).
3. Open the [`Code.gs`](file:///c:/Users/Koti%20Reddy/OneDrive/Pictures/Desktop/Hostel/Code.gs) file in this repository, copy all the code, and paste it into the Apps Script editor.
4. Click the **Save** icon (diskette) or press `Ctrl + S`.

### Step 3: Get Your Free CallMeBot WhatsApp API Key
1. Save the CallMeBot bot number to your phone or open WhatsApp directly.
2. Send the message: `I allow callmebot to send me messages` to **+34 911 06 73 98** or click [CallMeBot WhatsApp Setup](https://api.callmebot.com/whatsapp.php).
3. The bot will instantly reply with your free personal **API Key** (e.g., `1234567`).

### Step 4: Add CallMeBot API Key in Script Properties
1. In the Apps Script editor, click the **Project Settings** (gear icon ⚙️ on the left panel).
2. Scroll down to **Script Properties** and click **Add script property**.
3. Set:
   - **Property**: `CALLMEBOT_API_KEY`
   - **Value**: *(paste your numeric API key from Step 3)*
4. Click **Save script properties**.

### Step 5: Deploy as a Web App & Update Config
1. In the Apps Script editor, click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Configure the deployment settings:
   - **Description**: `Hostel Booking Webhook`
   - **Execute as**: **Me** (`your-email@gmail.com`)
   - **Who has access**: **Anyone** *(crucial so frontend submissions work)*
4. Click **Deploy**. (Grant Google authorization permissions when prompted: click *Advanced > Go to Untitled project (unsafe)* > *Allow*).
5. Copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).
6. Open [`js/config.js`](file:///c:/Users/Koti%20Reddy/OneDrive/Pictures/Desktop/Hostel/js/config.js) in your project and paste your URL into `bookingWebhookUrl`:
   ```javascript
   bookingWebhookUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
   ```
7. Save the file. Your booking form is now live and fully automated!

#### Fallback Guarantee:
Even if Google Apps Script is slow or CallMeBot is unreachable, the booking form automatically opens the pre-filled WhatsApp link directly to Warden Sri Mallikarjuna Reddy (`+91 63094 95985`) so **zero student bookings are ever lost**.

---

## 🛏️ Live Room & Bed Availability & Warden Admin Portal

This website includes a complete, 100% free **Room & Bed Availability System** covering all **14 rooms and 49 beds**:
- **1 Room of 2 Sharing**: Room [101] (2 beds) — ₹7,000/mo
- **5 Rooms of 3 Sharing**: Rooms [102–106] (3 beds each = 15 beds) — ₹5,000/mo
- **8 Rooms of 4 Sharing**: Rooms [201–208] (4 beds each = 32 beds) — ₹5,000/mo

### 1. How Visitors See Bed Availability
- The public site loads `data/beds.json` fresh with `fetch(..., { cache: "no-store" })` on every page visit (it **never** reads from the visitor's local storage).
- **Summary Bar**: Displays real-time counts: e.g. "49 beds available out of 49", plus breakdowns for 2 Sharing, 3 Sharing, and 4 Sharing, along with a "Last updated" timestamp.
- **Filter Tabs**: Visitors can switch between *All (14 Rooms)*, *2 Sharing*, *3 Sharing*, and *4 Sharing*, and toggle *"Show only rooms with empty beds"*.
- **Color Legend**: 🟢 Green = Available, 🟡 Yellow = Reserved, 🔴 Red = Occupied.
- **Instant Booking**: Tapping **"Book This Bed"** on any available bed automatically scrolls to the booking form, locks in the room preference, pre-fills the specific Room & Bed number, and includes them directly in the owner's WhatsApp message and Google Sheet log!

---

### 2. Warden Admin Portal (`/admin` or `/admin.html`)

The hostel owner can manage all 49 beds directly from their smartphone or laptop by visiting:  
👉 **`http://localhost:3000/admin`** (or `https://your-domain.com/admin` / `https://your-domain.com/admin.html`)

#### Admin Authentication & Security
- **Authentication**: Verified via SHA-256 cryptographic hash (`ADMIN_PASSWORD_HASH` stored in `js/config.js`). Plaintext passwords are never stored in code, config, or documentation.
- **Session Duration**: Remains authenticated in `sessionStorage` for **30 minutes**, with a **Logout** button.
- **Brute-Force Protection**: Shows *"Incorrect password"* on failure, and automatically locks login for **30 seconds** after 5 failed attempts.
- **Show/Hide Toggle**: Includes an eye icon to toggle password visibility.

---

### 3. Owner Daily Routine (Allot, Vacate, Move, Backup & Publish)

#### Flow 1: Allot a Bed (When a New Student Joins)
1. In `/admin`, each bed shows its live status:
   - 🟢 **Green = Available**
   - 🔴 **Red = Occupied**
   - 🟡 **Yellow = Reserved**
2. **Tap any Available or Reserved bed** to open the **"Allot Bed"** popup.
3. Fill in the student details:
   - **Student Name** *(Required)*
   - **Student Phone** *(10 digits, Required)* — includes direct Call & WhatsApp links in admin view
   - **Parent Phone** *(Optional)*
   - **Join Date** *(Defaults to today's date)*
   - **Monthly Rent** *(Pre-filled automatically from room type: ₹7,000 for 2-sharing, ₹5,000 for 3 & 4-sharing)*
   - **Advance Paid** *(Optional)*
4. Tap **"Confirm Allotment"**:
   - The bed status immediately turns **Occupied** (shown as "Not available" on public page).
   - Student details are saved securely into local memory (`hostel_students_v1`).
   - A success toast appears.
5. **Quick Shortcut**: If in a hurry, tap the **"⚡ Quick Occupy"** button on the bed card to mark it occupied immediately without filling out the form.

#### Flow 2: Vacate a Bed (When a Student Leaves)
1. **Tap the Occupied bed**. A modal opens showing the student's name, phone, parent phone, join date, rent, and advance paid.
2. Tap the red button: **"🚪 Student Left - Make Bed Available"**.
3. A confirmation dialog appears:  
   *`"Room 203, Bed 2 - [student name] will be marked as left. Continue?"`*
4. Tap **"Continue"**:
   - The bed immediately switches to **🟢 Available**.
   - The student record is archived to the **"Past students"** list with their checkout timestamp.
   - You can view past records anytime by tapping **"🎓 Past Students"** in the toolbar.

#### Flow 3: Reserve a Bed or Move a Student
- **Reserve**: If a student pays an advance to hold a bed before arriving, open the bed, select **"Reserved"** in the status dropdown, and enter their advance amount. The bed turns yellow (reserved).
- **Move Student**: If a student wants to switch rooms (e.g., from Room 102 to Room 201):
  1. Tap their occupied bed.
  2. Tap **"🔄 Move Student"**.
  3. Select an empty destination bed from the dropdown.
  4. The old bed automatically frees up to **Available**, and the new bed becomes **Occupied** with all the student's details transferred intact.

#### Owner Quick Enquiry Tool: "⚡ Available Beds"
- When a parent or student calls asking what rooms are available, tap **"⚡ Available Beds"** on the top toolbar.
- It displays a grouped breakdown of all vacant beds categorized by 2-sharing, 3-sharing, and 4-sharing with prices.
- Tap any bed to open the allotment form directly during the phone call.

#### Search & Real-Time Filters
- **Search Bar**: Type a student's name, phone number, or room number (e.g. `Ramesh`, `98765`, `101`) to locate them instantly.
- **Filter Tabs**: Filter by status (*All | Available | Occupied | Reserved*) or by room type (*2 Sharing | 3 Sharing | 4 Sharing*).

---

### 4. Storage, Privacy & Data Security

> [!IMPORTANT]
> **Strict Student Privacy Architecture:**
> 1. **Public `beds.json` contains ONLY**: `room`, `type`, `bed`, `status`, and `updatedAt`.  
>    **STUDENT NAMES, PHONE NUMBERS, AND FINANCIAL DETAILS ARE NEVER SAVED TO OR EXPORTED IN `beds.json`.**
> 2. Student details are stored privately in your browser's `localStorage` under `"hostel_students_v1"`, and past students under `"hostel_past_students_v1"`.
> 3. Bed status inventory is stored under `"hostel_beds_v1"`.
> 4. An activity log of the last 100 changes is tracked in `"hostel_beds_log_v1"`.

#### Backing Up & Restoring Student Records
- **"💾 Backup Student Data"**: Tap this button to download a private JSON file containing all active students, past students, and activity logs. Save this on your computer or Google Drive for safekeeping.
- **"📂 Restore Backup"**: Tap this to restore your student records from a previously downloaded backup file.

---

### 5. How to Publish Bed Updates to Your Live Website (3 Free Ways)

Whenever you allot, vacate, or move a bed, a prominent banner appears:  
*"Bed status changed. Download beds.json and upload it to your site so students see the update."*

1. Tap **"📥 Download beds.json"**.
2. Replace `data/beds.json` and `public/data/beds.json` in your website folder with this downloaded file.
3. Follow the steps below for your hosting platform:

#### Option A: Netlify (Drag & Drop - 30 seconds)
1. In your local project folder, replace `data/beds.json` and `public/data/beds.json` with the newly downloaded `beds.json`.
2. Go to your [Netlify Sites Dashboard](https://app.netlify.com).
3. Drag and drop the `Hostel` folder onto your site's **Deploys** area.
4. Netlify deploys the updated bed vacancy instantly!

#### Option B: GitHub Pages / Cloudflare Pages (Git Push)
1. Replace `data/beds.json` and `public/data/beds.json` with your downloaded `beds.json`.
2. Run in terminal or VS Code:
   ```bash
   git add data/beds.json public/data/beds.json
   git commit -m "Update bed availability"
   git push origin main
   ```
3. Cloudflare Pages or GitHub Pages will automatically rebuild in ~20 seconds.

#### Option C: Vercel (CLI or GitHub)
1. Replace `data/beds.json` and `public/data/beds.json`.
2. Run `npx vercel --prod` or push to GitHub.
3. Your live site will immediately display the new bed vacancies!

---

## 🌐 Free 1-Click Deployment Guide

### Deploying on Vercel (Free)
1. Install Vercel CLI (or push this folder to GitHub):
   ```bash
   npx vercel
   ```
2. Select your account and press **Enter** to accept the defaults.
3. Your website will be live with a free SSL certificate on `https://your-project.vercel.app` in under 30 seconds!

### Deploying on Netlify (Free)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this entire `Hostel` folder onto the Netlify Drop area.
3. Your site will instantly go live with free HTTPS and custom domain support!

### Deploying on GitHub Pages (Free)
1. Create a GitHub repository and push this folder.
2. Go to **Repository Settings > Pages**.
3. Under **Branch**, select `main` and root `/` folder, then click **Save**.

---

## 📸 Real Photo Shooting & Upload Guide (For the Hostel Owner)

Parents and students look for authentic photos before visiting. A regular phone camera is more than enough if you follow these simple steps:

### 1. Preparation Before Shooting
- **Clean and arrange first**: Make the beds with neat bedsheets, clear the floor of footwear or luggage, open all curtains, and turn on all room lights.
- **Shoot in bright daylight**: Take photos between **10:00 AM and 4:00 PM** with the windows open. **Do not use the phone flash** (flash creates unnatural glare and harsh shadows).
- **Always shoot in landscape mode (horizontal)**: Stand in a corner of the room so the entire room and furniture fit in the frame. Hold the phone steady at chest height.

### 2. Must-Cover Shots
1. **Building front**: Ensure the "Sri Mallikarjuna Swami The Boys PG" name board and entrance are clearly visible.
2. **Main gate & motorbike parking area**.
3. **Each room type**: 2-sharing, 3-sharing, and 4-sharing beds and mattress layout.
4. **Cupboards & study table**: Show the lockable wooden wardrobe with keys and study desk charging points.
5. **Attached bathroom**: Clean washroom with geyser, mirror, and washbasin.
6. **Dining hall & mess**: Serving counter, clean dining tables, and drinking water dispenser.
7. **Corridors, terrace clothes drying area, and study hall**.
8. **30 to 60-second walkthrough video**: A smooth continuous video walking from the gate into a room and the mess hall convinces parents more than static photos.

### 3. Free Editing Tips
- Open your photos in **Google Photos** or **Snapseed** (free app).
- Slightly adjust brightness, contrast, and warmth (+5% to +10%).
- **Do not over-filter** or use beauty filters; parents want to see the real, honest space.

### 4. How to Swap in Your Real Photos on the Website
1. Copy your real photos into the `assets/images/` folder (e.g. `assets/images/building-real.jpg`, `assets/images/room2-real.jpg`).
2. Open [`js/config.js`](file:///c:/Users/Koti%20Reddy/OneDrive/Pictures/Desktop/Hostel/js/config.js) in Notepad.
3. Update the image paths in:
   - `heroSlides[0].image`
   - `rooms[0].images[0].src`, `rooms[0].images[1].src`, etc.
   - `gallery[0].image`
4. Refresh your browser — your real photos will appear immediately!

---

## 📍 Quick SEO Wins
- **Google Maps & Google Business Profile**: Upload your real photos to your Google Business Profile listing for "Sri Mallikarjuna Swami The Boys PG". This significantly helps the hostel rank #1 on Google for *"boys PG near MITS"* and *"hostel in Angallu"*.
- **Add Photo Captions**: The website already includes captions like *"3-sharing room with attached cupboards"* and *"Attached washroom with 24/7 geyser"* on every card and in the fullscreen lightbox.

---

## 📁 Project Structure

```
Hostel/
├── index.html                  # Semantic HTML5 shell with 16:9 hero slider, tour & floor plan
├── robots.txt                  # Search crawler directives
├── sitemap.xml                 # XML sitemap for SEO
├── vercel.json                 # Vercel deployment configuration
├── netlify.toml                # Netlify deployment configuration
├── package.json                # Dev scripts (npm start, npm run dev)
├── README.md                   # Setup, config editing, photo guide, and free deployment
├── css/
│   ├── main.css                # Design system tokens (colors, typography, elevation)
│   ├── components.css          # Slider, carousels, video tour, floor plan, cards, lightbox
│   └── responsive.css          # Mobile-first breakpoint rules & mobile floating action bar
├── js/
│   ├── config.js               # SINGLE EDITABLE CONFIG FILE (contacts, carousels, menu, FAQs)
│   ├── i18n.js                 # Bilingual translation engine (English & Telugu - తెలుగు)
│   ├── app.js                  # Main UI controller: hero slider, carousels, lightbox swipe
│   └── theme.js                # Dark/light mode switcher with persistent localStorage
└── assets/
    └── images/                 # 16:9 hero slides, 4:3 room carousels, floor plan, mess graphics
```
