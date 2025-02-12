export const parseLine = (
  input: string
): { name: string; verb?: string; labels: string[] } => {
  const labelRegex = /\[([^\]]*)\]/g;
  const labels: string[] = [];
  // Extract labels
  let match;
  while ((match = labelRegex.exec(input)) !== null) {
    labels.push(match[1]);
  }

  const verbRegex = /\{([^\}]*)\}/;
  const verb = input.match(verbRegex)?.[1].trim();

  // Remove labels from the name
  const name = input.replace(verbRegex, "").replace(labelRegex, "").trim();

  return { name, verb, labels };
};
