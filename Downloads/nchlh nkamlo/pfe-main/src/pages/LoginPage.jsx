import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, mot_de_passe: password }),


      });

      const data = await response.json();

      if (response.ok) {
        const { role, id, name } = data;

        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        toast({
          title: "Connexion réussie",
          description: `Bienvenue sur le tableau de bord ${role}`,
        });

        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/admin/users');
            break;
          case 'chef':
            navigate('/project');
            break;
          case 'employee':
            navigate('/employee/projects');
            break;
          case 'responsable':
            navigate('/responsable/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.message || "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur serveur",
        description: "Impossible de contacter le serveur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-start items-center min-h-screen"
      style={{
        backgroundImage: "url('/lovable-uploads/login-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-gray-800 bg-opacity-70 p-6 rounded-xl shadow-lg ml-12 text-white">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png"
              alt="Logo"
              className="h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">SONELGAZ</h1>
              <p className="text-gray-300">Projects</p>
            </div>
          </div>
        </div>
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-center text-white">Connexion</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  className="bg-gray-800 bg-opacity-50 text-gray-300 placeholder-gray-400 border border-gray-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-300 text-center">
              Utilisez votre email et mot de passe enregistrés
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
