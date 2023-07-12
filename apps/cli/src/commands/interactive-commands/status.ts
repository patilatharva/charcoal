import { ChangedFile, Status } from '@withgraphite/gti-cli-shared-types';
import yargs from 'yargs';
import { TStatusFile } from '../../lib/git/changed_files';
import { graphite } from '../../lib/runner';

const args = {} as const;

export const command = 'status';
export const canonical = 'interactive status';
export const description = false;
export const builder = args;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;
export const handler = async (argv: argsT): Promise<void> => {
  return graphite(argv, canonical, async (context) => {
    const statusFiles = context.engine.getStatus();
    const rebaseInProgress = context.engine.rebaseInProgress();

    const statusFilesForInteractive: ChangedFile[] = statusFiles.map(
      (file) => ({
        status: interactiveStatusFromStatus(file.status),
        path: file.path,
      })
    );

    const status: Status = {
      conflicts: rebaseInProgress,
      files: statusFilesForInteractive,
    };

    context.splog.info(JSON.stringify(status));
  });
};

function interactiveStatusFromStatus(
  status: TStatusFile['status']
): ChangedFile['status'] {
  if (status === 'unresolved') {
    return 'UNRESOLVED';
  }

  if (status === 'untracked_added') {
    return 'UNTRACKED_ADD';
  }

  if (status === 'untracked_deleted') {
    return 'UNTRACKED_REMOVE';
  }

  if (status === 'added') {
    return 'TRACKED_ADD';
  }

  if (status === 'deleted') {
    return 'TRACKED_REMOVE';
  }

  return 'MODIFIED';
}
