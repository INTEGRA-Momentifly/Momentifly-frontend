export interface Appointment {
  id: string;
  userId: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface AppointmentRequest {
  userId: string;
  description: string;
  startDate: string;
  endDate: string;
}
