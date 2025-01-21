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
import { createSignal, For } from 'solid-js'
import { toast } from 'solid-sonner'
import { db } from '~/api/db'
import Layout from '~/components/Layout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Complexity, Countries, Reviews } from '~/drizzle/schema'

const getCountries = query(async () => {
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

export default function RateProfessional() {
  const params = useParams()
  const countries = createAsync(() => getCountries())

  const rate = useAction(rateAction)
  const navigate = useNavigate()
  const [overallRating, setOverallRating] = createSignal(0)
  const [valueRating, setValueRating] = createSignal(0)
  const [complexity, setComplexity] = createSignal<Complexity>(
    Complexity.Simple,
  )
  const [useAgain, setUseAgain] = createSignal(true)
  const [comment, setComment] = createSignal('')
  const [country, setCountry] = createSignal<string | undefined>()

  const [isLoading, setIsLoading] = createSignal(false)

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await rate({
        professionalId: params.id,
        overallRating: overallRating(),
        valueRating: valueRating(),
        complexity: complexity(),
        useAgain: useAgain(),
        comment: comment(),
        country: country(),
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
              <div class="space-y-2">
                <Label>Overall Rating</Label>
                <div class="flex gap-1">
                  <For each={[1, 2, 3, 4, 5]}>
                    {(value) => (
                      <button
                        type="button"
                        onClick={() => setOverallRating(value)}
                        class="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          class={`w-8 h-8 ${
                            value <= overallRating()
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* Value Rating */}
              <div class="space-y-2">
                <Label>Value Rating</Label>
                <div class="flex gap-1">
                  <For each={[1, 2, 3, 4, 5]}>
                    {(value) => (
                      <button
                        type="button"
                        onClick={() => setValueRating(value)}
                        class="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          class={`w-8 h-8 ${
                            value <= valueRating()
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted-foreground'
                          }`}
                        />
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* Complexity */}
              <div class="space-y-2">
                <Label>How complex was your tax situation?</Label>
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
              </div>

              {/* Country */}
              <div class="space-y-2">
                <Label>Your Country</Label>
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
              </div>

              {/* Would Use Again */}
              <div class="space-y-2">
                <Label>Would you use this professional again?</Label>
                <div class="flex gap-2">
                  <Button
                    type="button"
                    variant={useAgain() ? 'default' : 'outline'}
                    onClick={() => setUseAgain(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!useAgain() ? 'default' : 'outline'}
                    onClick={() => setUseAgain(false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Comment */}
              <div class="space-y-2">
                <Label>Your Review</Label>
                <Input
                  type="text"
                  placeholder="Share your experience..."
                  value={comment()}
                  onInput={(e) => setComment(e.currentTarget.value)}
                />
              </div>

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
