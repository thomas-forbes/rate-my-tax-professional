import { createAsync } from '@solidjs/router'
import posthog from 'posthog-js'
import { createEffect, createSignal } from 'solid-js'
import type { SortOption } from '~/api/routes/search'
import { getCountries } from '~/api/server'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from '~/components/ui/combobox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '~/components/ui/select'
import { CountriesWithStats } from '~/drizzle/schema'
import useQueryState from '~/lib/hooks/useQueryState'
import { PostHogEvents } from '~/lib/posthog'
import { SearchQueryParams } from '~/lib/types'

const sortOptions: SortOption[] = [
  { value: 'rating', label: 'Rating' },
  // { value: 'value', label: 'Value' },
  { value: 'wouldUseAgain', label: 'Would Use Again' },
]

export default function SearchForm() {
  const countries = createAsync(() => getCountries())
  const [name, setName] = useQueryState(SearchQueryParams.Name, '')
  const [country, setCountry] = createSignal<
    typeof CountriesWithStats.$inferSelect | null
  >(null)
  const [sort, setSort] = createSignal<SortOption | null>(sortOptions[0])

  const [, setPageQuery] = useQueryState(SearchQueryParams.Page, null)

  const [, setSortQuery] = useQueryState(SearchQueryParams.Sort, null)
  createEffect(() => {
    if (sort()?.value == sortOptions[0].value) setSortQuery(null)
    else setSortQuery(sort()?.value ?? null)
    setPageQuery(null)
  })

  const [, setCountryCode] = useQueryState(
    SearchQueryParams.Country,
    country()?.code ?? null,
  )
  createEffect(() => {
    setCountryCode(country()?.code ?? null)
    setPageQuery(null)
  })

  let searchEventTimeout: ReturnType<typeof setTimeout> | null = null
  const onNameInputChange = (e: InputEvent) => {
    if (!(e.currentTarget instanceof HTMLInputElement)) return

    setName(e.currentTarget.value)
    setPageQuery(null)

    if (searchEventTimeout) clearTimeout(searchEventTimeout)
    searchEventTimeout = setTimeout(() => {
      posthog.capture(PostHogEvents.Search, {
        name: name(),
        country: country()?.code,
      })
    }, 5000)
  }

  const onCountryInputChange = (value: string) => {
    if (!value) setCountry(null)
  }

  const onCountryChange = (
    value: typeof CountriesWithStats.$inferSelect | null,
  ) => {
    setCountry(value)
    posthog.capture(PostHogEvents.Search, {
      name: name(),
      country: value?.code,
    })
  }

  return (
    <div class="flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <Label for="name" class="mb-2 block">
          Professional's name
        </Label>
        <Input
          id="professional-name"
          placeholder="Professional's name"
          value={name() ?? undefined}
          onInput={onNameInputChange}
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <Label for="country" class="mb-2 block">
          Country
        </Label>
        <Combobox
          placeholder="Select country"
          options={countries() ?? []}
          optionValue="code"
          optionLabel="name"
          optionTextValue="name"
          value={country()}
          defaultFilter="contains"
          onInputChange={onCountryInputChange}
          onChange={onCountryChange}
          itemComponent={(props) => (
            <ComboboxItem item={props.item}>
              {props.item.rawValue.name}{' '}
              <span class="text-sm text-muted-foreground">
                ({props.item.rawValue.numberOfProfessionals ?? 0})
              </span>
            </ComboboxItem>
          )}
        >
          <ComboboxTrigger>
            <ComboboxInput />
          </ComboboxTrigger>
          <ComboboxContent class="max-h-[300px] overflow-y-auto" />
        </Combobox>
      </div>
      <Select
        value={sort()}
        onChange={(value) => setSort(value)}
        options={sortOptions}
        optionValue="value"
        optionTextValue="label"
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue.label}</SelectItem>
        )}
      >
        <SelectTrigger>Sort</SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  )
}
