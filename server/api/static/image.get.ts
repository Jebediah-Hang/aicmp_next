import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { lookup } from 'mime-types';

export default defineEventHandler((event) => {
  try {
    const { name }: { name: string; } = getQuery(event);

    const lastName = <string>name.split(/\\|\//).at(-1);
    const imagePath = resolve(process.cwd(), 'public/images', lastName);
    const imageBuffer = readFileSync(imagePath);

    const etag = `W/"${createHash('md5').update(imageBuffer).digest('hex')}"`;
    setHeader(event, 'ETag', etag);

    const mimeType = lookup(imagePath);
    if (mimeType) {
      setHeader(event, 'Content-Type', mimeType);
    }

    const ifNoneMatch = getHeader(event, 'If-None-Match');

    if (ifNoneMatch === etag) {
      setResponseStatus(event, 304);
      return null;
    } else {
      return imageBuffer;
    }
  } catch (error) {
    setResponseStatus(event, 404);
    return null;
  }
});
