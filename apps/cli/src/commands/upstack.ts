import yargs from 'yargs';

export const command = 'upstack <command>';
export const desc =
  'Commands that operate on a branch and its descendants. Run `gs upstack --help` to learn more.';
export const aliases = ['us'];
export const builder = function (yargs: yargs.Argv): yargs.Argv {
  return yargs
    .commandDir('upstack-commands', {
      extensions: ['js'],
    })
    .strict()
    .demandCommand();
};
