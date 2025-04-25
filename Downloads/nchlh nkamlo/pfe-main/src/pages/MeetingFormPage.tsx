import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Download, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Meeting } from '@/types/Meeting';
import { User } from '@/types/User';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MeetingFormProps = {
  meeting?: Meeting;
  isEdit?: boolean;
};

type MeetingDocument = {
  id: string;
  title: string;
  url: string;
};

const MeetingFormPage: React.FC<MeetingFormProps> = ({ meeting, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: meetingId } = useParams<{ id: string }>();

  const [title, setTitle] = useState(meeting?.title || '');
  const [date, setDate] = useState(meeting?.date || '');
  const [time, setTime] = useState(meeting?.time || '');
  const [location, setLocation] = useState(meeting?.location || '');
  const [description, setDescription] = useState(meeting?.description || '');
  const [pvNumber, setPvNumber] = useState(meeting?.pvNumber || '');
  const [attendeesIds, setAttendeesIds] = useState<string[]>(meeting?.attendees?.map(attendee => attendee.id) || []);
  const [documents, setDocuments] = useState<MeetingDocument[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [openAttendeesDialog, setOpenAttendeesDialog] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<User[]>([]);

  useEffect(() => {
    // Load all users from localStorage
    const usersString = localStorage.getItem('users');
    if (usersString) {
      try {
        const users: User[] = JSON.parse(usersString);
        setAllUsers(users);
      } catch (error) {
        console.error('Error parsing users:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Load meeting details if in edit mode
    if (meetingId) {
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings: Meeting[] = JSON.parse(meetingsString);
          const foundMeeting = meetings.find(m => m.id === meetingId);
          if (foundMeeting) {
            setTitle(foundMeeting.title);
            setDate(foundMeeting.date);
            setTime(foundMeeting.time);
            setLocation(foundMeeting.location);
            setDescription(foundMeeting.description || '');
            setPvNumber(foundMeeting.pvNumber || '');
            setAttendeesIds(foundMeeting.attendees.map(attendee => attendee.id));
            setDocuments(foundMeeting.documents || []);
          } else {
            toast({
              title: "Erreur",
              description: "Réunion non trouvée.",
              variant: "destructive",
            });
            navigate("/reunion");
          }
        } catch (error) {
          console.error('Error parsing meetings:', error);
          toast({
            title: "Erreur",
            description: "Erreur lors du chargement de la réunion.",
            variant: "destructive",
          });
          navigate("/reunion");
        }
      }
    }
  }, [meetingId, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !time || !location.trim()) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis.",
        variant: "destructive",
      });
      return;
    }

    const updatedMeeting: Meeting = {
      id: meeting?.id || `meeting-${Date.now()}`,
      title,
      date,
      time,
      location,
      description,
      pvNumber,
      attendees: attendeesIds.map(id => {
        const user = allUsers.find(u => u.id === id);
        return {
          id,
          name: user?.name || 'Unknown',
          role: user?.role,
          avatar: user?.avatar
        };
      }),
      createdAt: meeting?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: documents,
    };

    try {
      const meetingsString = localStorage.getItem('meetings');
      let meetings: Meeting[] = [];

      if (meetingsString) {
        meetings = JSON.parse(meetingsString);
        if (isEdit && meetingId) {
          const index = meetings.findIndex(m => m.id === meetingId);
          if (index !== -1) {
            meetings[index] = updatedMeeting;
          } else {
            meetings.push(updatedMeeting);
          }
        } else {
          meetings.push(updatedMeeting);
        }
      } else {
        meetings = [updatedMeeting];
      }

      localStorage.setItem('meetings', JSON.stringify(meetings));

      toast({
        title: isEdit ? "Réunion modifiée" : "Réunion créée",
        description: isEdit ? "Les modifications ont été enregistrées." : "La réunion a été créée avec succès.",
      });

      navigate("/reunion");
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la réunion.",
        variant: "destructive",
      });
    }
  };

  const handleAttendeeSelect = (attendee: User) => {
    const isSelected = attendeesIds.includes(attendee.id);
    if (!isSelected) {
      setAttendeesIds([...attendeesIds, attendee.id]);
    } else {
      setAttendeesIds(attendeesIds.filter(id => id !== attendee.id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/reunion')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux réunions</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Réunion</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la réunion
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le titre de la réunion"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de la réunion
            </label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le lieu de la réunion"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date de la réunion
            </label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de la réunion
            </label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description de la réunion
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez la réunion..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="pvNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de PV
          </label>
          <Input
            type="text"
            id="pvNumber"
            value={pvNumber}
            onChange={(e) => setPvNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le numéro de PV"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Participants à la réunion
          </label>
          <div className="space-y-4">
            <Dialog open={openAttendeesDialog} onOpenChange={setOpenAttendeesDialog}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des participants
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                  <DialogTitle>Sélectionner les participants</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {allUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`attendee-${user.id}`}
                        checked={attendeesIds.includes(user.id)}
                        onChange={() => handleAttendeeSelect(user)}
                      />
                      <label
                        htmlFor={`attendee-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {user.name}
                      </label>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => setOpenAttendeesDialog(false)}>
                  Fermer
                </Button>
              </DialogContent>
            </Dialog>

            {attendeesIds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendeesIds.map(attendeeId => {
                  const attendee = allUsers.find(user => user.id === attendeeId);
                  return attendee ? (
                    <div key={attendee.id} className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
                      <img
                        src={attendee.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={attendee.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{attendee.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Aucun participant sélectionné
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            onClick={() => navigate('/reunion')}
            variant="outline"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-[#192759] hover:bg-blue-700">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingFormPage;
