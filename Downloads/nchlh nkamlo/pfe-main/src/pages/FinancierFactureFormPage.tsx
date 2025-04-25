import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/Invoice';
import { Supplier } from '@/types/Supplier';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FactureFormHeader from '@/components/Facture/FactureFormHeader';
import ContractSection from '@/components/Facture/ContractSection';
import DateSection from '@/components/Facture/DateSection';
import AmountSection from '@/components/Facture/AmountSection';
import { SupplierDialog } from '@/components/Supplier/SupplierDialog';

const FinancierFactureFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    }
  }, []);

  const [formData, setFormData] = useState({
    contractName: '',
    contractNumber: '',
    projectId: '',
    subProjectId: '',
    supplier: '',
    invoiceDate: '',
    receptionDate: '',
    grossAmount: '',
    netAmount: '',
    tvaAmount: '',
    totalAmount: '',
    paymentOrderDate: '',
    paymentOrderNumber: '',
    marche: '',
    designation: ''
  });

  useEffect(() => {
    if (isEditing) {
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const invoice = invoices.find((i: Invoice) => i.id === id);
      if (invoice) {
        setFormData({
          ...invoice,
          grossAmount: String(invoice.grossAmount),
          netAmount: String(invoice.netAmount),
          tvaAmount: String(invoice.tvaAmount),
          totalAmount: String(invoice.totalAmount),
        });
      }
    }
  }, [id, isEditing]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceNumber = isEditing ? id! : `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    
    const invoiceData: Invoice = {
      id: isEditing ? id! : uuidv4(),
      ...formData,
      grossAmount: Number(formData.grossAmount),
      netAmount: Number(formData.netAmount),
      tvaAmount: Number(formData.tvaAmount),
      totalAmount: Number(formData.totalAmount),
      createdAt: new Date().toISOString(),
      invoiceNumber
    };

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    if (isEditing) {
      const index = invoices.findIndex((i: Invoice) => i.id === id);
      invoices[index] = invoiceData;
    } else {
      invoices.unshift(invoiceData);
    }

    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    toast({
      title: isEditing ? "Facture modifiée" : "Facture créée",
      description: isEditing ? "La facture a été modifiée avec succès" : "La facture a été créée avec succès"
    });

    navigate(-1);
  };

  const handleSuppliersUpdate = (updatedSuppliers: Supplier[]) => {
    setSuppliers(updatedSuppliers);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FactureFormHeader isEditing={isEditing} onBack={handleBack} />

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ContractSection
            contractName={formData.contractName}
            contractNumber={formData.contractNumber}
            onChangeContractName={(value) => setFormData(prev => ({ ...prev, contractName: value }))}
            onChangeContractNumber={(value) => setFormData(prev => ({ ...prev, contractNumber: value }))}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="supplier">Fournisseur</Label>
              <SupplierDialog onSuppliersUpdate={handleSuppliersUpdate} />
            </div>
            <Select
              value={formData.supplier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplier: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.name}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DateSection
            invoiceDate={formData.invoiceDate}
            receptionDate={formData.receptionDate}
            onInvoiceDateChange={(value) => setFormData(prev => ({ ...prev, invoiceDate: value }))}
            onReceptionDateChange={(value) => setFormData(prev => ({ ...prev, receptionDate: value }))}
          />

          <AmountSection
            grossAmount={formData.grossAmount}
            netAmount={formData.netAmount}
            tvaAmount={formData.tvaAmount}
            totalAmount={formData.totalAmount}
            onGrossAmountChange={(value) => setFormData(prev => ({ ...prev, grossAmount: value }))}
            onNetAmountChange={(value) => setFormData(prev => ({ ...prev, netAmount: value }))}
            onTvaAmountChange={(value) => setFormData(prev => ({ ...prev, tvaAmount: value }))}
            onTotalAmountChange={(value) => setFormData(prev => ({ ...prev, totalAmount: value }))}
          />

          <div>
            <Label htmlFor="designation">Désignation de facture</Label>
            <Textarea
              id="designation"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancierFactureFormPage;
