import type { Mission } from '@/types/models/mission';

export default defineEventHandler(async (event) => {
  const params: ApiPageQuery<Mission> = getQuery(event);
  const [pager, query] = separatePagerQuery(params);
  const orderField: keyof Mission = 'launchTime';

  const countSql = MySqlCreator.countLikeAll(DatabaseTable.tbMission, query);
  const selectSql = MySqlCreator.selectLikePage(DatabaseTable.tbMission, pager.size, pager.current, query, orderField);

  try {
    const [result]: any = await MysqlDBPool.query(`${countSql}${selectSql}`);

    const [countResult]: MySQLQueryCountRes = result[0];
    const listResult: Array<TableCommonRowData<Mission>> = result[1];

    listResult.forEach(mission => {
      const { launchTime, updateTime, createTime } = mission;

      mission.launchTime = dateFormat(new Date(<string>launchTime));
      mission.updateTime = dateFormat(new Date(<string>updateTime));
      mission.createTime = dateFormat(new Date(<string>createTime));
    });

    return ResultJson.success({ total: countResult["COUNT(*)"], current: pager.current, list: listResult });
  } catch(error) {
    throw createQueryError(error);
  }
});
