# Playwright BDD Tests

## Prerequisites

- Node.js 22.18.0 or newer, with npm 10 or newer.
- Internet access to install dependencies and browsers and reach SauceDemo.

The tests use the public SauceDemo site and its `standard_user` account by default. To use another deployment, copy [`.env.example`](.env.example) to `.env` and set `BASE_URL`, `SAUCEDEMO_USERNAME`, and `SAUCEDEMO_PASSWORD`.

## How to Run

Open Terminal in the repository root and run:

```powershell
npm ci
npx playwright install chromium firefox
npm test
```

## Generate the Allure Report

After a test run, generate and open the report:

```powershell
npm run report:allure
npx allure open --host 127.0.0.1 allure-report
```

The report uses results in `allure-results/`, including results from earlier runs. Move or clear that folder before running tests if you want a report for only the latest run.
