# Expense Tracker

A React Native app to log expenses across multiple currencies with real-time conversion to a selected base currency.

![React Native](https://img.shields.io/badge/React_Native-0.85-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=flat&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat&logo=redux&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat&logo=axios&logoColor=white)

---

## Features

- Log expenses in any currency — INR, USD, EUR, GBP, JPY, AUD
- Real-time conversion to a selected base currency via live exchange rates
- Switch base currency from the home screen — all amounts recalculate instantly
- Filter expenses by category: Food, Travel, Shopping, Health, Entertainment, Other
- Running total always shown in the selected base currency
- Delete expenses with a single tap
- Full TypeScript — no `any`

---

## Tech Stack

- **React Native 0.85** · **TypeScript**
- **Redux Toolkit** — slices, `createAsyncThunk`, typed hooks
- **Axios** — centralised instance with response interceptor
- **react-native-vector-icons** — Ionicons for UI icons
- **Frankfurter API v2** — free exchange rate API, no key needed

---

## Architecture

Follows a **Service → Controller → Slice** pattern.

```
Screen
  └── dispatch(thunk)
        └── Controller      ← business logic, validation, data transformation
              └── Service   ← raw HTTP call only
                    └── Axios instance
```

- **Services** — one function per endpoint, no logic
- **Controllers** — validation, object creation, data transformation
- **Slices** — state shape and transitions only, no business logic
- **Screens** — collect input, dispatch, render state

---

## Project Structure

```
src/
├── types/
│   └── index.ts                    # Shared TypeScript interfaces and union types
├── services/
│   ├── api.ts                      # Axios instance with base URL + interceptor
│   └── currencyService.ts          # fetchRates() — raw API call, transforms array response
├── controllers/
│   ├── currencyController.ts       # getRates(), convertToBase()
│   └── expenseController.ts        # createExpense(), validateExpense()
├── store/
│   ├── index.ts                    # configureStore, RootState, AppDispatch
│   └── hooks.ts                    # useAppDispatch, useAppSelector (typed)
├── features/
│   ├── currency/
│   │   └── currencySlice.ts        # loadRates thunk, setBaseCurrency
│   └── expenses/
│       └── expenseSlice.ts         # addExpense, removeExpense, setFilter, updateConvertedAmounts
└── screens/
    ├── HomeScreen.tsx              # Expense list, filter strip, base switcher, total
    └── AddExpenseScreen.tsx        # Add expense form with fixed bottom button
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Android Studio + Android SDK
- React Native environment: [official guide](https://reactnative.dev/docs/set-up-your-environment)

### Install

```bash
git clone https://github.com/namratha295/expense-tracker.git
cd expense-tracker
npm install
```

### Run

```bash
npx react-native run-android
```

---

## Key Implementation Notes

### API response transformation
The Frankfurter v2 API returns an array of `{ base, quote, rate }` objects. The service layer transforms this into a `Record<string, number>` map before it reaches Redux — so the rest of the app never deals with the raw array shape.

```ts
response.data.forEach(item => {
  rates[item.quote] = item.rate;
});
```

### Axios interceptor
All API errors are caught centrally in `src/services/api.ts` with three specific cases — server error (4xx/5xx), no response (network down), and request setup failure. One place to update error handling for the whole app.

### createAsyncThunk
The currency slice uses `createAsyncThunk` to handle the loading/success/error lifecycle automatically. The thunk calls the controller, not the service directly.

### Typed Redux hooks
`useAppDispatch` and `useAppSelector` in `src/store/hooks.ts` are typed wrappers — all components use these, never the plain Redux hooks.

### useMemo for performance
Filtered expense list and running total are memoised — only recalculate when `items` or `filterCategory` change, not on every render.

### Base currency switching
Tapping the base currency in the header opens a bottom sheet modal. Selecting a new currency dispatches `setBaseCurrency` and `loadRates` — fresh rates are fetched and all `convertedAmounts` recalculate automatically via `useEffect`.

---

## API

[Frankfurter v2](https://frankfurter.dev) — free, open-source, no API key required.

```
GET https://api.frankfurter.dev/v2/rates?base=INR
```
## Download
[Download APK v1.0.0](https://github.com/namratha295/ExpenseTracker/releases/latest)

<img width="360" height="800" alt="Screenshot_1781023364" src="https://github.com/user-attachments/assets/79ad4816-2b3f-45d2-a38d-9102393aedb3" />

<img width="360" height="800" alt="Screenshot_1781023370" src="https://github.com/user-attachments/assets/a682f478-ede4-4d34-9c64-cc3752592481" />

<img width="360" height="800" alt="Screenshot_1781023383" src="https://github.com/user-attachments/assets/7cce6b48-32d2-4eef-8a57-b1a42972ff30" />

<img width="360" height="800" alt="Screenshot_1781023387" src="https://github.com/user-attachments/assets/fbfed374-b53f-47c2-8c6a-187dee157cff" />

<img width="360" height="800" alt="Screenshot_1781023395" src="https://github.com/user-attachments/assets/8393ba27-380e-478c-a30b-42f5c54253fb" />
