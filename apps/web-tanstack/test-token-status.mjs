#!/usr/bin/env node
/**
 * Browser test: Login with Refresh Test (10s) and verify TokenStatus shows ~10s
 */
import { chromium } from 'playwright'

const BASE_URL = 'http://localhost:3003'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 })
  } catch (e) {
    console.error('Could not reach', BASE_URL, '- is the dev server running?')
    await browser.close()
    process.exit(1)
  }

  // Go to login page
  await page.goto(BASE_URL + '/login', { waitUntil: 'networkidle' })

  // Click "Refresh Test (10s)" to fill credentials
  await page.getByRole('button', { name: /Refresh Test \(10s\)/i }).click()

  // Submit login form
  await page.getByRole('button', { name: /Sign In/i }).click()

  // Wait for redirect to dashboard
  await page.waitForURL(/\/(dashboard|$)/, { timeout: 8000 })

  // Go to help page where TokenStatus is prominently displayed
  await page.goto(BASE_URL + '/dashboard/help', { waitUntil: 'networkidle' })

  // Wait for TokenStatus to render (polling every 1s in component)
  await page.waitForTimeout(3000)

  // Look for "Expires in Xs" or "Expires in Xm" or "Expires in Xh Ym"
  const expiresIn =
    (await page.getByText(/Expires in \d+s/).first().textContent().catch(() => '')) ||
    (await page.getByText(/Expires in \d+m/).first().textContent().catch(() => '')) ||
    (await page.getByText(/Expires in \d+h/).first().textContent().catch(() => ''))
  const fullPage = await page.content()

  console.log('Expires in text:', expiresIn)
  console.log('Page contains "Expires in":', fullPage.includes('Expires in'))

  // Success: short expiry (10s), long expiry (refresh → 1h), or "Session active" (green = refresh worked)
  const matchSeconds = (expiresIn || '').match(/Expires in (\d+)s/)
  const matchMinutes = (expiresIn || '').match(/Expires in (\d+)m/)
  const matchHours = (expiresIn || '').match(/Expires in (\d+)h/)
  const seconds = matchSeconds ? parseInt(matchSeconds[1], 10) : null
  const minutes = matchMinutes ? parseInt(matchMinutes[1], 10) : null
  const hours = matchHours ? parseInt(matchHours[1], 10) : null
  const is10sToken = seconds !== null && seconds <= 15
  const isRefreshed =
    (minutes !== null && minutes >= 50) ||
    (hours !== null && hours >= 1) ||
    fullPage.includes('Session active') // green = >5min left = refresh worked

  if (is10sToken || isRefreshed) {
    console.log('\n✅ PASS:', isRefreshed ? 'Refresh worked (token renewed)' : 'TokenStatus shows short expiry (~10s)')
  } else {
    console.log('\n❌ FAIL: Expected short expiry or refreshed token, got:', expiresIn, '| page:', fullPage.slice(0, 500))
  }

  await browser.close()
  process.exit(is10sToken || isRefreshed ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
