
export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  matricule?: string;
  gender?: 'male' | 'female';
  role: 'admin' | 'chef' | 'employee' | 'responsable';
  status: 'En poste' | 'En congé' | 'Maladie' | 'Mission' | 'Formation' | 'Disponible';
  createdAt: string;
  avatar?: string;
  prenom?: string;
  notifications?: Notification[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export const addNotification = (
  targetUserIds: string[],
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error' = 'info',
  link?: string
) => {
  const usersString = localStorage.getItem('users');
  
  if (usersString) {
    try {
      const users: User[] = JSON.parse(usersString);
      const updatedUsers = users.map(user => {
        if (targetUserIds.includes(user.id)) {
          const notifications = user.notifications || [];
          notifications.unshift({
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            userId: user.id,
            title,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
            link
          });
          
          return {
            ...user,
            notifications
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Déclencher un événement pour notifier les composants
      const event = new CustomEvent('notificationsUpdated', { detail: { targetUserIds } });
      window.dispatchEvent(event);
      
      return targetUserIds.length;
    } catch (error) {
      console.error('Error updating notifications:', error);
      return 0;
    }
  }
  return 0;
};

export const getUnreadNotificationsCount = (userId: string): number => {
  const usersString = localStorage.getItem('users');
  
  if (usersString && userId) {
    try {
      const users: User[] = JSON.parse(usersString);
      const user = users.find(u => u.id === userId);
      
      if (user && user.notifications) {
        return user.notifications.filter(notification => !notification.read).length;
      }
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
    }
  }
  
  return 0;
};

export const markNotificationAsRead = (userId: string, notificationId: string): void => {
  const usersString = localStorage.getItem('users');
  
  if (usersString && userId && notificationId) {
    try {
      const users: User[] = JSON.parse(usersString);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1 && users[userIndex].notifications) {
        const updatedNotifications = users[userIndex].notifications.map(notification => {
          if (notification.id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        });
        
        users[userIndex].notifications = updatedNotifications;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Déclencher un événement pour notifier les composants
        const event = new CustomEvent('notificationsUpdated', { detail: { userId } });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
};

export const getUserNotifications = (userId: string): Notification[] => {
  const usersString = localStorage.getItem('users');
  
  if (usersString && userId) {
    try {
      const users: User[] = JSON.parse(usersString);
      const user = users.find(u => u.id === userId);
      
      if (user && user.notifications) {
        return user.notifications;
      }
    } catch (error) {
      console.error('Error getting user notifications:', error);
    }
  }
  
  return [];
};

export const markAllNotificationsAsRead = (userId: string): void => {
  const usersString = localStorage.getItem('users');
  
  if (usersString && userId) {
    try {
      const users: User[] = JSON.parse(usersString);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1 && users[userIndex].notifications) {
        const updatedNotifications = users[userIndex].notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        users[userIndex].notifications = updatedNotifications;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Déclencher un événement pour notifier les composants
        const event = new CustomEvent('notificationsUpdated', { detail: { userId } });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
};

export const addProjectAssignmentNotification = (
  employeeId: string,
  projectName: string,
  subProjectName?: string,
  isAdded: boolean = true
) => {
  if (!employeeId || !projectName) return;
  
  const title = isAdded ? "Affectation à un projet" : "Retrait d'un projet";
  
  let message = "";
  if (isAdded) {
    message = subProjectName 
      ? `Vous avez été affecté au sous-projet "${subProjectName}" dans le projet "${projectName}"`
      : `Vous avez été affecté au projet "${projectName}"`;
  } else {
    message = subProjectName 
      ? `Vous avez été retiré du sous-projet "${subProjectName}" dans le projet "${projectName}"`
      : `Vous avez été retiré du projet "${projectName}"`;
  }
  
  const link = subProjectName 
    ? `/employee/subprojects/${subProjectName}`
    : `/employee/projects/${projectName}`;
    
  addNotification(
    [employeeId],
    title,
    message,
    isAdded ? 'success' : 'info',
    link
  );
};
