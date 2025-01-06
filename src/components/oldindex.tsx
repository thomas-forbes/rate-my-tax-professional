import { A, useNavigate } from '@solidjs/router'
import { createSignal } from 'solid-js'
import Layout from '~/components/Layout'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export default function Home() {
  const navigate = useNavigate()
  const [name, setName] = createSignal('')
  return (
    <Layout>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col items-center gap-8">
          <h1 class="text-4xl font-bold">Find a Professional</h1>
          <div class="flex gap-2 items-center">
            <Input
              placeholder="Someone specific..."
              class="flex-1"
              value={name()}
              onInput={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/search?name=${name()}`)
                }
              }}
            />
            <span class="text-muted-foreground text-sm">or</span>
            <A href="/search">
              <Button class="flex-1">Someone new...</Button>
            </A>
          </div>
        </div>
      </main>
    </Layout>
  )
}
