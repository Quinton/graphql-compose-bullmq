import { Queue } from 'bullmq';

export function createActiveJobsFC({ JobTC }) {
  return {
    type: [JobTC],
    args: {
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: -1,
      },
    },
    resolve: async (queue: Queue, { status, start, end }) => {
      return await queue.getActive(start, end);
    },
  };
}
