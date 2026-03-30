import { ref } from 'vue'

/** Compteur incrémenté pour demander la réouverture du bandeau cookies (ex. depuis le footer). */
export const cookiePreferencesTick = ref(0)

export function openCookiePreferences() {
  cookiePreferencesTick.value += 1
}
