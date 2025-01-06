import type { JSX } from 'solid-js'
import { Button } from '~/components/ui/button'

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div class="min-h-screen w-screen bg-background">
      <header class="bg-primary shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" class="font-bold md:text-xl text-primary-foreground">
            Rate My Tax Professional
          </a>
          <div class="flex gap-4 items-center">
            <a href="/about" class="text-sm text-primary-foreground">
              About
            </a>
            <a href="/">
              <Button variant="inverse">Find&nbsp;a&nbsp;Professional</Button>
            </a>
          </div>
        </nav>
      </header>
      {children}
    </div>
  )
}
