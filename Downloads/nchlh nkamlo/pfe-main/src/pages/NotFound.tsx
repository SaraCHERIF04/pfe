
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine the home route based on the current path
  const getHomeRoute = () => {
    if (location.pathname.includes('/employee')) {
      return '/employee/dashboard';
    } else if (location.pathname.includes('/responsable')) {
      return '/responsable/dashboard';
    } else if (location.pathname.includes('/admin')) {
      return '/admin/users';
    } else {
      return '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! La page que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to={getHomeRoute()}>
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
