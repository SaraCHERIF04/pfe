
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/Invoice';

const FinancierFactureDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  
  useEffect(() => {
    const invoicesData = localStorage.getItem('invoices');
    if (invoicesData && id) {
      const invoices = JSON.parse(invoicesData);
      const invoiceData = invoices.find((i: Invoice) => i.id === id);
      setInvoice(invoiceData || null);
    }
  }, [id]);

  if (!invoice) {
    return <div>Facture non trouvée</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={() => navigate('/financier/factures')}
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <h1 className="text-2xl font-bold">Facture {invoice.invoiceNumber}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Numéro de marché</p>
              <p>{invoice.marche}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fournisseur</p>
              <p>{invoice.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dates</p>
              <p>Facture: {invoice.invoiceDate}</p>
              <p>Réception: {invoice.receptionDate}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Montants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Montant brut</p>
              <p>{invoice.grossAmount} Da</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TVA</p>
              <p>{invoice.tvaAmount} Da</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant net</p>
              <p>{invoice.netAmount} Da</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-lg font-bold">{invoice.totalAmount} Da</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancierFactureDetailsPage;
