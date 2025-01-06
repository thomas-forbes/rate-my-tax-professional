import { For } from 'solid-js'
import Layout from '~/components/Layout'
import { ProfessionalCard } from '~/components/search/ProfessionalCard'
import SearchForm from '~/components/search/SearchForm'

const professionals = [
  {
    id: 1,
    name: 'John Doe',
    rating: 4.5,
    reviewCount: 32,
    countriesServed: ['USA', 'UK'],
    wouldUseAgainPercentage: 95,
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4.8,
    reviewCount: 45,
    countriesServed: ['USA', 'Canada', 'UK'],
    wouldUseAgainPercentage: 98,
  },
  // Add more mock professionals as needed
]

export default function Search() {
  return (
    <Layout>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <h1 class="text-2xl font-bold">Search</h1>
        <SearchForm />
        <hr />
        <div class="grid grid-cols-2 gap-4">
          <For each={professionals}>
            {(professional) => <ProfessionalCard professional={professional} />}
          </For>
        </div>
      </div>
    </Layout>
  )
}
