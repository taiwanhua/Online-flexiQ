export function getClassName(classNames: string[], sep: string = " ") {
  return classNames.filter(Boolean).join(sep);
}
