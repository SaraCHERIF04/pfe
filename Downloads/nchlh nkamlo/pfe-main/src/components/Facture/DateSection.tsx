
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateSectionProps {
  invoiceDate: string;
  receptionDate: string;
  onInvoiceDateChange: (value: string) => void;
  onReceptionDateChange: (value: string) => void;
}

const DateSection = ({
  invoiceDate,
  receptionDate,
  onInvoiceDateChange,
  onReceptionDateChange,
}: DateSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label htmlFor="invoiceDate">Date de factorisation</Label>
        <Input
          id="invoiceDate"
          type="date"
          value={invoiceDate}
          onChange={(e) => onInvoiceDateChange(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="receptionDate">Date réception</Label>
        <Input
          id="receptionDate"
          type="date"
          value={receptionDate}
          onChange={(e) => onReceptionDateChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default DateSection;
