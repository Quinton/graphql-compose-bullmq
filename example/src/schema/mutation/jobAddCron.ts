import { getQueue } from './helpers/queueGet';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobAddCronFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobAddCronPayload',
      fields: {
        job: getJobTC(sc),
      },
    }),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: sc.createInputTC({
        name: 'JobOptionsInputCron',
        fields: {
          priority: 'Int',
          delay: 'Int',
          attempts: 'Int',
          backoff: 'Int', // | TODO: BackoffOptions
          lifo: 'Boolean',
          timeout: 'Int',
          jobId: 'String',
          removeOnComplete: 'Boolean', //TODO: bool or int
          removeOnFail: 'Boolean', //TODO: bool or int
          stackTraceLimit: 'Int',
          repeat: sc
            .createInputTC({
              name: 'JobOptionsInputRepeatCron',
              fields: {
                tz: 'String',
                endDate: 'Date',
                limit: 'Int',
                cron: 'String!',
                startDate: 'Date',
              },
            })
            .getTypeNonNull(),
        },
      }),
    },
    resolve: async (_, { prefix, queueName, jobName, data, options }) => {
      const queue = getQueue(prefix, queueName);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
