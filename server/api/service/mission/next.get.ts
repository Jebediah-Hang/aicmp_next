import type { Mission } from '@/types/models/mission';
import type { Vehicle } from '@/types/models/vehicle';

function createQuerySql() {
  const tbm = DatabaseTable.tbMission, tbv = DatabaseTable.tbVehicle;

  const joinField: Array<keyof Vehicle> = ['id', 'name', 'developers', 'status', 'height', 'diameter', 'weight', 'thrust', 'leoPayload', 'gtoPayload', 'description', 'photoId'];
  const joinObjStr = joinField.map(k => `'${k}', ${tbv}.${k}`).join(', ');

  return `SELECT ${tbm}.*, JSON_OBJECT(${joinObjStr}) AS launchVehicle FROM ${tbm} JOIN ${tbv} ON ${tbm}.vehicleId = ${tbv}.id WHERE launchTime > NOW() ORDER BY launchTime ASC LIMIT 1 OFFSET 0;`
}

export default defineEventHandler(async () => {
  const sql = createQuerySql();

  try {
    const result: any = await MysqlDBPool.query(sql);
    const listResult: Array<TableCommonRowData<Mission>> = result[0];

    const nextMission = listResult[0];
    if (nextMission) {
      const { launchTime, updateTime, createTime } = nextMission;

      nextMission.launchTime = dateFormat(new Date(<string>launchTime));
      nextMission.updateTime = dateFormat(new Date(<string>updateTime));
      nextMission.createTime = dateFormat(new Date(<string>createTime));

      return ResultJson.success(nextMission);
    } else {
      return ResultJson.failed(404);
    }
  } catch (error) {
    throw createQueryError(error);
  }
});
