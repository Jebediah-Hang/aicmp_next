import type { Vehicle } from '@/types/models/vehicle';

export default defineEventHandler(async (event) => {
  const data: Partial<Vehicle> = await readBody(event);

  let sql = '';
  const now = Date.now();
  const time = dateFormat();

  if (data.id) {
    const updateData: TableCommonRowData<Vehicle> = {
      ...data,
      updateTime: time
    };

    delete updateData.id;
    delete updateData.createTime;

    sql = MySqlCreator.updateOne(DatabaseTable.tbVehicle, data.id, updateData);
  } else {
    const saveData: TableCommonRowData<Vehicle> = {
      ...data,
      id: now,
      updateTime: time,
      createTime: time
    };

    sql = MySqlCreator.insertOne(DatabaseTable.tbVehicle, saveData);
  }

  try {
    await MysqlDBPool.query(sql);
    return ResultJson.success(null);
  } catch (error) {
    throw createQueryError(error);
  }
});
