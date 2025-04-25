
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load meetings from localStorage
    const meetingsString = localStorage.getItem('meetings');
    if (meetingsString) {
      try {
        const meetingsList = JSON.parse(meetingsString);
        // Sort by date, newest first
        const sortedMeetings = sortByNewest(meetingsList);
        setMeetings(sortedMeetings);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    }
  }, []);
  
  // Helper function to sort by newest first
  const sortByNewest = (items) => {
    return [...items].sort((a, b) => {
      // Sort by date, newest first
      try {
        const dateA = new Date(a.date || a.createdAt || 0);
        const dateB = new Date(b.date || b.createdAt || 0);
        return dateB - dateA;
      } catch (error) {
        return 0; // Keep original order if there's an error
      }
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      case 'à venir':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Group meetings by month and year
  const groupedMeetings = meetings.reduce((acc, meeting) => {
    try {
      const date = new Date(meeting.date);
      const key = `${date.getMonth()}-${date.getFullYear()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(meeting);
      return acc;
    } catch (error) {
      console.error('Error grouping meeting:', error);
      return acc;
    }
  }, {});
  
  // Filter meetings if search term is provided
  const filteredGroups = Object.entries(groupedMeetings).filter(([_, meetingsList]) => 
    meetingsList.some(meeting => 
      meeting.pvNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meeting.location && meeting.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meeting.description && meeting.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Réunion</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={() => navigate('/reunion/new')} 
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(([key, meetingsList]) => (
            React.Children.toArray(
              meetingsList.map((meeting) => (
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/reunion/${meeting.id}`)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(meeting.status)}`}>
                        {meeting.status || 'à venir'}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(meeting.date)}</span>
                    </div>
                    <h3 className="font-medium">{meeting.pvNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{meeting.location}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center">
                    <div className="flex -space-x-1">
                      {meeting.attendees && meeting.attendees.slice(0, 3).map((attendee, idx) => (
                        <img 
                          key={idx}
                          src={attendee.avatar} 
                          alt={attendee.name} 
                          className="h-6 w-6 rounded-full border border-white"
                        />
                      ))}
                      {meeting.attendees && meeting.attendees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                          +{meeting.attendees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune réunion trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
