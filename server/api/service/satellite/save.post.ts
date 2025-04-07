import type { Satellite } from '@/types/models/satellite';

export default defineEventHandler(async (event) => {
  const data: Partial<Satellite> = await readBody(event);

  let sql = '';
  const now = Date.now();
  const time = dateFormat();

  if (data.id) {
    const updateData: TableCommonRowData<Satellite> = {
      ...data,
      updateTime: time
    };

    delete updateData.id;
    delete updateData.createTime;

    sql = MySqlCreator.updateOne(DatabaseTable.tbSatellite, data.id, updateData);
  } else {
    const saveData: TableCommonRowData<Satellite> = {
      ...data,
      id: now,
      updateTime: time,
      createTime: time
    };

    sql = MySqlCreator.insertOne(DatabaseTable.tbSatellite, saveData);
  }

  try {
    await MysqlDBPool.query(sql);
    return ResultJson.success(null);
  } catch (error) {
    throw createQueryError(error);
  }
});
