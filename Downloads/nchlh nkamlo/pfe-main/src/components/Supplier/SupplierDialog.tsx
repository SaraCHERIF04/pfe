import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Supplier } from '@/types/Supplier';

interface SupplierDialogProps {
  onSuppliersUpdate?: (suppliers: Supplier[]) => void;
}

export function SupplierDialog({ onSuppliersUpdate }: SupplierDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('suppliers');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSupplierName, setNewSupplierName] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();

  const saveSuppliers = (updatedSuppliers: Supplier[]) => {
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
    setSuppliers(updatedSuppliers);
    if (onSuppliersUpdate) {
      onSuppliersUpdate(updatedSuppliers);
    }
  };

  const handleAddSupplier = () => {
    if (!newSupplierName.trim()) return;

    const newSupplier: Supplier = {
      id: crypto.randomUUID(),
      name: newSupplierName.trim(),
      createdAt: new Date().toISOString(),
    };

    saveSuppliers([...suppliers, newSupplier]);
    setNewSupplierName('');
    
    toast({
      title: "Fournisseur ajouté",
      description: "Le fournisseur a été ajouté avec succès"
    });
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier || !newSupplierName.trim()) return;

    const updatedSuppliers = suppliers.map(s => 
      s.id === editingSupplier.id ? { ...s, name: newSupplierName.trim() } : s
    );

    saveSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    setNewSupplierName('');
    
    toast({
      title: "Fournisseur modifié",
      description: "Le fournisseur a été modifié avec succès"
    });
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    const updatedSuppliers = suppliers.filter(s => s.id !== supplier.id);
    saveSuppliers(updatedSuppliers);
    
    toast({
      title: "Fournisseur supprimé",
      description: "Le fournisseur a été supprimé avec succès"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Gérer les fournisseurs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gestion des fournisseurs</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nom du fournisseur"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
            />
            {editingSupplier ? (
              <Button onClick={handleUpdateSupplier}>
                Modifier
              </Button>
            ) : (
              <Button onClick={handleAddSupplier}>
                Ajouter
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span>{supplier.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewSupplierName(supplier.name);
                      setEditingSupplier(supplier);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSupplier(supplier)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
