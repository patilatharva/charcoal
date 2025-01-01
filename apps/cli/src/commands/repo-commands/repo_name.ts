import yargs from 'yargs';
import { graphite } from '../../lib/runner';

const args = {
  set: {
    optional: true,
    type: 'string',
    alias: 's',
    describe:
      "Override the value of the repo's name in the gs config. This is expected to match the name of the repo on GitHub and should only be set in cases where gs is incorrectly inferring the repo name.",
  },
} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'name';
export const canonical = 'repo name';
export const description =
  "The current repo's name stored in gs. e.g. in 'danerwilliams/gs', this is 'gs'.";
export const builder = args;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    if (argv.set) {
      context.repoConfig.update((data) => (data.name = argv.set));
    } else {
      context.splog.info(context.repoConfig.getRepoName());
    }
  });
};
