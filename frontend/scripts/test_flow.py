# test_flow.py
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=500)
        page = await browser.new_page()

        # Change to your backend login page
        await page.goto("http://localhost:5173/login")

        # Admin login (update credentials if needed)
        await page.fill("input[name='email']", "admin@example.com")
        await page.fill("input[name='password']", "adminpassword")
        await page.click("button:has-text('Login')")

        # Wait for Dashboard to load
        await page.wait_for_selector("text=Dashboard")

        # Pages to test from navbar
        pages_to_test = [
            ("Dashboard", "text=Dashboard"),
            ("Customers", "text=Customers"),
            ("Vehicles", "text=Vehicles"),
            ("Estimates", "text=Estimates"),
            ("Invoices", "text=Invoices"),
            ("Appointments", "text=Appointments"),
            ("Reports", "text=Reports"),
            ("Inventory", "text=Inventory"),
            ("Parts & Labor", "text=Parts"),
        ]

        for name, selector in pages_to_test:
            print(f"Testing page: {name}")
            await page.click(f"nav >> text={name}")
            await page.wait_for_timeout(1000)  # let it render
            assert await page.is_visible(selector), f"{name} page failed!"

        # Test user dropdown menu
        print("Testing user dropdown...")
        await page.click("button:has-text('Admin')")
        await page.wait_for_selector("text=Logout")
        await page.click("text=Logout")
        await page.wait_for_selector("text=Login")

        print("✅ Flow test completed successfully!")

        await browser.close()

asyncio.run(run())
