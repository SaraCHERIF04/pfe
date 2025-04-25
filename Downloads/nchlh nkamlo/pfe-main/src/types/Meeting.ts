
export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  pvNumber?: string;
  attendees: Array<{
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  projectId?: string;
  subProjectId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  documents?: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}
