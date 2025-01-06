// @refresh reload
import { Meta, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { Toaster } from 'solid-sonner'
import PostHogPageView from '~/lib/posthog'
import './app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <Suspense>
          <MetaProvider>
            <Title>Rate My Tax Professional</Title>
            <Meta
              name="description"
              content="Recommendations of US accountants and tax professionals all over the world in Canada, United Kingdom, France, Germany, Australia. Find an accountant now!"
            />

            {props.children}

            <PostHogPageView />
            <Toaster />
          </MetaProvider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
