import type { NitroFetchRequest } from 'nitropack';

export class DatabaseTable {

  static tbDictionary = 'tb_dictionary';

  static tbSatellite = 'tb_satellite';

  static tbMission = 'tb_mission';

  static tbVehicle = 'tb_vehicle';

  static tbPicture = 'tb_picture';

  static tbUser = 'tb_user';

}

const authApis: Array<NitroFetchRequest> = [
  '/api/service/dictionary/dict/delete',
  '/api/service/dictionary/dict/save',
  '/api/service/mission/delete',
  '/api/service/mission/save',
  '/api/service/picture/delete',
  '/api/service/picture/save',
  '/api/service/vehicle/delete',
  '/api/service/vehicle/save',
  '/api/service/satellite/delete',
  '/api/service/satellite/save',
  '/api/service/user/register',
  '/api/service/user/edit'
];

export const authApiSets: Set<NitroFetchRequest> = new Set(authApis);
