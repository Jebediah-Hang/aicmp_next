import type { Mission } from '@/types/models/mission';

export default defineEventHandler(async (event) => {
  const data: Partial<Mission> = await readBody(event);

  let sql = '';
  const now = Date.now();
  const time = dateFormat();

  delete data.launchVehicle;

  if (data.id) {
    const updateData: TableCommonRowData<Mission> = {
      ...data,
      updateTime: time
    };

    delete updateData.id;
    delete updateData.createTime;

    sql = MySqlCreator.updateOne(DatabaseTable.tbMission, data.id, updateData);
  } else {
    const saveData: TableCommonRowData<Mission> = {
      ...data,
      id: now,
      updateTime: time,
      createTime: time
    };

    sql = MySqlCreator.insertOne(DatabaseTable.tbMission, saveData);
  }

  try {
    await MysqlDBPool.query(sql);
    return ResultJson.success(null);
  } catch (error) {
    throw createQueryError(error);
  }
});
