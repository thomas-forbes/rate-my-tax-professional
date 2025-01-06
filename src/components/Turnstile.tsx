import type { Setter } from 'solid-js'
// @ts-expect-error
import Turnstile from 'solid-turnstile'

export default function TurnstileWidget({
  setToken,
}: {
  setToken: Setter<string | null>
}) {
  return (
    <Turnstile
      theme="light"
      sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      onVerify={setToken}
    />
  )
}
