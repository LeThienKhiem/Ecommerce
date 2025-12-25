# Quick Setup Guide: Connect Checkout to Google Sheets

## Why it's not working
The checkout page is trying to send data to your Google Sheet, but the current URL is just the **edit link**, which cannot receive POST requests. You need to create a **Google Apps Script Web App** that acts as an endpoint to receive and save the data.

## Step-by-Step Setup (5 minutes)

### Step 1: Open Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vg_qpQm6DMlJLUW0k_vrnHKi0fdHKN86uY7njj7LhiI/edit
2. Click **Extensions** → **Apps Script**
3. A new tab will open with a code editor

### Step 2: Paste This Code

Delete the default `myFunction` code and paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty (only runs once)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Customer Name', 'Phone', 'Address', 'Total Price', 'Total Items', 'Products', 'Order Date']);
    }
    
    // Add the order data
    var rowData = [
      new Date(),
      data.customer_name || '',
      data.customer_phone || '',
      data.customer_address || '',
      data.total_price || 0,
      data.total_items || 0,
      JSON.stringify(data.products || []),
      data.order_date || new Date().toISOString()
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Order saved'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Save the Script

1. Click **Save** (💾) or press `Ctrl+S`
2. Give it a name like "Order Receiver" (top left)

### Step 4: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Receive orders from website"
   - **Execute as**: Me (your email address)
   - **Who has access**: **Anyone** (required for no-cors to work)
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
9. Click **Allow**

### Step 5: Copy the Web App URL

After deployment, you'll see a URL that looks like:
```
https://script.google.com/macros/s/AKfycbzXXXXXXXXXX/exec
```

**Copy this entire URL** - you'll need it in the next step.

### Step 6: Update Your Checkout Code

1. Open `app/checkout/page.tsx` in your code editor
2. Find line 56 where it says:
   ```typescript
   const googleSheetsUrl = "https://docs.google.com/spreadsheets/d/1vg_qpQm6DMlJLUW0k_vrnHKi0fdHKN86uY7njj7LhiI/edit?usp=sharing";
   ```
3. Replace it with your Web App URL:
   ```typescript
   const googleSheetsUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
   ```
4. Save the file
5. Restart your dev server (`npm run dev`)

### Step 7: Test It!

1. Go to your website
2. Add items to cart
3. Go to checkout
4. Fill in the form and submit
5. Check your Google Sheet - you should see a new row with the order data!

## Troubleshooting

**Problem**: Orders still not appearing in the sheet

**Solutions**:
1. Check the Apps Script execution logs:
   - In Apps Script editor, click **Executions** (left sidebar)
   - See if there are any errors
2. Make sure you deployed as "Web app" (not just saved)
3. Make sure "Who has access" is set to **Anyone**
4. Try deploying again - sometimes you need to deploy a new version

**Problem**: Getting CORS errors

**Solution**: The code already uses `mode: 'no-cors'` which should prevent CORS errors. If you still see them, make sure the Web App URL is correct.

## Need Help?

If you're stuck, check:
- Did you click "Deploy" and not just "Save"?
- Did you authorize the script when prompted?
- Is the Web App URL copied correctly (should end with `/exec`)?
- Did you update the URL in `app/checkout/page.tsx`?



