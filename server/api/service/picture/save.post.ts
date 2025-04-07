import type { Picture } from '@/types/models/picture';

export default defineEventHandler(async (event) => {
  const data: Partial<Picture> = await readBody(event);

  let sql = '';
  const now = Date.now();
  const time = dateFormat();

  if (data.id) {
    const updateData: TableCommonRowData<Picture> = {
      ...data,
      updateTime: time
    };

    delete updateData.id;
    delete updateData.createTime;

    sql = MySqlCreator.updateOne(DatabaseTable.tbPicture, data.id, updateData);
  } else {
    const saveData: TableCommonRowData<Picture> = {
      ...data,
      id: now,
      updateTime: time,
      createTime: time
    };

    sql = MySqlCreator.insertOne(DatabaseTable.tbPicture, saveData);
  }

  try {
    await MysqlDBPool.query(sql);
    return ResultJson.success(null);
  } catch (error) {
    throw createQueryError(error);
  }
});
