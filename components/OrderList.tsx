import React from 'react';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import { EyeIcon, PencilIcon, TrashIcon, ShoppingBagIcon, PlusIcon } from './icons';

interface OrderListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAddOrder: () => void;
  activeIndex: number | null;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onViewDetails, onEdit, onDelete, onUpdateStatus, onAddOrder, activeIndex }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    
    const getStatusColor = (status: OrderStatus) => {
        const colors = {
            [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            [OrderStatus.Processing]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            [OrderStatus.Shipped]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
            [OrderStatus.Delivered]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            [OrderStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    const getPaymentStatusInfo = (order: Order) => {
        if (order.paymentMethod === 'cod') {
            return { text: 'Thu hộ (COD)', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
        }
        
        if (order.paymentStatus === 'Paid') {
            return { text: 'Đã thanh toán', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' };
        }
        
        return { text: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' };
    };
    
    if (orders.length === 0) {
        return (
            <div className="text-center py-16 card-base border border-dashed flex flex-col items-center">
                <ShoppingBagIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg font-semibold">Không tìm thấy đơn hàng nào.</p>
                <p className="text-muted-foreground/70 mt-2 mb-6">Hãy thử thay đổi bộ lọc hoặc tạo đơn hàng mới.</p>
                <button onClick={onAddOrder} className="btn-primary flex items-center gap-2 px-4 py-2">
                    <PlusIcon className="w-5 h-5"/> Tạo đơn hàng mới
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Mã ĐH</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Khách hàng</th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Tổng tiền</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Trạng thái</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Thanh toán</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Ngày tạo</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider compact-py compact-px">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {orders.map((order, index) => {
                            const paymentStatusInfo = getPaymentStatusInfo(order);
                            return (
                                <tr 
                                  key={order.id} 
                                  className={`transition-colors duration-150 ${activeIndex === index ? 'bg-primary/10 ring-2 ring-primary relative z-10' : 'hover:bg-muted'}`}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono compact-py compact-px compact-text-sm">#{order.id.substring(0, 8)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap compact-py compact-px">
                                        <p className="text-sm font-medium text-card-foreground compact-text-sm">{order.customerName}</p>
                                        <p className="text-sm text-muted-foreground compact-text-sm">{order.customerPhone}</p>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-card-foreground font-semibold text-right compact-py compact-px compact-text-sm">{formatCurrency(order.totalAmount)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center compact-py compact-px">
                                        <select
                                            value={order.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onUpdateStatus(order.id, e.target.value as OrderStatus);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-2 border-transparent focus:border-primary focus:ring-0 appearance-none ${getStatusColor(order.status)}`}
                                        >
                                             {Object.values(OrderStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center compact-py compact-px">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paymentStatusInfo.color} compact-text-sm`}>
                                            {paymentStatusInfo.text}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground compact-py compact-px compact-text-sm">
                                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium compact-py compact-px">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => onViewDetails(order)} className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50" title="Xem chi tiết">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onEdit(order)} className="text-primary hover:opacity-80 transition-colors p-1 rounded-full hover:bg-primary/10" title="Sửa">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Xóa">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;