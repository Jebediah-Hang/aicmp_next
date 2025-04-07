import type { Vehicle } from './vehicle';

export interface Mission {
  id: number;
  name: string;
  payload: string;
  targetOrbit: string;
  customer: string;
  status: number;
  vehicleId: number;
  launchVehicle: Vehicle;
  launchSite: string;
  launchTime: string;
  description: string;
  remarks: string;
}

export interface MissionCountdown {
  d: string;
  h: string;
  m: string;
  s: string;
}
