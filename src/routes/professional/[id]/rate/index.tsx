import {
  action,
  createAsync,
  query,
  useAction,
  useNavigate,
  useParams,
  type RouteDefinition,
} from '@solidjs/router'
import { LoaderCircle, Star } from 'lucide-solid'
import {
  createSignal,
  For,
  type Accessor,
  type JSX,
  type Setter,
} from 'solid-js'
import { toast } from 'solid-sonner'
import { db } from '~/api/db'
import Layout from '~/components/Layout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Complexity, Countries, Reviews } from '~/drizzle/schema'
import { cn } from '~/lib/cn'

const getCountries = query(async () => {
  'use server'
  const countries = await db.select().from(Countries)
  return countries
}, 'countries')

const rateAction = action(async (data: typeof Reviews.$inferInsert) => {
  'use server'
  await db.insert(Reviews).values(data)
})

export const route: RouteDefinition = {
  preload: () => getCountries(),
}

function Labeled({
  label,
  children,
}: {
  label: string
  children: JSX.Element
}) {
  return (
    <div class="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function RatingInput({
  rating,
  setRating,
  error,
  label,
}: {
  label: string
  rating: Accessor<number | null>
  setRating: Setter<number | null>
  error: Accessor<boolean>
}) {
  return (
    <Labeled label={label}>
      <div class="flex gap-1">
        <For each={[1, 2, 3, 4, 5]}>
          {(value) => (
            <button
              type="button"
              onClick={() => setRating(rating() === value ? null : value)}
              class="p-1 hover:scale-110 transition-transform"
            >
              <Star
                class={cn(
                  'w-8 h-8',
                  (() => {
                    const _rating = rating()
                    if (_rating && value <= _rating)
                      return 'fill-yellow-400 text-yellow-400'
                    return 'text-muted-foreground'
                  })(),
                )}
              />
            </button>
          )}
        </For>
      </div>
      {error() && <p class="text-red-500 text-sm">Please select a rating</p>}
    </Labeled>
  )
}

export default function RateProfessional() {
  const params = useParams()
  const countries = createAsync(() => getCountries())

  const rate = useAction(rateAction)
  const navigate = useNavigate()
  const [overallRating, setOverallRating] = createSignal<number | null>(null)
  const [valueRating, setValueRating] = createSignal<number | null>(null)
  const [complexity, setComplexity] = createSignal<Complexity>(
    Complexity.Simple,
  )
  const [useAgain, setUseAgain] = createSignal<boolean | null>(null)
  const [comment, setComment] = createSignal('')
  const [country, setCountry] = createSignal<string | null>(null)

  const [errors, setErrors] = createSignal(
    {
      overallRating: false,
      valueRating: false,
      complexity: false,
      useAgain: false,
      comment: false,
      country: false,
    },
    { equals: false },
  )

  const [isLoading, setIsLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    console.log('uh helllo')

    try {
      const _overallRating = overallRating()
      const _valueRating = valueRating()
      const _useAgain = useAgain()
      const _complexity = complexity()
      const _comment = comment()
      const _country = country()

      const _errors = errors()
      if (!_overallRating) _errors.overallRating = true
      else _errors.overallRating = false
      if (!_valueRating) _errors.valueRating = true
      else _errors.valueRating = false
      if (!_complexity) _errors.complexity = true
      else _errors.complexity = false
      if (!_country) _errors.country = true
      else _errors.country = false
      if (!_useAgain) _errors.useAgain = true
      else _errors.useAgain = false
      if (!_comment) _errors.comment = true
      else _errors.comment = false

      setErrors(_errors)
      console.log('bruh', _errors)

      if (
        !_overallRating ||
        !_valueRating ||
        !_complexity ||
        !_country ||
        !_useAgain ||
        !_comment
      )
        return

      setIsLoading(true)
      await rate({
        professionalId: params.id,
        overallRating: _overallRating,
        valueRating: _valueRating,
        complexity: _complexity,
        useAgain: _useAgain,
        comment: _comment,
        country: _country,
      })
      toast.success('Review submitted!')
      navigate(`/professional/${params.id}`)
    } catch (e) {
      console.error(e)
      toast.error('Unable to save your review. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Overall Rating */}
              <RatingInput
                rating={overallRating}
                setRating={setOverallRating}
                error={() => errors().overallRating}
                label="Overall Rating"
              />

              {/* Value Rating */}
              <RatingInput
                rating={valueRating}
                setRating={setValueRating}
                error={() => errors().valueRating}
                label="Value Rating"
              />

              {/* Complexity */}
              <Labeled label="How complex was your tax situation?">
                <div class="relative">
                  <select
                    value={complexity()}
                    onChange={(e) =>
                      setComplexity(e.currentTarget.value as Complexity)
                    }
                    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="" disabled>
                      Select complexity
                    </option>
                    <For each={Object.values(Complexity)}>
                      {(option) => <option value={option}>{option}</option>}
                    </For>
                  </select>
                </div>
                {errors().complexity && (
                  <p class="text-red-500 text-sm">Please select a complexity</p>
                )}
              </Labeled>

              {/* Country */}
              <Labeled label="Your Country">
                <div class="relative">
                  <select
                    value={country() ?? ''}
                    onChange={(e) => setCountry(e.currentTarget.value)}
                    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    <For each={countries()}>
                      {(country) => (
                        <option value={country.code}>{country.name}</option>
                      )}
                    </For>
                  </select>
                </div>
                {errors().country && (
                  <p class="text-red-500 text-sm">Please select a country</p>
                )}
              </Labeled>

              {/* Would Use Again */}
              <Labeled label="Would you use this professional again?">
                <div class="flex gap-2">
                  <Button
                    type="button"
                    variant={useAgain() === true ? 'default' : 'outline'}
                    onClick={() => setUseAgain(useAgain() ? null : true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={useAgain() === false ? 'default' : 'outline'}
                    onClick={() =>
                      setUseAgain(useAgain() === false ? null : false)
                    }
                  >
                    No
                  </Button>
                </div>
                {errors().useAgain && (
                  <p class="text-red-500 text-sm">Please select an option</p>
                )}
              </Labeled>

              {/* Comment */}
              <Labeled label="Your Review">
                <Input
                  type="text"
                  placeholder="Share your experience..."
                  value={comment()}
                  onInput={(e) => setComment(e.currentTarget.value)}
                />
                {errors().comment && (
                  <p class="text-red-500 text-sm">Please enter a comment</p>
                )}
              </Labeled>

              {/* Submit */}
              <div class="flex gap-4">
                <Button type="submit" disabled={isLoading()}>
                  {isLoading() && (
                    <LoaderCircle class="size-4 animate-spin mr-2" />
                  )}
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/professional/${params.id}`)}
                  disabled={isLoading()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
