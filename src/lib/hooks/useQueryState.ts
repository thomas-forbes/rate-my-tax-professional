import { useSearchParams } from '@solidjs/router'
import { createEffect, createSignal, type Accessor } from 'solid-js'

export default function useQueryState(
  key: string,
  defaultValue: string | null,
): [Accessor<string | null>, (value: string | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const [value, setValue] = createSignal<string | null>(defaultValue)
  createEffect(() => {
    setValue((searchParams[key] ?? defaultValue) as string | null)
  })
  createEffect(() => {
    setSearchParams({ [key]: value() }, { replace: true })
  })
  return [value, setValue]
}
