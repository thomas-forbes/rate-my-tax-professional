import { A } from '@solidjs/router'
import { Star, ThumbsUp } from 'lucide-solid'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ProfessionalsWithStats } from '~/drizzle/schema'

export function ProfessionalCardSkeleton() {
  return <Card class="h-24 w-full bg-zinc-100 animate-pulse rounded-md" />
}

export function ProfessionalCard({
  professional,
}: {
  professional: typeof ProfessionalsWithStats.$inferSelect
}) {
  return (
    <A href={`/professional/${professional.id}`}>
      <Card class="hover:border-zinc-400 duration-300">
        <CardHeader>
          <CardTitle>{professional.name}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <Star class="size-5 fill-yellow-400 text-yellow-400" />
              <span class="font-bold">{professional.rating}</span>
              <span class="text-muted-foreground">
                ({professional.reviewCount} reviews)
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <ThumbsUp class="size-5 text-green-500" />
              <span>{professional.useAgainPercent}% would use again</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            {/* <For each={professional.countriesServed}>
              {(country) => <Badge variant="secondary">{country}</Badge>}
            </For> */}
          </div>
        </CardContent>
      </Card>
    </A>
  )
}
