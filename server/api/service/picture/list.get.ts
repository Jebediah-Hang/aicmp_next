import type { PictureItem } from '@/types/models/picture';

export default defineEventHandler(async (event) => {

  const fields: Array<keyof PictureItem> = ['id', 'name'];

  const sql = MySqlCreator.selectFieldAll(DatabaseTable.tbPicture, fields);

  try {
    const result: any = await MysqlDBPool.query(sql);
    const listResult: Array<PictureItem> = result[0];

    return ResultJson.success(listResult);
  } catch(error) {
    throw createQueryError(error);
  }
});
