
export const syncToGoogleSheets = async (scriptUrl: string, data: any): Promise<boolean> => {
  try {
    // Google Apps Script Web App URL
    if (!scriptUrl) throw new Error("URL Script chưa được cấu hình");

    // Use text/plain to avoid CORS preflight issues with Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
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
