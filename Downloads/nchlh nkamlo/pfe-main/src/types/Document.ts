
export type DocumentType = 'word' | 'excel' | 'pdf' | 'image' | 'autre';

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  dateAdded: string;
  projectId?: string;
  subProjectId?: string;
  description?: string;
  url?: string;
}
