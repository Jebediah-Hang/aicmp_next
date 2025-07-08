import type { Satellite } from '@/types/models/satellite';

export default defineEventHandler(async (event) => {
  const sql = MySqlCreator.selectAll(DatabaseTable.tbSatellite);

  try {
    const result: any = await MysqlDBPool.query(sql);
    const listResult: Array<TableCommonRowData<Satellite>> = result[0];

    listResult.forEach(satellite => {
      delete satellite.createTime;
      delete satellite.updateTime;
    });

    return ResultJson.success(listResult);
  } catch (error) {
    throw createQueryError(error);
  }
});
