import { JSX, splitProps } from 'solid-js'
import { cn } from '~/lib/cn'

export interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  class?: string
}

export function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <label
      class={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        local.class,
      )}
      {...others}
    />
  )
}
