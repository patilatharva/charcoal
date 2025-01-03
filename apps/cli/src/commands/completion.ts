import yargs, { Arguments } from 'yargs';
import { composeGit } from '../lib/git/git';

yargs.completion(
  'completion',
  'Set up bash or zsh tab completion.',
  //@ts-expect-error types/yargs is out of date with yargs
  // eslint-disable-next-line max-params
  (current, argv, defaultCompletion, done) => {
    return shouldCompleteBranch(current, argv)
      ? // we don't want to load a full context here, so we'll just use the git call directly
        // once we persist the meta cache to disk, we can consider using a context here
        done(Object.keys(composeGit().getBranchNamesAndRevisions()))
      : defaultCompletion();
  }
);

function shouldCompleteBranch(current: string, argv: Arguments): boolean {
  // this handles both with and without --branch because it's the only string arg
  return (
    ((argv['_'].length <= 3 &&
      // gs bco, bdl, btr, but
      // Check membership in argv to ensure that "bco" is its own entry (and not
      // a substring of another command). Since we're dealing with a positional,
      // we also want to make sure that the current argument is the positional
      // (position 3).
      ['bco', 'bdl', 'btr', 'but', 'dpr', 'uso'].includes('' + argv['_'][1])) ||
      // same as above, but one position further
      (argv['_'].length <= 4 &&
        ['b', 'branch'].includes('' + argv['_'][1]) &&
        [
          'co',
          'checkout',
          'dl',
          'delete',
          'tr',
          'track',
          'ut',
          'untrack',
        ].includes('' + argv['_'][2])) ||
      (['us', 'upstack'].includes('' + argv['_'][1]) &&
        ['o', 'onto'].includes('' + argv['_'][2]))) &&
    typeof current === 'string'
  );
}
