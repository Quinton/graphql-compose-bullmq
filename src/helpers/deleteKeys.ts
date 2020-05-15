import { MutationError, ErrorCodeEnum } from './MutationError';
import { getBullConnection } from './getBullConnection';
import { Options } from '../definitions';
import { resolve } from 'dns';

export async function deleteQueue(
  prefix: string,
  queueName: string,
  opts: Options,
  checkExistence: boolean = true
): Promise<number> {
  const connection = getBullConnection(opts);

  const fullName = [prefix, queueName].join(':');

  if (checkExistence) {
    const queueExists = await connection.exists([fullName, 'meta'].join(':'));

    if (!queueExists) {
      throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
    }
  }

  const total = await new Promise<number>((resolve, reject) => {
    //redis-cli: scan 0 match fullName* count 300
    const stream = connection.scanStream({ match: fullName + '*', count: 300 });

    let total = 0;

    stream.on('data', async (keys) => {
      for (let i = 0; i < keys.length; i++) {
        const del = await connection.del(keys[i]);
        if (del) {
          total++;
        }
      }
    });

    stream.on('end', () => {
      resolve(total);
    });

    stream.on('error', reject);
  });

  return total;
}