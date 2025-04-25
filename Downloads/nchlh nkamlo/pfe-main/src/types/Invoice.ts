
export interface Invoice {
  id: string;
  contractName: string;
  contractNumber: string;
  projectId: string;   
  subProjectId?: string;
  supplier: string;
  invoiceDate: string;
  receptionDate: string;
  grossAmount: number;
  netAmount: number;
  tvaAmount: number;
  totalAmount: number;
  paymentOrderDate: string;
  paymentOrderNumber: string;
  invoiceNumber: string;
  marche: string;
  designation: string;
  createdAt: string;
  maitreOeuvre?: string;
  maitreOuvrage?: string;
}
