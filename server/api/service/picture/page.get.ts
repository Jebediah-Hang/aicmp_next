import type { PictureItem } from '@/types/models/picture';

export default defineEventHandler(async (event) => {
  const params: ApiPageQuery<PictureItem> = getQuery(event);
  const [pager, query] = separatePagerQuery(params);

  const fields: Array<keyof TableCommonRowData<PictureItem>> = ['id', 'name', 'createTime', 'updateTime'];

  const countSql = MySqlCreator.countLikeAll(DatabaseTable.tbPicture, query);
  const selectSql = MySqlCreator.selectFieldLikePage(DatabaseTable.tbPicture, fields, pager.size, pager.current, query);

  try {
    const [result]: any = await MysqlDBPool.query(`${countSql}${selectSql}`);

    const [countResult]: MySQLQueryCountRes = result[0];
    const listResult: Array<TableCommonRowData<PictureItem>> = result[1];

    listResult.forEach(picture => {
      const { updateTime, createTime } = picture;

      picture.updateTime = dateFormat(new Date(<string>updateTime));
      picture.createTime = dateFormat(new Date(<string>createTime));
    });

    return ResultJson.success({ total: countResult["COUNT(*)"], current: pager.current, list: listResult });
  } catch (error) {
    throw createQueryError(error);
  }
});
