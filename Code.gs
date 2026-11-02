/**
 * Google Apps Script - Booking Form Notification Handler
 * Sri Mallikarjuna Swami The Boys PG (Near MITS College, Angallu)
 * 
 * Free Architecture:
 * 1. Appends student booking submissions to Google Sheets (Free)
 * 2. Sends real-time WhatsApp alert to hostel owner via CallMeBot API (Free)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets -> Extensions -> Apps Script
 * 2. Paste this entire Code.gs content
 * 3. Go to Project Settings (gear icon) -> Script Properties -> Add property:
 *    Property: CALLMEBOT_API_KEY
 *    Value: <your CallMeBot API key received on WhatsApp>
 * 4. Click 'Deploy' -> 'New deployment' -> Select 'Web app'
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste into HOSTEL_CONFIG.bookingWebhookUrl in js/config.js
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJson({ status: "error", message: "Empty request body" }, 400);
    }

    // Parse JSON payload
    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return responseJson({ status: "error", message: "Invalid JSON format" }, 400);
    }

    // Honeypot anti-spam check (if filled, reject immediately)
    if (data.website_url || data.honeypot) {
      return responseJson({ status: "error", message: "Spam detected" }, 400);
    }

    // Validation: Name, Phone, Room Type, Move-in Date are required
    var name = (data.name || "").toString().trim();
    var phone = (data.phone || "").toString().trim();
    var parentPhone = (data.parentPhone || "").toString().trim();
    var roomType = (data.roomType || "").toString().trim();
    var price = (data.price || "").toString().trim();
    var moveInDate = (data.moveInDate || "").toString().trim();
    var branchYear = (data.branchYear || data.yearBranch || "").toString().trim();
    var message = (data.message || "").toString().trim();
    var roomNumber = (data.roomNumber || "").toString().trim();
    var bedNumber = (data.bedNumber || "").toString().trim();

    if (!name || !phone || !roomType || !moveInDate) {
      return responseJson({ status: "error", message: "Missing required fields" }, 400);
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

    // STEP 1: Append to Google Sheet (wrapped in try/catch)
    var sheetSaved = false;
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss ? ss.getActiveSheet() : null;

      if (sheet) {
        // Create headers if new or empty sheet
        if (sheet.getLastRow() === 0) {
          sheet.appendRow([
            "Timestamp",
            "Student Name",
            "Student Phone",
            "Parent Phone",
            "Room Type",
            "Specific Bed",
            "Price",
            "Move-in Date",
            "Branch / Year",
            "Message"
          ]);
          sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
          sheet.setFrozenRows(1);
        }

        var specificBedDisplay = (roomNumber && bedNumber) ? ("Room " + roomNumber + ", Bed " + bedNumber) : "Any available";

        sheet.appendRow([
          timestamp,
          name,
          phone,
          parentPhone,
          roomType,
          specificBedDisplay,
          price,
          moveInDate,
          branchYear,
          message
        ]);
        sheetSaved = true;
      }
    } catch (sheetError) {
      Logger.log("Google Sheets append error: " + sheetError.toString());
    }

    // STEP 2: Send WhatsApp Notification to Owner via CallMeBot API (wrapped in try/catch)
    var whatsappSent = false;
    try {
      var scriptProps = PropertiesService.getScriptProperties();
      var apiKey = scriptProps.getProperty("CALLMEBOT_API_KEY");
      var ownerPhone = "916309495985"; // Owner WhatsApp number

      if (apiKey) {
        // Build formatted WhatsApp message according to exact specifications
        var roomDisplay = roomType;
        if (price) {
          // If price is not already in format ₹.../month, format it
          var cleanPrice = price.replace(/[^0-9]/g, "");
          roomDisplay = roomType + " (₹" + (cleanPrice ? Number(cleanPrice).toLocaleString("en-IN") : price) + "/month)";
        }

        var bedChoiceText = (roomNumber && bedNumber) ? ("\n🔢 Bed Choice: Room " + roomNumber + " - Bed #" + bedNumber) : "";

        var waMessage =
          "🏠 New Booking - Sri Mallikarjuna Swami Boys PG\n" +
          "👤 Name: " + name + "\n" +
          "📞 Phone: " + phone + "\n" +
          "👨‍👩‍👦 Parent: " + (parentPhone || "N/A") + "\n" +
          "🛏️ Room: " + roomDisplay +
          bedChoiceText + "\n" +
          "📅 Move-in: " + moveInDate + "\n" +
          "🎓 Branch/Year: " + (branchYear || "N/A") + "\n" +
          "💬 Message: " + (message || "None") + "\n" +
          "🕒 Time: " + timestamp;

        var encodedText = encodeURIComponent(waMessage);
        var callMeBotUrl = "https://api.callmebot.com/whatsapp.php?phone=" + ownerPhone + "&text=" + encodedText + "&apikey=" + encodeURIComponent(apiKey.trim());

        var botResponse = UrlFetchApp.fetch(callMeBotUrl, {
          method: "get",
          muteHttpExceptions: true
        });

        Logger.log("CallMeBot Response code: " + botResponse.getResponseCode() + ", Body: " + botResponse.getContentText());
        whatsappSent = (botResponse.getResponseCode() === 200);
      } else {
        Logger.log("CALLMEBOT_API_KEY not found in Script Properties. Skipping WhatsApp trigger.");
      }
    } catch (botError) {
      Logger.log("CallMeBot API error: " + botError.toString());
    }

    // Return success response
    return responseJson({
      status: "success",
      sheetSaved: sheetSaved,
      whatsappSent: whatsappSent
    }, 200);

  } catch (globalErr) {
    Logger.log("Global doPost error: " + globalErr.toString());
    return responseJson({ status: "error", message: globalErr.toString() }, 500);
  }
}

/**
 * Health check endpoint for testing deployment in browser
 */
function doGet(e) {
  return responseJson({
    status: "ok",
    service: "Sri Mallikarjuna Swami The Boys PG - Booking Notification Service",
    timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a")
  }, 200);
}

/**
 * Helper to build JSON ContentService output
 */
function responseJson(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
