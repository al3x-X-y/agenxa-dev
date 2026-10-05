/**
 * Agenxa Selenium / WebDriverJS Automation Suite
 *
 * Automates:
 * 1. Read existing subaccounts from `/agency/[agencyID]/all-subaccounts`
 * 2. Filter & Select subaccounts
 * 3. Open modal & Create new subaccount with full inputs
 */

import { Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export interface SubAccountData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  logoUrl?: string;
}

export class AgenxaSeleniumTester {
  private driver: WebDriver;
  private baseUrl: string;

  constructor(driver: WebDriver, baseUrl = 'http://localhost:3000') {
    this.driver = driver;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  static async create(baseUrl = 'http://localhost:3000', headless = false) {
    const options = new chrome.Options();
    if (headless) {
      options.addArguments('--headless=new');
    }
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    return new AgenxaSeleniumTester(driver, baseUrl);
  }

  async close() {
    await this.driver.quit();
  }

  /**
   * 1. Navigate to All Subaccounts Page
   */
  async navigateToSubaccounts(agencyId: string) {
    const url = `${this.baseUrl}/agency/${agencyId}/all-subaccounts`;
    console.log(`[*] Navigating to: ${url}`);
    await this.driver.get(url);
    await this.driver.wait(until.elementLocated(By.css('body')), 10000);
  }

  /**
   * 2. Read all Subaccounts
   */
  async readAllSubaccounts() {
    console.log('[*] Reading subaccounts list from UI...');
    await this.driver.sleep(1000);

    const cards = await this.driver.findElements(
      By.xpath("//a[contains(@href, '/subaccount/')]")
    );

    const results = [];
    for (const card of cards) {
      const href = await card.getAttribute('href');
      const text = await card.getText();
      const parts = text.split('\n');
      results.push({
        id: href?.split('/subaccount/')[1] || '',
        name: parts[0]?.trim() || '',
        address: parts[1]?.trim() || '',
        href,
      });
    }

    console.log(`[+] Found ${results.length} subaccount(s):`);
    results.forEach((acc, i) => {
      console.log(`    ${i + 1}. [${acc.name}] - ID: ${acc.id} (${acc.address})`);
    });
    return results;
  }

  /**
   * 3. Filter/Search subaccounts
   */
  async filterSubaccounts(query: string) {
    console.log(`[*] Filtering with query: "${query}"`);
    const searchInput = await this.driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Search Account...']")),
      5000
    );
    await searchInput.clear();
    await searchInput.sendKeys(query);
    await this.driver.sleep(600);
  }

  /**
   * 4. Select / Click a subaccount by name
   */
  async selectSubaccountByName(name: string) {
    console.log(`[*] Selecting subaccount: "${name}"`);
    const link = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//a[contains(@href, '/subaccount/') and .//*[contains(text(), '${name}')]]`)
      ),
      8000
    );
    await link.click();
    await this.driver.wait(until.urlContains('/subaccount/'), 10000);
    console.log(`[+] Opened subaccount dashboard: ${await this.driver.getCurrentUrl()}`);
  }

  /**
   * 5. Open Modal & Create Subaccount
   */
  async createSubaccount(data: SubAccountData) {
    console.log(`[*] Opening create subaccount modal for: "${data.name}"`);
    const createBtn = await this.driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Sub Account')]")),
      8000
    );
    await createBtn.click();

    // Wait for form inputs
    const nameInput = await this.driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Your agency name' or @name='name']")),
      8000
    );
    await nameInput.sendKeys(data.name);

    const emailInput = await this.driver.findElement(
      By.xpath("//input[@placeholder='Email' or @name='companyEmail']")
    );
    await emailInput.sendKeys(data.email);

    if (data.phone) {
      const phoneInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='Phone' or @name='companyPhone']")
      );
      await phoneInput.sendKeys(data.phone);
    }

    if (data.address) {
      const addressInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='123 st...' or @name='address']")
      );
      await addressInput.sendKeys(data.address);
    }

    if (data.city) {
      const cityInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='City' or @name='city']")
      );
      await cityInput.sendKeys(data.city);
    }

    if (data.state) {
      const stateInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='State' or @name='state']")
      );
      await stateInput.sendKeys(data.state);
    }

    if (data.zipCode) {
      const zipInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='Zipcode' or @name='zipCode']")
      );
      await zipInput.sendKeys(data.zipCode);
    }

    if (data.country) {
      const countryInput = await this.driver.findElement(
        By.xpath("//input[@placeholder='Country' or @name='country']")
      );
      await countryInput.sendKeys(data.country);
    }

    // Submit form
    console.log('[*] Submitting subaccount creation form...');
    const submitBtn = await this.driver.findElement(
      By.xpath("//button[@type='submit' and (contains(., 'Save') or contains(., 'Submit') or contains(., 'Create'))]")
    );
    await submitBtn.click();
    await this.driver.sleep(2000);
    console.log('[+] Subaccount creation form submitted!');
  }
}

// Quick CLI runner
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const agencyId = process.env.TEST_AGENCY_ID || 'test-agency-id';
    const tester = await AgenxaSeleniumTester.create('http://localhost:3000', false);
    try {
      await tester.navigateToSubaccounts(agencyId);
      await tester.readAllSubaccounts();
    } finally {
      await tester.close();
    }
  })().catch(console.error);
}
