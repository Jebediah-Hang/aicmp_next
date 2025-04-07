import type { Satellite } from '@/types/models/satellite';

export default defineEventHandler(async (event) => {
  const params: ApiPageQuery<Satellite> = getQuery(event);
  const [pager, query] = separatePagerQuery(params);

  const countSql = MySqlCreator.countLikeAll(DatabaseTable.tbSatellite, query);
  const selectSql = MySqlCreator.selectLikePage(DatabaseTable.tbSatellite, pager.size, pager.current, query);

  try {
    const [result]: any = await MysqlDBPool.query(`${countSql}${selectSql}`);

    const [countResult]: MySQLQueryCountRes = result[0];
    const listResult: Array<TableCommonRowData<Satellite>> = result[1];

    listResult.forEach(satellite => {
      const { updateTime, createTime } = satellite;

      satellite.updateTime = dateFormat(new Date(<string>updateTime));
      satellite.createTime = dateFormat(new Date(<string>createTime));
    });

    return ResultJson.success({ total: countResult["COUNT(*)"], current: pager.current, list: listResult });
  } catch(error) {
    throw createQueryError(error);
  }
});
