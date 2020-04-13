import { createQueuesFC } from './queues';
import { createQueueKeysFC } from './queueKeys';
import { createQueueFC } from './queue';
import { createJobFC } from './job';
import { SchemaComposer } from 'graphql-compose';
import { Options } from '../OptionsType';

export function createQueryFields(sc: SchemaComposer<any>, opts: Options): any {
  return {
    queueKeys: createQueueKeysFC(sc, opts),
    queues: createQueuesFC(sc, opts),
    queue: createQueueFC(sc, opts),
    job: createJobFC(sc, opts),
  };
}
