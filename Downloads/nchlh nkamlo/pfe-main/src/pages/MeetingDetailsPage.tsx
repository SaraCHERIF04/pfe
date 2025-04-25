
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileEdit } from 'lucide-react';
import { Meeting } from '@/types/Meeting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    // Load meeting data
    const meetingsString = localStorage.getItem('meetings');
    if (meetingsString && id) {
      try {
        const meetings = JSON.parse(meetingsString);
        const foundMeeting = meetings.find((m: Meeting) => m.id === id);
        if (foundMeeting) {
          setMeeting(foundMeeting);
          
          // Get project name
          const projectsString = localStorage.getItem('projects');
          if (projectsString) {
            const projects = JSON.parse(projectsString);
            const project = projects.find((p: any) => p.id === foundMeeting.projectId);
            if (project) {
              setProjectName(project.name);
            }
          }
        } else {
          console.error('Meeting not found');
        }
      } catch (error) {
        console.error('Error loading meeting data:', error);
      }
    }
  }, [id]);

  if (!meeting) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/reunion')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Réunion non trouvée</h1>
        </div>
      </div>
    );
  }

  // Format the date and time
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'annulé': return 'text-red-500';
      case 'terminé': return 'text-green-500';
      case 'à venir': return 'text-blue-500';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/reunion')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            PV N° {meeting.pvNumber}
            {meeting.status && (
              <span className={`ml-3 text-sm ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            )}
          </h1>
        </div>
        <Button onClick={() => navigate(`/reunion/edit/${id}`)}>
          <FileEdit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réunion à {meeting.location}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Projet</p>
              <p>{projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p>{formatDate(meeting.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Heure de début</p>
              <p>{meeting.startTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Heure de fin</p>
              <p>{meeting.endTime}</p>
            </div>
          </div>

          {meeting.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="whitespace-pre-wrap">{meeting.description}</p>
              </div>
            </>
          )}

          {meeting.attendees && meeting.attendees.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Participants</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meeting.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {attendee.avatar ? (
                          <img src={attendee.avatar} alt={attendee.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-gray-500">{attendee.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                        {attendee.role && <p className="text-sm text-gray-500">{attendee.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {meeting.documents && meeting.documents.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Documents</p>
                <div className="space-y-2">
                  {meeting.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                      <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {doc.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingDetailsPage;
