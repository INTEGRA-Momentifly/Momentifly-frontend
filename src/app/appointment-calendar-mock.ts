import {Appointment} from './models/appointment.model';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    userId: 'user-1',
    description: 'Stand-up echipă',
    startDate: new Date('2026-09-28T09:00:00'),
    endDate: new Date('2026-09-28T09:30:00')
  },
  {
    id: '2',
    userId: 'user-1',
    description: 'Deep work — Design',
    startDate: new Date('2026-09-28T10:00:00'),
    endDate: new Date('2026-09-28T12:00:00')
  },
  {
    id: '3',
    userId: 'user-1',
    description: 'Sync cu clientul',
    startDate: new Date('2026-09-29T09:30:00'),
    endDate: new Date('2026-09-29T10:30:00')
  },
  {
    id: '4',
    userId: 'user-1',
    description: 'Review PR',
    startDate: new Date('2026-09-29T13:00:00'),
    endDate: new Date('2026-09-29T14:00:00')
  },
  {
    id: '5',
    userId: 'user-1',
    description: 'Prânz cu echipa',
    startDate: new Date('2026-09-30T12:30:00'),
    endDate: new Date('2026-09-30T13:30:00')
  },
  {
    id: '6',
    userId: 'user-1',
    description: 'Design review Q4',
    startDate: new Date('2026-09-30T14:00:00'),
    endDate: new Date('2026-09-30T15:30:00')
  },
  {
    id: '7',
    userId: 'user-1',
    description: 'Alergare 5k',
    startDate: new Date('2026-09-30T18:00:00'),
    endDate: new Date('2026-09-30T19:00:00')
  },
  {
    id: '8',
    userId: 'user-1',
    description: 'Sprint planning',
    startDate: new Date('2026-10-01T09:00:00'),
    endDate: new Date('2026-10-01T11:00:00')
  },
  {
    id: '9',
    userId: 'user-1',
    description: 'Sesiune focus',
    startDate: new Date('2026-10-01T14:00:00'),
    endDate: new Date('2026-10-01T16:00:00')
  },
  {
    id: '10',
    userId: 'user-1',
    description: 'Demo client final',
    startDate: new Date('2026-10-02T10:00:00'),
    endDate: new Date('2026-10-02T11:30:00')
  },
  {
    id: '11',
    userId: 'user-1',
    description: 'Retrospectivă sprint',
    startDate: new Date('2026-10-02T15:00:00'),
    endDate: new Date('2026-10-02T16:00:00')
  },
  {
    id: '12',
    userId: 'user-1',
    description: 'Sală — upper body',
    startDate: new Date('2026-10-03T08:00:00'),
    endDate: new Date('2026-10-03T09:30:00')
  },
  {
    id: '13',
    userId: 'user-1',
    description: 'Check-in săptămânal',
    startDate: new Date('2026-10-03T17:30:00'),
    endDate: new Date('2026-10-03T18:30:00')
  },
  {
    id: '14',
    userId: 'user-1',
    description: 'Lectură tehnică',
    startDate: new Date('2026-10-26T10:00:00'),
    endDate: new Date('2026-10-26T12:00:00')
  }
];
