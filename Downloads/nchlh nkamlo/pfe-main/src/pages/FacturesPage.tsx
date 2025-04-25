
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Invoice } from '@/types/Invoice';

const FacturesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get invoices from localStorage
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.marche.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => navigate('/factures/new')}>
          Créer nouveau
        </Button>
      </div>

      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Rechercher une facture"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro facture</TableHead>
              <TableHead>Numéro marché</TableHead>
              <TableHead>Montant Net</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Sous projet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.marche}</TableCell>
                <TableCell>{invoice.netAmount}</TableCell>
                <TableCell>{invoice.projectId}</TableCell>
                <TableCell>{invoice.subProjectId || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/factures/${invoice.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/factures/edit/${invoice.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
                          const newInvoices = invoices.filter(i => i.id !== invoice.id);
                          localStorage.setItem('invoices', JSON.stringify(newInvoices));
                          window.location.reload();
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacturesPage;
