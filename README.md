# Shady Meadows B&B — SDET Technical Challenge

## Project Structure

```
shady-meadows-tech-challenge/
├── karate/
│   ├── karate-config.js              # Global config (baseUrl)
│   ├── pom.xml                       # Maven dependencies
│   └── src/test/java/shadymeadows/
│       ├── KarateRunner.java         # Test runner
│       └── features/
│           ├── branding.feature      # GET /api/branding
│           ├── rooms.feature         # GET /api/room
│           ├── booking.feature       # POST /api/booking
│           ├── booking-data.json     # Test data for booking
│           └── booking-payload.json  # Request payload template
└── playwright/
    ├── .env.example                  # Environment variables template
    ├── playwright.config.ts          # Playwright configuration
    ├── testData.ts                   # Test data and env variable bindings
    ├── pages/
    │   ├── home.ts                   # Homepage page object
    │   └── admin.ts                  # Admin panel page object
    └── tests/
        ├── home.spec.ts              # Homepage sanity + bug documentation
        └── admin.spec.ts             # Admin auth + bonus room verification
```

## Approach

The goal was to build a clean, scalable test suite that goes beyond the minimum
requirements.

- **Atomic tests** - each test is self-contained and does not rely on state
  left by a previous test. The booking feature dynamically fetches a valid
  room ID at runtime rather than hardcoding one.
- **Readable structure** - Karate tests use a shared `karate-config.js` for
  base URL configuration. Playwright tests use the Page Object Model (POM)
  with dedicated page classes for the homepage and admin panel.
- **Edge case coverage** - beyond the happy paths, both suites include
  negative scenarios (empty booking payload, past dates) and document
  discovered bugs using `test.fail()` so they are visible in reports without
  blocking the suite.
- **Note on the bonus task** - ideally, the cross-check between the admin panel and the landing page would be performed by comparing API and UI results. For the purpose of this task, only UI comparison was used, which is not the optimal approach.

---

## Part 1: Karate API Tests

### Running the tests

```bash
cd karate
mvn test
```

### Viewing the report

After the run, open the HTML report in your browser:

```
karate/target/karate-reports/karate-summary.html
```

---

## Part 2: Playwright UI Tests

### Setup

Copy the example env file and fill in the credentials:

```bash
cp playwright/.env.example playwright/.env
```

`.env` is filled with values according to .env.example.


### Running the tests

```bash
cd playwright
npx playwright test
```

To run a single spec:
```bash
npx playwright test home
npx playwright test admin
```

To run on a single browser:
```bash
npx playwright test --project=chromium
```

### Viewing the report

```bash
npx playwright show-report
```

---

## Bugs Found

| # | Location | Description |
|---|----------|-------------|
| 1 | Homepage - Room cards | Buttons are labelled "Book now" instead of "Book this room" as specified |
| 2 | Homepage - Navigation | "Amenities" nav link exists but has no target section on the page |
| 3 | Homepage - Booking widget | No validation on past check-in/check-out dates - bookings can be made in the past |
| 4 | Homepage - Footer | Footer navigation links do not scroll to their target sections |
| 5 | Admin panel | Logging in redirects to the "Rooms" view instead of the "Dashboard/Inboxes" view as specified |

---

## CI/CD Integration

Both suites are designed to run headlessly and can be integrated into any
CI/CD pipeline. A GitHub Actions example:

```yaml
name: Test Suite

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  karate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: cd karate && mvn test

  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd playwright && npm ci
      - run: cd playwright && npx playwright install --with-deps
      - run: cd playwright && npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright/playwright-report/
```

For larger projects, tests can be tagged by severity (`@smoke`, `@regression`)
and run selectively - smoke tests on every push, full regression on a schedule
or before releases.