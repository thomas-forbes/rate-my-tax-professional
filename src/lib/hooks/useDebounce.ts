import type { Accessor } from 'solid-js'
import { createEffect, createSignal, on, onCleanup } from 'solid-js'

export function useDebounce<T>(
  value: Accessor<T>,
  delay: number,
): [Accessor<T>, Accessor<boolean>] {
  const [debouncedValue, setDebouncedValue] = createSignal<T>(value())
  const [isLoading, setIsLoading] = createSignal(false)

  let debounceTimer: ReturnType<typeof setTimeout>
  createEffect(
    on(
      value,
      () => {
        setIsLoading(true)

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          setDebouncedValue(() => value())
          setIsLoading(false)
        }, delay)
      },
      { defer: true },
    ),
  )

  onCleanup(() => clearTimeout(debounceTimer))

  return [debouncedValue, isLoading]
}
