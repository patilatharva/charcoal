import { TContext } from '../lib/context';

export const footerTitle = '\n\n\n# Stack\n\n';
export const footerFooter =
  '\n\nThis tree was auto-generated by [Charcoal](https://github.com/danerwilliams/charcoal)';

export function createPrBodyFooter(context: TContext, branch: string): string {
  const stack = buildLocalStackString({
    context,
    prBranch: branch,
  });

  return `${footerTitle}${stack}${footerFooter}`;
}

function buildLocalStackString({
  context,
  prBranch,
}: {
  context: TContext;
  prBranch: string;
}): string {
  const localBranchStack = [];
  // Step 1: Build ancestry stack.
  let branch = prBranch;
  while (!context.engine.isTrunk(branch)) {
    // Skip the PR branch as it gets appended in Step 2.
    if (branch != prBranch) {
      // Insert in the beginning.
      localBranchStack.unshift(branch);
    }
    const parent = context.engine.getParent(branch);
    if (!parent) {
      throw new Error('Parent branch is undefined');
    }
    branch = parent;
  }

  // Step 2: Arbitrarily determine the longest descendant path.
  // We print the stack of descendants instead of the entire tree, as
  // typically only one stack is relevant to a PR, and it looks cleaner.
  const longestDescendantPath = findLongestPath(context, prBranch);
  localBranchStack.push(...longestDescendantPath);

  return buildStackStringFromBranchNames({
    context,
    branchNames: localBranchStack,
    prBranch,
  });
}

function buildNode({
  context,
  branch,
  depth,
  prBranch,
}: {
  context: TContext;
  branch: string;
  depth: number;
  prBranch: string;
}): string | undefined {
  const prInfo = context.engine.getPrInfo(branch);

  const number = prInfo?.number;

  if (!number) {
    return;
  }

  return `\n${depth}. #${number}${branch === prBranch ? ' 👈' : ''}`;
}

// Function to find the longest path from a given node.
function findLongestPath(context: TContext, branch: string): string[] {
  // Base case.
  const children = context.engine.getChildren(branch);
  if (children.length === 0) {
    return [branch];
  }

  let longestPath: string[] = [];

  // Recursively find the longest path from each child.
  for (const child of children) {
    const childPath = findLongestPath(context, child);

    if (childPath.length > longestPath.length) {
      longestPath = childPath;
    }
  }

  return [branch, ...longestPath];
}

function buildStackStringFromBranchNames({
  context,
  branchNames,
  prBranch,
}: {
  context: TContext;
  branchNames: string[];
  prBranch: string;
}): string {
  let stackString = '';
  let depth = 1;
  for (const branch of branchNames) {
    const node = buildNode({ context, branch, depth, prBranch });
    stackString += node || '';
    depth++;
  }
  return stackString;
}
