import { useNavigate, useParams } from '@solidjs/router'
import { Star } from 'lucide-solid'
import { createSignal, For } from 'solid-js'
import Layout from '~/components/Layout'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const complexityOptions = [
  { value: 'simple', label: 'Simple' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'complex', label: 'Complex' },
  { value: 'very-complex', label: 'Very Complex' },
]

const countries = [
  { value: 'usa', label: 'USA' },
  { value: 'uk', label: 'UK' },
  { value: 'canada', label: 'Canada' },
  { value: 'australia', label: 'Australia' },
  { value: 'other', label: 'Other' },
]

export default function RateProfessional() {
  const params = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = createSignal(0)
  const [valueRating, setValueRating] = createSignal(0)
  const [complexity, setComplexity] = createSignal<string | undefined>()
  const [wouldUseAgain, setWouldUseAgain] = createSignal(true)
  const [comment, setComment] = createSignal('')
  const [country, setCountry] = createSignal<string | undefined>()

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    // Here you would submit the rating to your backend
    console.log({
      professionalId: params.id,
      rating: rating(),
      valueRating: valueRating(),
      complexity: complexity(),
      wouldUseAgain: wouldUseAgain(),
      comment: comment(),
      country: country(),
    })
    // Navigate back to the professional's profile
    navigate(`/professional/${params.id}`)
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
                        onClick={() => setRating(value)}
                        class="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          class={`w-8 h-8 ${
                            value <= rating()
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-muted text-muted-foreground'
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
                    value={complexity() ?? ''}
                    onChange={(e) => setComplexity(e.currentTarget.value)}
                    class="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="" disabled>
                      Select complexity
                    </option>
                    <For each={complexityOptions}>
                      {(option) => (
                        <option value={option.value}>{option.label}</option>
                      )}
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
                    <For each={countries}>
                      {(option) => (
                        <option value={option.value}>{option.label}</option>
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
                    variant={wouldUseAgain() ? 'default' : 'outline'}
                    onClick={() => setWouldUseAgain(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!wouldUseAgain() ? 'default' : 'outline'}
                    onClick={() => setWouldUseAgain(false)}
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
                <Button type="submit">Submit Review</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/professional/${params.id}`)}
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
