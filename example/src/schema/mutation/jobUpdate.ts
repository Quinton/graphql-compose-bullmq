import { MutationError } from './Error';
import { ErrorCodeEnum } from '../types';
import { getQueue } from './_helpers';
import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job';

export function createJobUpdateFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: {
      name: 'JobUpdatePayload',
      fields: {
        job: getJobTC(schemaComposer),
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
      data: 'JSON!',
    },
    resolve: async (_, { queueName, id, data }, context) => {
      const queue = getQueue(queueName, context);
      let job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.update(data); //Данные заменяются полностью
      job = await queue.getJob(id);
      return {
        job,
      };
    },
  };
}
