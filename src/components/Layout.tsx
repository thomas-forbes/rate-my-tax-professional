import { A } from '@solidjs/router'
import type { JSX } from 'solid-js'
import { Button } from '~/components/ui/button'

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div class="min-h-screen w-screen bg-background">
      <header class="bg-primary shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <A href="/" class="font-bold text-xl text-primary-foreground">
            Rate My Tax Professional
          </A>
          <div class="flex gap-4">
            <A href="/search">
              <Button variant="inverse">Find a Professional</Button>
            </A>
          </div>
        </nav>
      </header>
      {children}
    </div>
  )
}
