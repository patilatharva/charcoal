import yargs from 'yargs';
import { unbranch } from '../actions/unbranch';
import { graphite } from '../lib/runner';

const args = {} as const;
type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const aliases = ['ub'];
export const command = 'unbranch';
export const canonical = 'unbranch';
export const description =
  'Delete the current branch but retain the state of files in the working tree.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphite(argv, canonical, async (context) => unbranch(context));
