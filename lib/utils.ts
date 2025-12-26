export function classNames(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
