import { useSearchParams } from '@solidjs/router'
import {
  For,
  Show,
  createEffect,
  createResource,
  createSignal,
  on,
  onCleanup,
  type Accessor,
} from 'solid-js'
import { searchProfessionals, type SearchParams } from '~/api/routes/search'
import Layout from '~/components/Layout'
import { ProfessionalCard } from '~/components/search/ProfessionalCard'
import SearchForm from '~/components/search/SearchForm'
import { SearchQueryParams } from '~/lib/types'

const stringGet = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined

function useDebounce<T>(
  value: Accessor<T>,
  delay: number,
): [Accessor<T>, Accessor<boolean>] {
  const [debouncedValue, setDebouncedValue] = createSignal<T>(value())
  const [isLoading, setIsLoading] = createSignal(false)

  let debounceTimer: Timer
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

        onCleanup(() => clearTimeout(debounceTimer))
      },
      { defer: true },
    ),
  )

  return [debouncedValue, isLoading]
}

export default function Search() {
  const [searchParams] = useSearchParams()

  const requestParams = () => {
    return {
      name: stringGet(searchParams[SearchQueryParams.Name]),
      country: stringGet(searchParams[SearchQueryParams.Country]),
      sort: stringGet(
        searchParams[SearchQueryParams.Sort],
      ) as SearchParams['sort'],
      page: parseInt(stringGet(searchParams[SearchQueryParams.Page]) ?? '1'),
    } satisfies SearchParams
  }
  const [debouncedRequestParams, isLoading] = useDebounce(requestParams, 500)
  const [searchResults] = createResource(
    debouncedRequestParams,
    searchProfessionals,
  )

  return (
    <Layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <h1 class="text-2xl font-bold">Search</h1>
        <SearchForm />
        <hr />
        <Show
          when={!searchResults.loading && !isLoading()}
          fallback={<div class="text-center">Loading...</div>}
        >
          <div class="grid grid-cols-2 gap-4">
            <For each={searchResults()?.professionals}>
              {(professional) => (
                <ProfessionalCard professional={professional} />
              )}
            </For>
          </div>
        </Show>
      </div>
    </Layout>
  )
}
