import Fuse from 'fuse.js'
import { createSignal } from 'solid-js'
import { Button } from '~/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from '~/components/ui/combobox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import useQueryState from '~/lib/hooks/useQueryState'

const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'value', label: 'Value' },
  { value: 'wouldUseAgain', label: 'Would Use Again' },
]

export default function SearchForm() {
  const [name, setName] = useQueryState('name', '')
  const [country, setCountry] = useQueryState('country', '')
  const [sort, setSort] = useQueryState('sort', '')

  const ALL_COUNTRIES = ['🇺🇸 USA', '🇬🇧 UK', '🇨🇦 Canada']

  const fuse = new Fuse(ALL_COUNTRIES, {
    threshold: 0.3,
    includeScore: true,
  })

  const [options, setOptions] = createSignal(ALL_COUNTRIES)
  const onInputChange = (value: string) => {
    if (!value) setCountry(null)
    if (!value || ALL_COUNTRIES.includes(value)) {
      setOptions(ALL_COUNTRIES)
      return
    }
    const results = fuse.search(value)
    setOptions(results.map((result) => result.item))
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
          onInput={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <Label for="country" class="mb-2 block">
          Country
        </Label>
        <Combobox
          placeholder="Select country"
          value={country() ?? undefined}
          options={options()}
          onInputChange={onInputChange}
          onChange={(value) => setCountry(value)}
          itemComponent={(props) => (
            <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>
          )}
        >
          <ComboboxTrigger>
            <ComboboxInput />
          </ComboboxTrigger>
          <ComboboxContent />
        </Combobox>
      </div>
      {/* TODO */}
      {/* <Select
        value="Apple"
        options={['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']}
        itemComponent={(props) => (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        )}
      >
        <SelectTrigger>Sort</SelectTrigger>
        <SelectContent />
      </Select> */}
      <Button onClick={() => {}}>Search</Button>
    </div>
  )
}
