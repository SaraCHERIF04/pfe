
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AmountSectionProps {
  grossAmount: string;
  netAmount: string;
  tvaAmount: string;
  totalAmount: string;
  onGrossAmountChange: (value: string) => void;
  onNetAmountChange: (value: string) => void;
  onTvaAmountChange: (value: string) => void;
  onTotalAmountChange: (value: string) => void;
}

const AmountSection = ({
  grossAmount,
  netAmount,
  tvaAmount,
  totalAmount,
  onGrossAmountChange,
  onNetAmountChange,
  onTvaAmountChange,
  onTotalAmountChange,
}: AmountSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="grossAmount">Brut H.T</Label>
          <Input
            id="grossAmount"
            type="number"
            value={grossAmount}
            onChange={(e) => onGrossAmountChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="netAmount">Montant Net H.T</Label>
          <Input
            id="netAmount"
            type="number"
            value={netAmount}
            onChange={(e) => onNetAmountChange(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="tvaAmount">Montant TVA</Label>
          <Input
            id="tvaAmount"
            type="number"
            value={tvaAmount}
            onChange={(e) => onTvaAmountChange(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="totalAmount">Montant T.T.C</Label>
          <Input
            id="totalAmount"
            type="number"
            value={totalAmount}
            onChange={(e) => onTotalAmountChange(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
};

export default AmountSection;
