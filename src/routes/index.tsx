import { useSearchParams, type RouteDefinition } from '@solidjs/router'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-solid'
import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  type Accessor,
} from 'solid-js'
import type { SearchParams } from '~/api/routes/search'
import { searchProfessionals } from '~/api/routes/search'
import { getCountries } from '~/api/server'
import Layout from '~/components/Layout'
import {
  ProfessionalCard,
  ProfessionalCardSkeleton,
} from '~/components/search/ProfessionalCard'
import SearchForm from '~/components/search/SearchForm'
import { useDebounce } from '~/lib/hooks/useDebounce'
import useQueryState from '~/lib/hooks/useQueryState'
import { SearchQueryParams } from '~/lib/types'

const stringGet = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : undefined

const route: RouteDefinition = {
  preload: () => getCountries(),
}

export default function Search() {
  const [searchParams] = useSearchParams()

  const requestParams = () => {
    return {
      name: stringGet(searchParams[SearchQueryParams.Name]),
      country: stringGet(searchParams[SearchQueryParams.Country]),
      sort:
        (stringGet(searchParams[SearchQueryParams.Sort]) as
          | SearchParams['sort']
          | null) || 'rating',
      page: parseInt(stringGet(searchParams[SearchQueryParams.Page]) ?? '1'),
    } satisfies SearchParams
  }
  const [debouncedRequestParams, isSearching] = useDebounce(requestParams, 300)
  const [searchResults] = createResource(
    debouncedRequestParams,
    searchProfessionals,
  )

  return (
    <Layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-2">
        {/* <h1 class="text-2xl font-bold">Search</h1> */}
        <SearchForm />
        <div class="text-sm text-muted-foreground pt-4 flex items-center gap-1">
          <Suspense
            fallback={
              <div class="w-6 h-2 rounded-full bg-zinc-200 border animate-pulse" />
            }
          >
            <span>{searchResults()?.pagination.total}</span>
          </Suspense>
          <span>results</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<Skeletons />}>
            <Switch>
              <Match when={isSearching()}>
                <Skeletons />
              </Match>
              <Match when={searchResults()?.professionals?.length === 0}>
                <div class="text-center col-span-2">No results found</div>
              </Match>
              <Match when={true}>
                <For each={searchResults()?.professionals}>
                  {(professional) => (
                    <ProfessionalCard professional={professional} />
                  )}
                </For>
              </Match>
            </Switch>
          </Suspense>
        </div>
        <Suspense>
          <Show
            when={
              searchResults()?.pagination.total &&
              searchResults()?.pagination.limit
            }
          >
            <Pagination
              limit={() => searchResults()?.pagination.limit!}
              total={() => searchResults()?.pagination.total!}
            />
          </Show>
        </Suspense>
      </div>
    </Layout>
  )
}

function Pagination({
  total,
  limit,
}: {
  total: Accessor<number>
  limit: Accessor<number>
}) {
  const [pageQuery, setPageQuery] = useQueryState(SearchQueryParams.Page, null)
  const page = () => parseInt(pageQuery() ?? '1')

  const back = () => setPageQuery(null)
  const right = () => setPageQuery((page() + 1).toString())
  const left = () => {
    const newPage = (page() - 1).toString()
    if (newPage === '1') setPageQuery(null)
    else setPageQuery(newPage)
  }

  const finalPage = () => Math.ceil(total() / limit())
  return (
    <div class="flex justify-center items-center">
      <button
        class="px-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page() === 1}
        onClick={back}
      >
        <ChevronsLeft class="size-4" />
      </button>
      <button
        class="px-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page() === 1}
        onClick={left}
      >
        <ChevronLeft class="size-4" />
      </button>
      <span class="text-sm text-muted-foreground font-mono px-2">
        {page()} of {finalPage()}
      </span>
      <button
        class="px-1 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={page() === finalPage()}
        onClick={right}
      >
        <ChevronRight class="size-4" />
      </button>

      <div class="px-1 py-2 invisible">
        <ChevronsRight class="size-4" />
      </div>
    </div>
  )
}

function Skeletons() {
  return (
    <For each={Array.from({ length: 8 })}>
      {() => <ProfessionalCardSkeleton />}
    </For>
  )
}
