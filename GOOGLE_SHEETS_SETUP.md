# Google Sheets Web App Setup

To enable the checkout flow to send order data to your Google Sheet, you need to set up a Google Apps Script Web App.

## Step-by-Step Instructions

### 1. Open Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vg_qpQm6DMlJLUW0k_vrnHKi0fdHKN86uY7njj7LhiI/edit
2. Go to **Extensions** > **Apps Script**
3. A new tab will open with the Apps Script editor

### 2. Create the Script

Delete any default code and paste this script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data from the POST request
    var data = JSON.parse(e.postData.contents);
    
    // Prepare the row data
    var rowData = [
      new Date(), // Timestamp
      data.customer_name || '',
      data.customer_phone || '',
      data.customer_address || '',
      data.total_price || 0,
      data.total_items || 0,
      JSON.stringify(data.products || []), // Products as JSON string
      data.order_date || new Date().toISOString()
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Return a success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Order saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return an error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Set Up the Sheet Headers (Optional but Recommended)

Before deploying, make sure your Google Sheet has headers in the first row:
- Column A: Timestamp
- Column B: Customer Name
- Column C: Customer Phone
- Column D: Customer Address
- Column E: Total Price
- Column F: Total Items
- Column G: Products (JSON)
- Column H: Order Date

### 4. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**
3. Configure the deployment:
   - **Description**: "Order submission endpoint"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (or "Anyone with Google account" if you prefer)
4. Click **Deploy**
5. Authorize the script when prompted (click "Review permissions" and authorize)
6. Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

### 5. Update the Checkout Page

Replace the `googleSheetsUrl` in `app/checkout/page.tsx` with your Web App URL:

```typescript
const googleSheetsUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

### 6. Test the Setup

1. Test the checkout flow in your app
2. Check your Google Sheet to verify that orders are being saved

## Important Notes

- **CORS**: The checkout page uses `mode: 'no-cors'` to avoid CORS errors, but this means you won't be able to read the response from Google Sheets
- **Security**: Make sure to review who has access to your Web App URL
- **Rate Limits**: Google Apps Script has daily execution limits (free tier: 20,000 executions/day)

## Troubleshooting

- If orders aren't appearing, check the Apps Script execution logs: **Executions** tab in the Apps Script editor
- Make sure you've authorized the script with the necessary permissions
- Verify that the Web App is deployed (not just saved)

