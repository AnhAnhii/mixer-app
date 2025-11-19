
export const syncToGoogleSheets = async (scriptUrl: string, data: any): Promise<boolean> => {
  try {
    // Google Apps Script Web App URL
    if (!scriptUrl) throw new Error("URL Script chưa được cấu hình");

    // CRITICAL FIX: Use 'text/plain' instead of 'application/json'.
    // Google Apps Script does not support CORS preflight for 'application/json' in simple web apps.
    // Sending as 'text/plain' prevents the browser from sending an OPTIONS request, avoiding the CORS error.
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.status === 'success') {
      return true;
    } else {
      console.error("Sync error:", result);
      throw new Error(result.message || "Lỗi không xác định từ Google Sheet");
    }
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
};

export const fetchFromGoogleSheets = async (scriptUrl: string): Promise<any> => {
    try {
        if (!scriptUrl) throw new Error("URL Script chưa được cấu hình");
        
        const response = await fetch(scriptUrl);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error;
    }
}
