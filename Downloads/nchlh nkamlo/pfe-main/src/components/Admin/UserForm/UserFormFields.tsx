
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserFormSchema, STATUS_OPTIONS } from './UserFormSchema';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PhoneInput from '@/components/PhoneInput';

interface UserFormFieldsProps {
  form: UseFormReturn<z.infer<typeof UserFormSchema>>;
  onSubmit: (values: z.infer<typeof UserFormSchema>) => void;
  isEditMode: boolean;
  loading: boolean;
  userId?: string;
}

export const UserFormFields: React.FC<UserFormFieldsProps> = ({ 
  form, 
  onSubmit, 
  isEditMode,
  loading,
  userId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleDelete = () => {
    if (!userId || !isEditMode) return;
    
    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Filter out the user to delete
    const updatedUsers = storedUsers.filter((user: any) => user.id !== userId);
    
    // Update localStorage
    localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
    
    // Show toast notification
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès",
    });
    
    // Navigate back to users list
    navigate('/admin/users');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="matricule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Matricule" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  {isEditMode ? (
                    <Input 
                      type="tel" 
                      value={field.value}
                      readOnly
                      disabled
                      className="bg-gray-100"
                    />
                  ) : (
                    <PhoneInput value={field.value} onChange={field.onChange} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    {...field} 
                    readOnly={isEditMode}
                    disabled={isEditMode}
                    className={isEditMode ? "bg-gray-100" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>État</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'état" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="chef">Chef de projet</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date création</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ? format(field.value, "P", { locale: fr }) : ""}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          {isEditMode && (
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={loading}
            className="px-6"
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};
