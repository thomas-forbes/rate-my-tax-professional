// @refresh reload
import { mount, StartClient } from '@solidjs/start/client'
import { initClientPosthog } from '~/lib/posthog'

initClientPosthog()

mount(() => <StartClient />, document.getElementById('app')!)
