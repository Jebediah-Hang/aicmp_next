export default defineEventHandler(async (event) => {
  const params: ApiDeleteQuery = getQuery(event);
  const ids = params.ids.split(',').map(i => Number(i));

  const sql = MySqlCreator.deleteList(DatabaseTable.tbPicture, ids);

  try {
    await MysqlDBPool.query(sql);
    return ResultJson.success(null);
  } catch(error) {
    throw createQueryError(error);
  }
});
