import { ChangedFiles } from '@withgraphite/gti-cli-shared-types';
import yargs from 'yargs';
import { graphite } from '../../lib/runner';

const args = {
  branch: {
    demandOption: true,
    type: 'string',
    positional: true,
    describe: 'The branch to lookup.',
  },
} as const;

export const command = 'changed-files [branch]';
export const canonical = 'interactive changed-files';
export const description = false;
export const builder = args;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    const filesChanged = context.engine.getChangedFiles(argv.branch);

    context.splog.info(
      JSON.stringify({
        files: filesChanged.map((file) => ({
          path: file.path,
          status: {
            added: 'TRACKED_ADD' as const,
            modified: 'MODIFIED' as const,
            deleted: 'TRACKED_REMOVE' as const,
            renamed: 'MODIFIED' as const,
            copied: 'TRACKED_ADD' as const,
          }[file.status],
        })),
        total: filesChanged.length,
      } as ChangedFiles)
    );
  });
};
