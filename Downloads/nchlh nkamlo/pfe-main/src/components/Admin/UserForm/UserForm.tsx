
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/User';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormSchema } from './UserFormSchema';
import { UserFormHeader } from './UserFormHeader';
import { UserFormFields } from './UserFormFields';

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Initialize form with useForm hook
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: '',
      prenom: '',
      email: '',
      telephone: '',
      matricule: '',
      gender: 'male' as const,
      role: 'employee' as const,
      status: 'En poste',
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      // Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Find the user in our stored data
      const user = storedUsers.find((u: UserType) => u.id === id);
      
      if (user) {
        form.reset({
          name: user.name,
          prenom: user.prenom || '',
          email: user.email,
          telephone: user.telephone || '',
          matricule: user.matricule || '',
          gender: user.gender || 'male',
          role: user.role,
          status: user.status || 'En poste',
          createdAt: new Date(user.createdAt)
        });
      } else {
        // If user not found, redirect back to users list
        toast({
          title: "Utilisateur non trouvé",
          description: "L'utilisateur que vous essayez de modifier n'existe pas",
          variant: "destructive",
        });
        navigate('/admin/users');
      }
    }
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = (values: z.infer<typeof UserFormSchema>) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate a unique ID for the new user
      const newUserId = isEditMode ? id : String(Date.now());
      
      // Generate avatar URL
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name + ' ' + values.prenom)}&background=random`;
      
      // Create the new user object
      const newUser: UserType = {
        id: newUserId as string,
        name: values.name,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone,
        matricule: values.matricule,
        gender: values.gender,
        role: values.role,
        status: values.status,
        createdAt: values.createdAt.toISOString(),
        avatar: avatarUrl
      };
      
      // Save to localStorage (for persistence between page refreshes)
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      if (isEditMode) {
        // Update existing user
        const updatedUsers = existingUsers.map((user: UserType) => 
          user.id === id ? newUser : user
        );
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      } else {
        // Add new user
        existingUsers.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
      }
      
      toast({
        title: isEditMode ? "Utilisateur mis à jour" : "Utilisateur créé",
        description: `L'utilisateur ${values.name} ${values.prenom} a été ${isEditMode ? 'mis à jour' : 'créé'} avec succès`,
      });
      
      navigate('/admin/users');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <UserFormHeader 
          isEditMode={isEditMode} 
          onCancel={() => navigate('/admin/users')} 
        />
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                {isEditMode && form.getValues("name") && form.getValues("prenom") 
                  ? `${form.getValues("name").charAt(0)}${form.getValues("prenom").charAt(0)}`
                  : 'NU'}
              </div>
            </div>
            
            <div className="flex-grow">
              <UserFormFields 
                form={form} 
                onSubmit={onSubmit} 
                isEditMode={isEditMode}
                loading={loading}
                userId={id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
