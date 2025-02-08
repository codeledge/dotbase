export const countLeadingTabs = (input: string): number => {
  var count = 0;
  var index = 0;
  while (input.charAt(index++) === "\t") {
    count++;
  }
  return count;
};
