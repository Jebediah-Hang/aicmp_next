export interface VehicleItem {
  id: number;
  name: string;
}

export interface Vehicle extends VehicleItem {
  developers: string;
  status: number;
  height: number;
  diameter: number;
  weight: number;
  thrust: number;
  leoPayload: number;
  gtoPayload: number;
  description: string;
  photoId: number;
}
