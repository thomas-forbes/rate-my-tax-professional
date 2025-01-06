import { A } from '@solidjs/router'
import { Star, ThumbsUp } from 'lucide-solid'
import { Show } from 'solid-js'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ProfessionalsWithStats } from '~/drizzle/schema'

export function ProfessionalCardSkeleton() {
  return <Card class="h-24 w-full bg-zinc-200 animate-pulse rounded-md" />
}

export function ProfessionalCard({
  professional,
}: {
  professional: typeof ProfessionalsWithStats.$inferSelect & {
    countryName: string | null
  }
}) {
  return (
    <A href={`/professional/${professional.id}`}>
      <Card class="hover:border-zinc-400 duration-300">
        <CardHeader>
          <CardTitle>{professional.name}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
          <div class="flex items-center space-x-4 md:text-base text-sm">
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
          <Show when={professional.countryName}>
            <Badge variant="secondary" class="w-fit">
              {professional.countryName}
            </Badge>
          </Show>
        </CardContent>
      </Card>
    </A>
  )
}
