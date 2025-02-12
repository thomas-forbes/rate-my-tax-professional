import { useLocation } from '@solidjs/router'
import posthogClient from 'posthog-js'
import { PostHog as PostHogNode } from 'posthog-node'
import { createEffect } from 'solid-js'

export function getServerPosthog() {
  return new PostHogNode(import.meta.env.VITE_POSTHOG_PROJECT, {
    host: import.meta.env.VITE_POSTHOG_API_HOST,
  })
}

export function initClientPosthog() {
  posthogClient.init(import.meta.env.VITE_POSTHOG_PROJECT, {
    // api_host: import.meta.env.VITE_POSTHOG_API_HOST,
    api_host: `${window.location.origin}/ingest`,
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  })
}

export enum PostHogEvents {
  ReviewSubmitted = 'review_submitted',
  Search = 'search',
}

export const ANONYMOUS_ID = 'anonymous_id'

export default function PostHogPageView() {
  const location = useLocation()

  createEffect(() => {
    if (posthogClient && location) {
      let url = window.origin + location.pathname
      if (location.search) {
        url = url + location.search
      }

      posthogClient.capture('$pageview', { $current_url: url })
    }
  })

  return null
}
