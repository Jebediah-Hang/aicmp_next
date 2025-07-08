import type { Vehicle } from '@/types/models/vehicle';

export default defineEventHandler(async (event) => {
  const params: ApiPageQuery<Vehicle> = getQuery(event);
  const [pager, query] = separatePagerQuery(params);

  const countSql = MySqlCreator.countLikeAll(DatabaseTable.tbVehicle, query);
  const selectSql = MySqlCreator.selectLikePage(DatabaseTable.tbVehicle, pager.size, pager.current, query);

  try {
    const [result]: any = await MysqlDBPool.query(`${countSql}${selectSql}`);

    const [countResult]: MySQLQueryCountRes = result[0];
    const listResult: Array<TableCommonRowData<Vehicle>> = result[1];

    listResult.forEach(vehicle => {
      const { updateTime, createTime } = vehicle;

      vehicle.updateTime = dateFormat(new Date(<string>updateTime));
      vehicle.createTime = dateFormat(new Date(<string>createTime));
    });

    return ResultJson.success({ total: countResult["COUNT(*)"], current: pager.current, list: listResult });
  } catch (error) {
    throw createQueryError(error);
  }
});
