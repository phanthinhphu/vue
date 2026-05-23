import type { App } from 'vue'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import BadgeDirective from 'primevue/badgedirective'
import ConfirmationService from 'primevue/confirmationservice'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primeuix/themes'

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f0f5fb',
      100: '#dce8f5',
      200: '#b8d1eb',
      300: '#8ab3d9',
      400: '#5c95c7',
      500: '#2563eb',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e3a8a',
      900: '#112240',
      950: '#0a1628',
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#ffffff',
          50:  '#f0f5fb',
          100: '#dce8f5',
          200: '#b8d1eb',
          300: '#8ab3d9',
          400: '#5c95c7',
          500: '#2563eb',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#112240',
          950: '#0a1628',
        },
      },
    },
  },
})

export function addPrimeVueDependencies(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        darkModeSelector: false,
        cssLayer: {
          name: 'primevue',
          order: 'theme, base, primevue',
        },
      },
    },
  })
  app.use(ToastService)
  app.directive('tooltip', Tooltip)
  app.directive('badge', BadgeDirective)
  app.use(ConfirmationService)
}
