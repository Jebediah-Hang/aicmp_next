import { createHash } from 'node:crypto';
import type { Picture } from '@/types/models/picture';

export default defineEventHandler(async (event) => {
  const { id }: { id: number; } = getQuery(event);

  const sql = MySqlCreator.selectOne(DatabaseTable.tbPicture, id);

  try {
    const result: any = await MysqlDBPool.query(sql);
    const listResult: Array<TableCommonRowData<Picture>> = result[0];

    const resContent = listResult[0]?.content;

    if (resContent) {
      const etag = `W/"${createHash('md5').update(resContent).digest('hex')}"`;
      setHeader(event, 'ETag', etag);

      const ifNoneMatch = getHeader(event, 'If-None-Match');

      if (ifNoneMatch === etag) {
        setResponseStatus(event, 304);
        return null;
      } else {
        return ResultJson.success(resContent);
      }
    } else {
      return ResultJson.failed(404);
    }

  } catch (error) {
    throw createQueryError(error);
  }
});
