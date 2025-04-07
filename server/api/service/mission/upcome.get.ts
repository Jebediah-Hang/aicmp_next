import type { Mission } from '@/types/models/mission';
import type { Vehicle } from '@/types/models/vehicle';

function createQuerySql(size: number = 10, current: number = 1, query: Partial<Mission> = {}) {
  const tbm = DatabaseTable.tbMission, tbv = DatabaseTable.tbVehicle;
  const offset = (current - 1) * size;

  const joinField: Array<keyof Vehicle> = ['id', 'name', 'developers', 'status', 'height', 'diameter', 'weight', 'thrust', 'leoPayload', 'gtoPayload', 'description', 'photoId'];
  const joinObjStr = joinField.map(k => `'${k}', ${tbv}.${k}`).join(', ');
  const queryStr = `launchTime > NOW() AND ${tbm}.name LIKE '%${query.name || ''}%'`;

  const countSql = `SELECT COUNT(*) FROM ${tbm} WHERE ${queryStr};`;
  const selectSql = `SELECT ${tbm}.*, JSON_OBJECT(${joinObjStr}) AS launchVehicle FROM ${tbm} JOIN ${tbv} ON ${tbm}.vehicleId = ${tbv}.id WHERE ${queryStr} ORDER BY launchTime ASC LIMIT ${size} OFFSET ${offset};`

  return `${countSql}${selectSql}`;
}

export default defineEventHandler(async (event) => {
  const params: ApiPageQuery<Mission> = getQuery(event);
  const [pager, query] = separatePagerQuery(params);

  const sql = createQuerySql(pager.size, pager.current, query);

  try {
    const [result]: any = await MysqlDBPool.query(sql);

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
