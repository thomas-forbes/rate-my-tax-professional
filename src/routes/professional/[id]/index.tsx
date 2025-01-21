import {
  A,
  createAsync,
  query,
  redirect,
  useParams,
  type RouteDefinition,
} from '@solidjs/router'
import { eq } from 'drizzle-orm'
import { Star, ThumbsUp } from 'lucide-solid'
import { Show } from 'solid-js'
import { db } from '~/api/db'
import Layout from '~/components/Layout'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { ProfessionalsWithStats } from '~/drizzle/schema'

// Components
type ProfessionalHeaderProps = {
  professional: typeof ProfessionalsWithStats.$inferSelect
}

function ProfessionalHeader({ professional }: ProfessionalHeaderProps) {
  return (
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-4xl font-bold">{professional.name}</h1>
          <Show when={professional.credential}>
            <p class="text-xl text-muted-foreground">
              {professional.credential}
            </p>
          </Show>
        </div>
        <div class="text-right">
          <div class="text-6xl font-bold">{professional.rating}</div>
          <div class="text-sm text-muted-foreground">/ 5</div>
        </div>
      </div>

      <div class="flex flex-wrap gap-6">
        <div class="flex items-center gap-2">
          <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span>
            Overall Quality Based on {professional.reviewCount} ratings
          </span>
        </div>
        <div class="flex items-center gap-2">
          <ThumbsUp class="w-5 h-5 text-green-500" />
          <span>{professional.useAgainPercent}% would use again</span>
        </div>
      </div>

      <div class="flex gap-4">
        <A href={`/professional/${professional.id}/rate`}>
          <Button size="lg">Rate</Button>
        </A>
      </div>
    </div>
  )
}

// Commented out until we have review data
// type RatingDistributionProps = {
//   distribution: {
//     [key: number]: number
//   }
// }

// const ratingLabels = {
//   5: 'Excellent',
//   4: 'Great',
//   3: 'Good',
//   2: 'OK',
//   1: 'Poor',
// }

// function RatingDistribution({ distribution }: RatingDistributionProps) {
//   const total = () =>
//     Object.values(distribution).reduce((sum, count) => sum + count, 0)

//   return (
//     <div class="space-y-4">
//       <h3 class="text-lg font-semibold">Rating Distribution</h3>
//       <div class="space-y-3">
//         <For each={[5, 4, 3, 2, 1]}>
//           {(rating) => {
//             const count = distribution[rating] || 0
//             const percentage = total() > 0 ? (count / total()) * 100 : 0

//             return (
//               <div class="grid grid-cols-[1fr,2fr,auto] gap-4 items-center">
//                 <div class="text-sm">
//                   {ratingLabels[rating as keyof typeof ratingLabels]} {rating}
//                 </div>
//                 <Progress value={percentage} class="h-2" />
//                 <div class="text-sm font-medium w-4">{count}</div>
//               </div>
//             )
//           }}
//         </For>
//       </div>
//     </div>
//   )
// }

// Commented out until we have review data
// function ReviewList({ professionalId }: { professionalId: string }) {
//   return (
//     <div class="space-y-6">
//       <h3 class="text-lg font-semibold">Reviews</h3>
//       <div class="space-y-4">
//         <For each={reviews}>
//           {(review) => (
//             <Card>
//               <CardContent class="pt-6">
//                 <div class="space-y-4">
//                   <div class="flex items-center justify-between">
//                     <div class="flex items-center gap-4">
//                       <div class="flex items-center">
//                         <For each={Array(5).fill(0)}>
//                           {(_, i) => (
//                             <Star
//                               class={`w-4 h-4 ${
//                                 i() < review.rating
//                                   ? 'fill-yellow-400 text-yellow-400'
//                                   : 'fill-muted text-muted-foreground'
//                               }`}
//                             />
//                           )}
//                         </For>
//                       </div>
//                       <Badge variant="outline">
//                         <MapPin class="w-3 h-3 mr-1" />
//                         {review.userCountry}
//                       </Badge>
//                       <Show when={review.wouldUseAgain}>
//                         <Badge variant="secondary">
//                           <ThumbsUp class="w-3 h-3 mr-1" />
//                           Would use again
//                         </Badge>
//                       </Show>
//                     </div>
//                     <div class="text-sm text-muted-foreground">
//                       {new Date(review.date).toLocaleDateString()}
//                     </div>
//                   </div>

//                   <div class="flex gap-4 text-sm">
//                     <div>
//                       <span class="text-muted-foreground">Value: </span>
//                       {review.valueRating}/5
//                     </div>
//                     <div>
//                       <span class="text-muted-foreground">Complexity: </span>
//                       {review.complexity}
//                     </div>
//                   </div>

//                   <p class="text-sm">{review.comment}</p>

//                   <div class="text-sm text-muted-foreground">
//                     {review.helpful} people found this helpful
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </For>
//       </div>
//     </div>
//   )
// }

// Commented out until we have similar professionals data
// function SimilarProfessionals({
//   currentProfessionalId,
// }: {
//   currentProfessionalId: string
// }) {
//   return (
//     <div class="space-y-4">
//       <For each={similarProfessionals}>
//         {(professional) => (
//           <A
//             href={`/professional/${professional.id}`}
//             class="flex items-center justify-between hover:bg-muted p-2 rounded-md transition-colors"
//           >
//             <div class="font-medium">{professional.name}</div>
//             <div class="flex items-center gap-1">
//               <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
//               <span class="font-bold">{professional.rating.toFixed(2)}</span>
//             </div>
//           </A>
//         )}
//       </For>
//     </div>
//   )
// }

const getProfessional = query(async () => {
  'use server'
  const params = useParams()
  const professional = (
    await db
      .select()
      .from(ProfessionalsWithStats)
      .where(eq(ProfessionalsWithStats.id, params.id))
      .limit(1)
  )[0]

  if (!professional) redirect('/')
  return professional
}, 'professional')

export const route: RouteDefinition = {
  preload: () => getProfessional(),
}

export default function ProfessionalProfile() {
  const professional = createAsync(() => getProfessional())
  return (
    <Layout>
      <Show when={professional()} fallback={<div>Loading...</div>}>
        {(professional) => (
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
            <div class="grid gap-8 md:grid-cols-[2fr,1fr]">
              <div class="space-y-8">
                {/* Main Profile Section */}
                <ProfessionalHeader professional={professional()} />

                {/* Rating Distribution - Commented out until we have the data */}
                {/* <Card>
                  <CardContent class="pt-6">
                    <Suspense fallback={<div>Loading ratings...</div>}>
                      <RatingDistribution distribution={professional.ratingDistribution} />
                    </Suspense>
                  </CardContent>
                </Card> */}

                {/* Reviews - Commented out until we have the data */}
                {/* <Suspense fallback={<div>Loading reviews...</div>}>
                  <ReviewList professionalId={professional.id} />
                </Suspense> */}
              </div>

              {/* Sidebar */}
              <div class="space-y-8">
                <Card>
                  <CardContent class="pt-6">
                    <div class="space-y-4">
                      {/* Removed valueRating and complexityScore since they're not in the schema yet */}
                      <div>
                        <div class="text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </div>
                        <div class="text-lg">{professional().address}</div>
                        <div class="text-sm text-muted-foreground">
                          {professional().country}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Similar Professionals - Commented out until we have the data */}
                {/* <Card>
                  <CardContent class="pt-6">
                    <h3 class="text-lg font-semibold mb-4">
                      Similar Tax Professionals
                    </h3>
                    <Suspense fallback={<div>Loading similar professionals...</div>}>
                      <SimilarProfessionals currentProfessionalId={professional.id} />
                    </Suspense>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        )}
      </Show>
    </Layout>
  )
}
