"""Agenxa Selenium Automation Test Suite

Automates:
1. Navigation to Agenxa web app
2. Clerk Authentication handling / Session restore
3. Navigating to Agency Subaccounts list (/agency/[agencyID]/all-subaccounts)
4. Reading all existing subaccount cards & status
5. Selecting / Clicking an existing subaccount
6. Creating a new subaccount with full form completion (Name, Email, Phone, Address, City, State, Zip, Country, Logo)
"""

import os
import sys
import time
import json
import argparse
from dataclasses import dataclass
from typing import List, Optional

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options


@dataclass
class SubaccountInfo:
    name: str
    address: str
    subaccount_id: Optional[str] = None


class AgenxaSeleniumTester:
    def __init__(
        self,
        base_url: str = "http://localhost:3000",
        headless: bool = False,
        timeout: int = 15,
        chrome_driver_path: Optional[str] = None,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1440,900")
        chrome_options.add_argument("--disable-notifications")

        # User agent
        chrome_options.add_argument(
            "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )

        try:
            from webdriver_manager.chrome import ChromeDriverManager
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception:
            # Fall back to Selenium 4 native Selenium Manager
            self.driver = webdriver.Chrome(options=chrome_options)

        self.wait = WebDriverWait(self.driver, self.timeout)

    def close(self):
        """Teardown browser session."""
        try:
            self.driver.quit()
        except Exception:
            pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    # -------------------------------------------------------------
    # 1. AUTHENTICATION & SESSION
    # -------------------------------------------------------------
    def login_with_clerk(self, email: str, password: Optional[str] = None):
        """
        Navigates to Clerk sign-in and inputs email and password.
        """
        sign_in_url = f"{self.base_url}/agency/sign-in"
        print(f"[*] Navigating to Sign In: {sign_in_url}")
        self.driver.get(sign_in_url)

        # Wait for Clerk email input
        try:
            email_input = self.wait.until(
                EC.presence_of_element_located((By.NAME, "identifier"))
            )
            email_input.clear()
            email_input.send_keys(email)
            email_input.send_keys(Keys.RETURN)
            print(f"[+] Entered email: {email}")

            if password:
                # Wait for password input if enabled
                time.sleep(1.5)
                password_input = self.wait.until(
                    EC.presence_of_element_located((By.NAME, "password"))
                )
                password_input.clear()
                password_input.send_keys(password)
                password_input.send_keys(Keys.RETURN)
                print("[+] Entered password and submitted.")

            # Wait for dashboard redirect or main page load
            self.wait.until(lambda d: "/sign-in" not in d.current_url)
            print(f"[+] Login successful. Current URL: {self.driver.current_url}")
        except Exception as e:
            print(f"[!] Warning/Note during login flow: {e}")
            print(f"    Current URL is: {self.driver.current_url}")

    def save_session_cookies(self, filepath: str = "e2e-tests/cookies.json"):
        """Saves current browser cookies to file to bypass re-login."""
        with open(filepath, "w") as f:
            json.dump(self.driver.get_cookies(), f, indent=2)
        print(f"[+] Saved cookies to {filepath}")

    def load_session_cookies(self, filepath: str = "e2e-tests/cookies.json"):
        """Loads cookies from file."""
        if not os.path.exists(filepath):
            print(f"[-] No saved cookies file at {filepath}")
            return False

        self.driver.get(self.base_url)
        with open(filepath, "r") as f:
            cookies = json.load(f)
        for cookie in cookies:
            self.driver.add_cookie(cookie)
        self.driver.refresh()
        print(f"[+] Loaded {len(cookies)} cookies from {filepath}")
        return True

    # -------------------------------------------------------------
    # 2. READ & LIST SUBACCOUNTS
    # -------------------------------------------------------------
    def navigate_to_subaccounts(self, agency_id: str):
        """Navigates to the all-subaccounts page for a specific agency."""
        target_url = f"{self.base_url}/agency/{agency_id}/all-subaccounts"
        print(f"[*] Navigating to: {target_url}")
        self.driver.get(target_url)
        self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//input[@placeholder='Search Account...'] | //h1 | //body")
            )
        )
        time.sleep(1)

    def read_all_subaccounts(self) -> List[SubaccountInfo]:
        """
        Reads and extracts all visible subaccounts from the command list.
        Returns a list of SubaccountInfo dataclasses.
        """
        print("[*] Reading subaccounts from page...")
        subaccounts: List[SubaccountInfo] = []

        try:
            # Locate all subaccount items in CommandItem list
            items = self.driver.find_elements(
                By.XPATH,
                "//div[contains(@class, 'cmdk-item')]//a[contains(@href, '/subaccount/')] | //a[contains(@href, '/subaccount/')]"
            )

            for item in items:
                href = item.get_attribute("href") or ""
                subaccount_id = href.rstrip("/").split("/")[-1] if "/subaccount/" in href else None
                text_content = item.text.split("\n")

                name = text_content[0].strip() if len(text_content) > 0 else "Unknown"
                address = text_content[1].strip() if len(text_content) > 1 else ""

                subaccounts.append(
                    SubaccountInfo(
                        name=name,
                        address=address,
                        subaccount_id=subaccount_id,
                    )
                )

            print(f"[+] Found {len(subaccounts)} subaccount(s):")
            for idx, sa in enumerate(subaccounts, 1):
                print(f"    {idx}. Name: '{sa.name}' | ID: {sa.subaccount_id} | Address: '{sa.address}'")

        except Exception as e:
            print(f"[!] Error while reading subaccounts: {e}")

        return subaccounts

    # -------------------------------------------------------------
    # 3. SELECT & FILTER SUBACCOUNTS
    # -------------------------------------------------------------
    def filter_subaccounts(self, query: str):
        """Types query into the 'Search Account...' search box."""
        print(f"[*] Filtering subaccounts with search term: '{query}'")
        search_input = self.wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//input[@placeholder='Search Account...']")
            )
        )
        search_input.clear()
        search_input.send_keys(query)
        time.sleep(0.5)

    def select_subaccount_by_name(self, subaccount_name: str) -> bool:
        """
        Finds and clicks a subaccount by name, navigating into its workspace dashboard.
        """
        print(f"[*] Selecting subaccount: '{subaccount_name}'")
        try:
            xpath = f"//a[contains(@href, '/subaccount/') and .//*[contains(text(), '{subaccount_name}')]]"
            card_link = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            card_link.click()

            # Wait until redirected into subaccount dashboard
            self.wait.until(lambda d: "/subaccount/" in d.current_url)
            print(f"[+] Successfully opened subaccount! Current URL: {self.driver.current_url}")
            return True
        except Exception as e:
            print(f"[!] Could not select subaccount '{subaccount_name}': {e}")
            return False

    # -------------------------------------------------------------
    # 4. CREATE NEW SUBACCOUNT
    # -------------------------------------------------------------
    def open_create_subaccount_modal(self) -> bool:
        """Clicks the '+ Sub Account' button to open the creation modal."""
        print("[*] Opening 'Create Subaccount' modal...")
        try:
            create_btn = self.wait.until(
                EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(., 'Sub Account')]")
                )
            )
            create_btn.click()

            # Wait for modal content (Sub Account Information title)
            self.wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, "//*[contains(text(), 'Sub Account Information') or contains(text(), 'Create a Subaccount')]")
                )
            )
            print("[+] Modal opened successfully.")
            return True
        except Exception as e:
            print(f"[!] Failed to open Create Subaccount modal: {e}")
            return False

    def fill_and_submit_subaccount_form(
        self,
        name: str,
        email: str,
        phone: str = "555-019-2834",
        address: str = "100 Innovation Way",
        city: str = "San Francisco",
        state: str = "CA",
        zip_code: str = "94107",
        country: str = "United States",
        logo_url: Optional[str] = None,
    ) -> bool:
        """
        Fills the subaccount form fields and submits the form.
        """
        print(f"[*] Filling subaccount form for: '{name}'...")
        try:
            # 1. Fill Name
            name_input = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Your agency name' or @name='name']"))
            )
            name_input.clear()
            name_input.send_keys(name)

            # 2. Fill Email
            email_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='Email' or @name='companyEmail']"
            )
            email_input.clear()
            email_input.send_keys(email)

            # 3. Fill Phone
            phone_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='Phone' or @name='companyPhone']"
            )
            phone_input.clear()
            phone_input.send_keys(phone)

            # 4. Fill Address
            address_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='123 st...' or @name='address']"
            )
            address_input.clear()
            address_input.send_keys(address)

            # 5. Fill City
            city_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='City' or @name='city']"
            )
            city_input.clear()
            city_input.send_keys(city)

            # 6. Fill State
            state_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='State' or @name='state']"
            )
            state_input.clear()
            state_input.send_keys(state)

            # 7. Fill Zip
            zip_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='Zipcode' or @name='zipCode']"
            )
            zip_input.clear()
            zip_input.send_keys(zip_code)

            # 8. Fill Country
            country_input = self.driver.find_element(
                By.XPATH, "//input[@placeholder='Country' or @name='country']"
            )
            country_input.clear()
            country_input.send_keys(country)

            # 9. Optional: Inject or upload logo URL into hidden/file upload state if needed
            if logo_url:
                try:
                    # If there's an input or state for subAccountLogo
                    logo_input = self.driver.find_elements(
                        By.XPATH, "//input[@name='subAccountLogo']"
                    )
                    if logo_input:
                        self.driver.execute_script(
                            "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));",
                            logo_input[0],
                            logo_url,
                        )
                except Exception as logo_err:
                    print(f"[-] Note on logo URL field: {logo_err}")

            time.sleep(0.5)

            # 10. Click Save/Submit button
            submit_btn = self.driver.find_element(
                By.XPATH, "//button[@type='submit' and (contains(., 'Save') or contains(., 'Submit') or contains(., 'Create'))]"
            )
            print("[*] Submitting subaccount details form...")
            submit_btn.click()

            # Wait for modal to dismiss or toast notification
            time.sleep(2)
            print("[+] Form submitted successfully!")
            return True

        except Exception as e:
            print(f"[!] Failed to fill or submit subaccount form: {e}")
            return False


# -------------------------------------------------------------
# CLI Entrypoint for Testing and Automation
# -------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Agenxa Selenium Subaccount Automation Tester")
    parser.add_argument("--url", default="http://localhost:3000", help="Base URL of Agenxa app")
    parser.add_argument("--agency-id", default="your-agency-id", help="Agency ID to navigate to")
    parser.add_argument("--action", choices=["read", "search", "select", "create", "all"], default="read", help="Action to perform")
    parser.add_argument("--query", default="", help="Query string for search")
    parser.add_argument("--select-name", default="", help="Subaccount name to select")
    parser.add_argument("--new-name", default="Beta Test Subaccount", help="New subaccount name")
    parser.add_argument("--new-email", default="beta@example.com", help="New subaccount email")
    parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")

    args = parser.parse_args()

    print("=" * 60)
    print("🚀 Starting Agenxa Selenium Automation Tester")
    print(f"Target: {args.url} | Agency: {args.agency_id} | Action: {args.action}")
    print("=" * 60)

    with AgenxaSeleniumTester(base_url=args.url, headless=args.headless) as tester:
        tester.navigate_to_subaccounts(args.agency_id)

        if args.action in ["read", "all"]:
            subaccounts = tester.read_all_subaccounts()
            print(f"\n[Summary] Total subaccounts found: {len(subaccounts)}")

        if args.action in ["search", "all"] and args.query:
            tester.filter_subaccounts(args.query)

        if args.action == "select" and args.select_name:
            tester.select_subaccount_by_name(args.select_name)

        if args.action in ["create", "all"]:
            opened = tester.open_create_subaccount_modal()
            if opened:
                tester.fill_and_submit_subaccount_form(
                    name=args.new_name,
                    email=args.new_email,
                )
                time.sleep(2)
                tester.read_all_subaccounts()


if __name__ == "__main__":
    main()
