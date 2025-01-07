import puppeteer, { Browser, ElementHandle, Page } from 'puppeteer'

// Types
interface Professional {
  name: string
  credential: string
  address: string
}

// Constants
const SELECTORS = {
  COUNTRY: '#form\\:country',
  SEARCH: '#form\\:search',
  TABLE: '#form\\:data\\:tbody_element',
  NEXT_BUTTON: '#form\\:j_id_jsp_1486914732_156',
  NO_RESULTS: '#form\\:noResultsID',
  TOO_MANY_RESULTS: '.searchResultMsg1 a',
} as const

// Helper Functions
async function initializeBrowser(headless: boolean = true): Promise<Browser> {
  return await puppeteer.launch({ headless })
}

async function getAvailableCountryCodes(page: Page): Promise<string[]> {
  await page.waitForSelector(SELECTORS.COUNTRY)
  return page.$eval(SELECTORS.COUNTRY, (select) => {
    if (!(select instanceof HTMLSelectElement))
      throw new Error('Country selector not found')
    return Array.from(select.options).map((option) => option.value)
  })
}

async function processTableRow(
  cells: ElementHandle<Element>[],
): Promise<Professional | null> {
  try {
    const name = await cells[0].evaluate((el: Element) => el.textContent)
    const credential = await cells[1].evaluate((el: Element) => el.textContent)
    const address = await cells[2].evaluate((el: Element) => el.textContent)

    if (!name || !credential || !address) {
      console.warn('Invalid row data:', { name, credential, address })
      return null
    }

    return { name, credential, address }
  } catch (error) {
    console.error('Error processing table row:', error)
    return null
  }
}

async function scrapeCountry(
  page: Page,
  countryCode: string,
): Promise<Professional[]> {
  const results: Professional[] = []

  try {
    await page.select(SELECTORS.COUNTRY, countryCode)
    await page.click(SELECTORS.SEARCH)

    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    while (true) {
      const interval = 100
      for (let i = 0; i < 10000 / interval; i++) {
        if (await page.$(SELECTORS.NO_RESULTS)) throw new Error('No results')
        else if (await page.$(SELECTORS.TOO_MANY_RESULTS)) {
          console.log('Too many results')
          await page.click(SELECTORS.TOO_MANY_RESULTS)
          await page.waitForNavigation({ waitUntil: 'networkidle0' })
        } else if (await page.$(SELECTORS.TABLE)) break

        await new Promise((resolve) => setTimeout(resolve, interval))
      }
      if (!(await page.$(SELECTORS.TABLE))) throw new Error('Table not found')

      const table = await page.$(SELECTORS.TABLE)
      if (!table) throw new Error('Table not found')
      const rows = await table.$$('tr')
      for (const row of rows) {
        const cells = await row.$$('td')
        const professional = await processTableRow(cells)
        if (professional) results.push(professional)
      }

      const hasPages = !!(await page.$(SELECTORS.NEXT_BUTTON))
      if (!hasPages) break

      const isLastPage = await page.$eval(SELECTORS.NEXT_BUTTON, (button) => {
        if (!(button instanceof HTMLInputElement)) return true
        return button.disabled
      })
      if (isLastPage) break

      await page.click(SELECTORS.NEXT_BUTTON)
      await page.waitForNavigation({ waitUntil: 'networkidle0' })
    }
  } catch (error) {
    if (await page.$(SELECTORS.NO_RESULTS)) {
      console.log('No results')
    } else {
      console.error(`Error scraping country ${countryCode}:`, error)
    }
  }

  return results
}

async function scrapeIRS() {
  const browser = await initializeBrowser(false)
  const results: Record<string, Professional[]> = {}

  try {
    const page = await browser.newPage()
    await page.goto('https://irs.treasury.gov/rpo/rpo.jsf', {
      waitUntil: 'networkidle0',
    })

    const countryCodes = await getAvailableCountryCodes(page)
    console.log(`Processing ${countryCodes.length} countries`)

    for (const countryCode of countryCodes) {
      console.log(`Scraping country: ${countryCode}`)
      const countryResults = await scrapeCountry(page, countryCode)
      if (countryResults.length > 0) {
        console.log(`Found ${countryResults.length} results`)
        results[countryCode] = countryResults
      }

      await Bun.write('./results.json', JSON.stringify(results, null, 2))
    }

    return results
  } finally {
    await browser.close()
  }
}

// Main execution
async function main() {
  try {
    await scrapeIRS()
    console.log('Scraping completed successfully')
  } catch (error) {
    console.error('Main execution failed:', error)
    process.exit(1)
  }
}

main()

// ISO 3166 alpha-2
