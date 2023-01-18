import { untilDestroyed } from '@ngneat/until-destroy'

export default function tillDestroyed(context: unknown) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return untilDestroyed(context, 'disconnectedCallback')
}
