import type { VehicleItem } from '@/types/models/vehicle';

export default defineEventHandler(async (event) => {

  const fields: Array<keyof VehicleItem> = ['id', 'name'];

  const sql = MySqlCreator.selectFieldAll(DatabaseTable.tbVehicle, fields);

  try {
    const result: any = await MysqlDBPool.query(sql);
    const listResult: Array<VehicleItem> = result[0];

    return ResultJson.success(listResult);
  } catch(error) {
    throw createQueryError(error);
  }
});
