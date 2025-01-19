import { createAsync, query, type RouteDefinition } from '@solidjs/router'
import { For } from 'solid-js'
import { db } from '~/api/db'
import Layout from '~/components/Layout'
import { ProfessionalCard } from '~/components/search/ProfessionalCard'
import SearchForm from '~/components/search/SearchForm'
import { ProfessionalsWithStats } from '~/drizzle/schema'

const getProfessionals = query(async () => {
  'use server'
  return await db.select().from(ProfessionalsWithStats).limit(10)
}, 'professionals')

export const route: RouteDefinition = {
  preload: () => getProfessionals(),
}

export default function Search() {
  const professionals = createAsync(() => getProfessionals())
  return (
    <Layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <h1 class="text-2xl font-bold">Search</h1>
        <SearchForm />
        <hr />
        <div class="grid grid-cols-2 gap-4">
          <For each={professionals()}>
            {(professional) => <ProfessionalCard professional={professional} />}
          </For>
        </div>
      </div>
    </Layout>
  )
}
