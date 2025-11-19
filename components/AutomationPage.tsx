import React from 'react';
import type { AutomationRule } from '../types';
import { BoltIcon, PencilIcon, PlusIcon, TrashIcon } from './icons';

interface AutomationPageProps {
  rules: AutomationRule[];
  onAdd: () => void;
  onEdit: (rule: AutomationRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string, isEnabled: boolean) => void;
}

const AutomationPage: React.FC<AutomationPageProps> = ({ rules, onAdd, onEdit, onDelete, onToggle }) => {

  const getTriggerText = (trigger: string) => {
    if (trigger === 'ORDER_CREATED') return 'Khi đơn hàng được tạo';
    return 'Không rõ';
  };

  const getConditionText = (rule: AutomationRule) => {
    return rule.conditions.map(c => 
      `Tổng giá trị đơn hàng lớn hơn ${c.value.toLocaleString('vi-VN')}đ`
    ).join(' và ');
  };

  const getActionText = (rule: AutomationRule) => {
    return rule.actions.map(a => 
      `Thêm nhãn "${a.value}" cho khách hàng`
    ).join(' và ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border pb-4">
        <div>
            <h2 className="text-2xl font-semibold text-card-foreground">Quy tắc Tự động hóa</h2>
            <p className="text-sm text-muted-foreground mt-1">Tự động hóa các công việc lặp đi lặp lại để tiết kiệm thời gian.</p>
        </div>
        <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-4 py-2 shadow-sm">
          <PlusIcon className="w-5 h-5" /> Tạo quy tắc mới
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-16 card-base border border-dashed flex flex-col items-center">
          <BoltIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-lg font-semibold">Chưa có quy tắc tự động hóa nào.</p>
          <p className="text-muted-foreground/70 mt-2 mb-6">Hãy tạo quy tắc đầu tiên để hệ thống làm việc cho bạn.</p>
          <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-4 py-2">
              <PlusIcon className="w-5 h-5"/> Tạo quy tắc mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="bg-card p-4 rounded-xl border border-border flex items-start gap-4">
                <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-card-foreground">{rule.name}</h3>
                         <div className="flex items-center gap-3">
                            <div onClick={() => onToggle(rule.id, !rule.isEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${rule.isEnabled ? 'bg-primary' : 'bg-gray-300'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                            <button onClick={() => onEdit(rule)} className="text-primary hover:opacity-80 p-1 rounded-full hover:bg-primary/10"><PencilIcon className="w-5 h-5" /></button>
                            <button onClick={() => onDelete(rule.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5" /></button>
                         </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium text-card-foreground/80">Khi:</span> {getTriggerText(rule.trigger)}</p>
                        <p><span className="font-medium text-card-foreground/80">Nếu:</span> {getConditionText(rule)}</p>
                        <p><span className="font-medium text-card-foreground/80">Thì:</span> {getActionText(rule)}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutomationPage;