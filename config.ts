
// ============================================================================
// CẤU HÌNH HỆ THỐNG (Kết nối Google Sheets)
// ============================================================================

// HƯỚNG DẪN CẬP NHẬT:
// 1. Mở Google Sheet chứa dữ liệu của bạn.
// 2. Vào Tiện ích mở rộng (Extensions) > Apps Script.
// 3. Nhấn nút "Triển khai" (Deploy) > "Quản lý các bản triển khai" (Manage deployments).
// 4. Copy dòng "URL ứng dụng web" (Web App URL) - bắt đầu bằng https://script.google.com/...
// 5. Dán link đó vào giữa hai dấu nháy đơn '' ở dòng bên dưới (biến GOOGLE_SCRIPT_URL).

// --- DÁN LINK CỦA BẠN VÀO ĐÂY ---
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKp7YdUb63upUye7kxLBCOi2ZgFQjRHlksM_kaqRvFvnFCAD8Xf734ZFg59xiDQKhwyw/exec'; 
// Ví dụ: export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKp7YdUb63upUye7kxLBCOi2ZgFQjRHlksM_kaqRvFvnFCAD8Xf734ZFg59xiDQKhwyw/exec';

// LƯU Ý QUAN TRỌNG:
// - Sau khi dán link, hãy đẩy code lên GitHub/Vercel.
// - Tất cả nhân viên truy cập vào trang web sẽ tự động kết nối đến Sheet này.
// - Không cần nhập tay trong phần Cài đặt nữa.
