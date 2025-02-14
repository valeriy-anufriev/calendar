export interface Appointment {
  uuid: number;
  date: Date;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

export type AppointmentFormData = Omit<Appointment, 'color'> & { remove?: boolean };
