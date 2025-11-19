
import React, { useState } from 'react';
import type { Product, ProductVariant } from '../types';
import { PencilIcon, TrashIcon, ChevronDownIcon, PlusIcon, CubeIcon, SparklesIcon } from './icons';
import InventoryForecastModal from './InventoryForecastModal';

interface InventoryListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddProduct: () => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ products, onEdit, onDelete, onAddProduct }) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);

  const toggleProductExpansion = (productId: string) => {
    const newSet = new Set(expandedProducts);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    setExpandedProducts(newSet);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  const getStockStatusColor = (variant: ProductVariant) => {
    if (variant.stock <= 0) return 'text-red-600 font-semibold dark:text-red-400';
    if (variant.stock <= variant.lowStockThreshold) return 'text-yellow-600 font-semibold dark:text-yellow-400';
    return 'text-card-foreground';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Quản lý Kho hàng</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsForecastModalOpen(true)} className="btn-secondary flex items-center gap-2 px-4 py-2 shadow-sm bg-teal-600 hover:bg-teal-700 text-white">
                <SparklesIcon className="w-5 h-5"/>Dự báo Nhập hàng (AI)
            </button>
            <button onClick={onAddProduct} className="btn-primary flex items-center gap-2 px-4 py-2 shadow-sm">
                <PlusIcon className="w-5 h-5"/>Thêm sản phẩm
            </button>
          </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-16 card-base border border-dashed flex flex-col items-center">
          <CubeIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg font-semibold">Kho hàng của bạn đang trống.</p>
          <p className="text-muted-foreground/70 mt-2 mb-6">Nhấn "Thêm sản phẩm" để bắt đầu quản lý kho.</p>
           <button onClick={onAddProduct} className="btn-primary flex items-center gap-2 px-4 py-2">
              <PlusIcon className="w-5 h-5"/>Thêm sản phẩm
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="w-1/2 px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider compact-px compact-py">Sản phẩm</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider compact-px compact-py">Tổng tồn kho</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider compact-px compact-py">Giá bán</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider compact-px compact-py">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {products.map(product => (
                  <React.Fragment key={product.id}>
                    <tr className="hover:bg-muted cursor-pointer" onClick={() => toggleProductExpansion(product.id)}>
                      <td className="px-6 py-4 whitespace-nowrap compact-px compact-py">
                        <div className="flex items-center">
                          <ChevronDownIcon className={`w-5 h-5 text-muted-foreground/70 mr-2 transition-transform ${expandedProducts.has(product.id) ? 'rotate-180' : ''}`} />
                          <span className="text-sm font-medium text-card-foreground compact-text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground text-right font-medium compact-px compact-py compact-text-sm">
                        {product.variants.reduce((sum, v) => sum + v.stock, 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right compact-px compact-py compact-text-sm">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium compact-px compact-py">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); onEdit(product); }} className="text-primary hover:opacity-80 transition-colors p-1 rounded-full hover:bg-primary/10" title="Sửa">
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" title="Xóa">
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedProducts.has(product.id) && (
                      <tr>
                        <td colSpan={4} className="p-0">
                          <div className="p-4 bg-muted/30">
                            <h4 className="text-sm font-semibold text-card-foreground mb-2 pl-2 compact-text-sm">Chi tiết tồn kho:</h4>
                            <div className="overflow-hidden border border-border rounded-md">
                                <table className="min-w-full divide-y divide-border bg-card">
                                <thead className="bg-muted/50">
                                    <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase compact-px compact-py">Size</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase compact-px compact-py">Màu sắc</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase compact-px compact-py">Tồn kho</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase compact-px compact-py">Ngưỡng sắp hết</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {product.variants.map(variant => (
                                        <tr key={variant.id}>
                                            <td className="px-4 py-3 text-sm text-card-foreground compact-px compact-py compact-text-sm">{variant.size}</td>
                                            <td className="px-4 py-3 text-sm text-card-foreground compact-px compact-py compact-text-sm">{variant.color}</td>
                                            <td className={`px-4 py-3 text-sm text-right compact-px compact-py compact-text-sm ${getStockStatusColor(variant)}`}>{variant.stock}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground text-right compact-px compact-py compact-text-sm">{variant.lowStockThreshold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <InventoryForecastModal isOpen={isForecastModalOpen} onClose={() => setIsForecastModalOpen(false)} products={products} />
    </div>
  );
};

export default InventoryList;
