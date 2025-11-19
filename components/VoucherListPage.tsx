import React from 'react';
import type { Voucher } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, TicketIcon } from './icons';

interface VoucherListPageProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucherId: string) => void;
  onAdd: () => void;
}

const VoucherListPage: React.FC<VoucherListPageProps> = ({ vouchers, onEdit, onDelete, onAdd }) => {
  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'fixed') {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.discountValue);
    }
    return `${voucher.discountValue}%`;
  };
  
  const formatMinOrder = (value: number | undefined) => {
    if (!value || value === 0) return 'Không';
    return `Đơn tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
        <h2 className="text-2xl font-semibold text-card-foreground">Quản lý Mã giảm giá</h2>
        <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-4 py-2 shadow-sm">
          <PlusIcon className="w-5 h-5" /> Thêm mã
        </button>
      </div>
      
      {vouchers.length === 0 ? (
        <div className="text-center py-16 card-base border border-dashed flex flex-col items-center">
          <TicketIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg font-semibold">Chưa có mã giảm giá nào.</p>
           <p className="text-muted-foreground/70 mt-2 mb-6">Nhấn "Thêm mã" để tạo mới và thu hút khách hàng.</p>
           <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-4 py-2">
               <PlusIcon className="w-5 h-5"/> Thêm mã giảm giá
           </button>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Mã</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Giảm giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Điều kiện</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {vouchers.map(v => (
                  <tr key={v.id} className="hover:bg-muted">
                    <td className="px-6 py-4 font-mono font-bold text-primary">{v.code}</td>
                    <td className="px-6 py-4 font-semibold text-card-foreground">{formatDiscount(v)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatMinOrder(v.minOrderValue)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${v.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                        {v.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => onEdit(v)} className="text-primary hover:opacity-80 p-1 rounded-full hover:bg-primary/10"><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(v.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherListPage;