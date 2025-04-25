import { addNotification } from '@/types/User';
import { toast } from "@/hooks/use-toast";

// Helper to get employee IDs from localStorage
const getEmployeeIds = (): string[] => {
  const usersString = localStorage.getItem('users');
  if (!usersString) return [];
  
  try {
    const users = JSON.parse(usersString);
    return users
      .filter((user: any) => user.role === 'employee')
      .map((user: any) => user.id);
  } catch (error) {
    console.error('Error getting employee IDs:', error);
    return [];
  }
};

// Helper to get responsable IDs from localStorage
const getResponsableIds = (): string[] => {
  const usersString = localStorage.getItem('users');
  if (!usersString) return [];
  
  try {
    const users = JSON.parse(usersString);
    return users
      .filter((user: any) => user.role === 'responsable')
      .map((user: any) => user.id);
  } catch (error) {
    console.error('Error getting responsable IDs:', error);
    return [];
  }
};

export const notifyNewMeeting = (meetingTitle: string) => {
  const employeeIds = getEmployeeIds();
  if (employeeIds.length > 0) {
    addNotification(
      employeeIds,
      "Nouvelle réunion",
      `Une nouvelle réunion "${meetingTitle}" a été créée`,
      'info',
      '/employee/reunions'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés ont été notifiés de la nouvelle réunion",
    });
  }
};

export const notifyNewDocument = (documentTitle: string) => {
  const employeeIds = getEmployeeIds();
  if (employeeIds.length > 0) {
    addNotification(
      employeeIds,
      "Nouveau document",
      `Un nouveau document "${documentTitle}" a été ajouté`,
      'info',
      '/employee/documents'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés ont été notifiés du nouveau document",
    });
  }
};

export const notifyNewIncident = (incidentTitle: string) => {
  const employeeIds = getEmployeeIds();
  const responsableIds = getResponsableIds();
  const allTargetIds = [...employeeIds, ...responsableIds];
  
  if (allTargetIds.length > 0) {
    addNotification(
      allTargetIds,
      "Nouvel incident",
      `Un nouvel incident "${incidentTitle}" a été signalé`,
      'warning',
      '/incidents'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés et responsables ont été notifiés du nouvel incident",
    });
  }
};

export const notifyNewMaitreOuvrage = (name: string) => {
  const employeeIds = getEmployeeIds();
  if (employeeIds.length > 0) {
    addNotification(
      employeeIds,
      "Nouveau maître d'ouvrage",
      `Un nouveau maître d'ouvrage "${name}" a été ajouté`,
      'info',
      '/employee/maitre-ouvrage'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés ont été notifiés du nouveau maître d'ouvrage",
    });
  }
};

export const notifyNewProject = (projectName: string) => {
  const employeeIds = getEmployeeIds();
  if (employeeIds.length > 0) {
    addNotification(
      employeeIds,
      "Nouveau projet",
      `Un nouveau projet "${projectName}" a été créé`,
      'info',
      '/employee/projects'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés ont été notifiés du nouveau projet",
    });
  }
};

export const notifyNewSubProject = (subProjectName: string, projectName: string) => {
  const employeeIds = getEmployeeIds();
  if (employeeIds.length > 0) {
    addNotification(
      employeeIds,
      "Nouveau sous-projet",
      `Un nouveau sous-projet "${subProjectName}" a été créé dans le projet "${projectName}"`,
      'info',
      '/employee/sous-projets'
    );
    
    toast({
      title: "Notification envoyée",
      description: "Les employés ont été notifiés du nouveau sous-projet",
    });
  }
};
