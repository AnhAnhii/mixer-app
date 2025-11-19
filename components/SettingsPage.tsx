
import React, { useRef, useState } from 'react';
import type { BankInfo, Order, Product, Customer, Voucher, SocialPostConfig, UiMode, ThemeSettings, ActivityLog, AutomationRule, ReturnRequest, GoogleSheetsConfig } from '../types';
import { banks } from '../data/banks';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ArrowPathIcon, SparklesIcon } from './icons';
import { syncToGoogleSheets, fetchFromGoogleSheets } from '../services/googleSheetsService';
import { useToast } from './Toast';

interface SettingsPageProps {
  bankInfo: BankInfo | null;
  allData: {
    orders: Order[];
    products: Product[];
    customers: Customer[];
    vouchers: Voucher[];
    bankInfo: BankInfo | null;
    socialConfigs: SocialPostConfig[];
    uiMode: UiMode;
    theme: ThemeSettings;
    activityLog: ActivityLog[];
    automationRules: AutomationRule[];
    returnRequests: ReturnRequest[];
  };
  onImportData: (data: any) => void;
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  googleSheetsConfig: GoogleSheetsConfig;
  setGoogleSheetsConfig: (config: GoogleSheetsConfig) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ bankInfo, allData, onImportData, theme, setTheme, googleSheetsConfig, setGoogleSheetsConfig }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFacebookConnected, setIsFacebookConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const toast = useToast();
  
  const getBankName = (bin: string | undefined) => {
      if(!bin) return 'Không rõ';
      const bank = banks.find(b => b.bin === bin);
      return bank ? `${bank.shortName} - ${bank.name}` : 'Không rõ';
  }

  const handleExport = () => {
      const dataStr = JSON.stringify(allData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      link.download = `quanlybanhang-backup-${date}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if (!window.confirm('Bạn có chắc muốn nhập dữ liệu từ tệp này? Mọi dữ liệu hiện tại sẽ bị ghi đè!')) {
              if (fileInputRef.current) fileInputRef.current.value = '';
              return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const result = e.target?.result as string;
                  const data = JSON.parse(result);
                  // Basic validation
                  if (data.orders && data.products && data.customers) {
                      onImportData(data);
                      toast.success('Dữ liệu đã được nhập thành công!');
                  } else {
                      throw new Error('Tệp không đúng định dạng.');
                  }
              } catch (error) {
                  toast.error(`Lỗi khi nhập dữ liệu: ${error instanceof Error ? error.message : 'Unknown error'}`);
              } finally {
                   if (fileInputRef.current) fileInputRef.current.value = '';
              }
          };
          reader.readAsText(file);
      }
  };

  const handleSyncToCloud = async () => {
      if (!googleSheetsConfig.scriptUrl) {
          toast.error('Vui lòng nhập đường dẫn Web App (Script URL) trước.');
          return;
      }
      
      setIsSyncing(true);
      try {
          await syncToGoogleSheets(googleSheetsConfig.scriptUrl, allData);
          setGoogleSheetsConfig({ ...googleSheetsConfig, lastSynced: new Date().toISOString() });
          toast.success('Đã đồng bộ dữ liệu lên Google Sheet thành công!');
      } catch (error) {
          toast.error('Đồng bộ thất bại. Vui lòng kiểm tra lại đường dẫn hoặc thử lại sau.');
      } finally {
          setIsSyncing(false);
      }
  };

  const handleRestoreFromCloud = async () => {
       if (!googleSheetsConfig.scriptUrl) {
          toast.error('Vui lòng nhập đường dẫn Web App (Script URL) trước.');
          return;
      }
      if (!window.confirm('Bạn có chắc muốn tải dữ liệu từ Cloud? Dữ liệu hiện tại trên máy này sẽ bị thay thế.')) {
          return;
      }

      setIsSyncing(true);
      try {
          const data = await fetchFromGoogleSheets(googleSheetsConfig.scriptUrl);
           if (data.orders && data.products) {
              onImportData(data);
              toast.success('Đã tải và khôi phục dữ liệu từ Cloud thành công!');
           } else {
               throw new Error("Dữ liệu từ Cloud không hợp lệ hoặc trống.");
           }
      } catch (error) {
          toast.error('Tải dữ liệu thất bại. Vui lòng kiểm tra lại.');
      } finally {
          setIsSyncing(false);
      }
  };

  return (
    <div className="space-y-8 pb-10">
       <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Cài đặt Hệ thống</h2>
       </div>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Cloud Sync Section */}
        <div id="cloud-sync">
             <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
                 <SparklesIcon className="w-6 h-6 text-yellow-500" />
                 Đồng bộ Đám mây (Google Sheets)
             </h3>
             <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                 <p className="text-sm text-muted-foreground mb-4">
                     Lưu trữ toàn bộ dữ liệu của bạn lên Google Sheets hoàn toàn miễn phí. Dữ liệu sẽ được an toàn và có thể truy cập từ thiết bị khác.
                 </p>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-medium text-card-foreground mb-1">Đường dẫn Web App (Script URL)</label>
                         <input 
                            type="text" 
                            value={googleSheetsConfig.scriptUrl}
                            onChange={(e) => setGoogleSheetsConfig({ ...googleSheetsConfig, scriptUrl: e.target.value })}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full p-3 border border-input rounded-md bg-muted text-sm"
                         />
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-4 pt-2">
                         <button 
                            onClick={handleSyncToCloud}
                            disabled={isSyncing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-md hover:opacity-90 transition-colors disabled:bg-gray-400 shadow-md"
                         >
                             <ArrowUpTrayIcon className={`w-5 h-5 ${isSyncing ? 'animate-bounce' : ''}`} />
                             {isSyncing ? 'Đang đồng bộ...' : '☁️ Đồng bộ lên Cloud'}
                         </button>
                          <button 
                            onClick={handleRestoreFromCloud}
                            disabled={isSyncing}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-md hover:opacity-90 transition-colors disabled:bg-gray-400 shadow-md"
                         >
                             <ArrowDownTrayIcon className={`w-5 h-5 ${isSyncing ? 'animate-bounce' : ''}`} />
                             {isSyncing ? 'Đang tải...' : '📥 Tải về từ Cloud'}
                         </button>
                     </div>
                     {googleSheetsConfig.lastSynced && (
                         <p className="text-xs text-center text-muted-foreground mt-2">
                             Lần đồng bộ cuối: {new Date(googleSheetsConfig.lastSynced).toLocaleString('vi-VN')}
                         </p>
                     )}
                 </div>
             </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Giao diện & Chủ đề</h3>
             <div className="bg-card p-6 rounded-xl border border-border">
                {/* Palette */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Bảng màu</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div onClick={() => setTheme({ ...theme, palette: 'modern' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.palette === 'modern' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Modern</p>
                            <p className="text-xs text-muted-foreground">Mặc định, sạch sẽ.</p>
                        </div>
                        <div onClick={() => setTheme({ ...theme, palette: 'elegant' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.palette === 'elegant' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Elegant</p>
                            <p className="text-xs text-muted-foreground">Chế độ tối.</p>
                        </div>
                        <div onClick={() => setTheme({ ...theme, palette: 'classic' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.palette === 'classic' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Classic</p>
                            <p className="text-xs text-muted-foreground">Tương phản cao.</p>
                        </div>
                        <div onClick={() => setTheme({ ...theme, palette: 'glass' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.palette === 'glass' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Glass</p>
                            <p className="text-xs text-muted-foreground">Hiệu ứng kính mờ.</p>
                        </div>
                    </div>
                </div>
                 {/* Density */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Mật độ hiển thị</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => setTheme({ ...theme, density: 'comfortable' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.density === 'comfortable' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Comfortable</p>
                            <p className="text-xs text-muted-foreground">Thoáng đãng, dễ nhìn.</p>
                        </div>
                        <div onClick={() => setTheme({ ...theme, density: 'compact' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.density === 'compact' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Compact</p>
                            <p className="text-xs text-muted-foreground">Tối ưu hóa thông tin.</p>
                        </div>
                    </div>
                </div>
                {/* Style */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">Kiểu dáng</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => setTheme({ ...theme, style: 'rounded' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.style === 'rounded' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Rounded</p>
                            <p className="text-xs text-muted-foreground">Góc bo tròn mềm mại.</p>
                        </div>
                        <div onClick={() => setTheme({ ...theme, style: 'sharp' })} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${theme.style === 'sharp' ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}>
                            <p className="font-semibold">Sharp</p>
                            <p className="text-xs text-muted-foreground">Góc vuông mạnh mẽ.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Cài đặt Social</h3>
            <div className="bg-card p-6 rounded-xl border border-border">
                 <p className="text-sm text-muted-foreground mb-4">
                    Kết nối Fanpage Facebook của bạn để quản lý và tự động hóa việc trả lời bình luận, tin nhắn cho các bài viết.
                  </p>
                  {isFacebookConnected ? (
                      <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-md">
                          <span>Đã kết nối với Fanpage: <span className="font-bold">Mixer</span></span>
                          <button onClick={() => setIsFacebookConnected(false)} className="text-xs font-semibold hover:underline">Ngắt kết nối</button>
                      </div>
                  ) : (
                      <button onClick={() => setIsFacebookConnected(true)} className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow font-semibold">
                          Kết nối với Facebook
                      </button>
                  )}
                   <p className="text-xs text-gray-500 mt-2 text-center">Đây là tính năng mô phỏng. Không có kết nối thật sự nào được tạo.</p>
            </div>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Cài đặt thanh toán</h3>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Thông tin tài khoản dưới đây được sử dụng để tạo mã QR và mẫu tin nhắn chuyển khoản. Đây là thông tin mặc định của hệ thống.
              </p>
              {bankInfo ? (
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="font-medium text-muted-foreground">Ngân hàng</p>
                        <p className="text-card-foreground font-semibold">{getBankName(bankInfo.bin)}</p>
                    </div>
                    <div>
                        <p className="font-medium text-muted-foreground">Số tài khoản</p>
                        <p className="text-card-foreground font-semibold">{bankInfo.accountNumber}</p>
                    </div>
                     <div>
                        <p className="font-medium text-muted-foreground">Tên chủ tài khoản</p>
                        <p className="text-card-foreground font-semibold">{bankInfo.accountName}</p>
                    </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Chưa có thông tin thanh toán.</p>
              )}
            </div>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Quản lý Dữ liệu (File)</h3>
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                      Sao lưu toàn bộ dữ liệu ứng dụng ra file JSON hoặc nhập lại từ file backup.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow">
                          <ArrowDownTrayIcon className="w-5 h-5"/>
                          Xuất ra File
                      </button>
                      <button onClick={handleImportClick} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow">
                          <ArrowUpTrayIcon className="w-5 h-5" />
                          Nhập từ File
                      </button>
                      <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
