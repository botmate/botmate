export function shrinkPath(path: string, length = 20) {
  if (path.length <= length) {
    return path;
  }

  const parts = path.split('/');
  const first = parts.shift();
  const last = parts.pop();

  return `${first}/.../${last}`;
}
