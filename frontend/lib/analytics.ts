/**
 * Analytics stub.
 * 
 * In a real production app, this would wrap PostHog, Plausible, or Mixpanel.
 * We keep it as a simple logging stub to ensure the architecture is ready
 * without overcomplicating the codebase with third-party tracking scripts.
 */

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] ${eventName}`, properties || "")
  }
  
  // Future: window.posthog?.capture(eventName, properties)
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] Identify User: ${userId}`, traits || "")
  }
  
  // Future: window.posthog?.identify(userId, traits)
}
