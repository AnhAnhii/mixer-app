
export const syncToGoogleSheets = async (scriptUrl: string, data: any): Promise<boolean> => {
  try {
    if (!scriptUrl) throw new Error("URL Script chưa được cấu hình");

    // Use 'text/plain' to avoid CORS preflight issues with Google Apps Script
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
        
        // Google Apps Script GET requests usually handle CORS well, but we ensure we handle the response correctly
        const response = await fetch(scriptUrl, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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
