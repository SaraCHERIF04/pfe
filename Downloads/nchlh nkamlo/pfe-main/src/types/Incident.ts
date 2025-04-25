
export interface Incident {
  id: string;
  type: string;
  signaledBy: string;
  date: string;
  time: string;
  location: string;
  projectName: string;
  subProjectName: string;
  description: string;
  documents: File[];
  createdAt: string;
}

export interface IncidentFollowUp {
  id: string;
  incidentId: string;
  reportDate: string;
  description: string;
  documents: File[];
  createdAt: string;
}
