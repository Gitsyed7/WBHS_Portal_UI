# AGENTS.md

## Stack

- Angular 21, standalone components only (no NgModules). `src/main.ts` bootstraps `App` via `appConfig` in `src/app/app.config.ts`.
- Bootstrap 5.3.8 + Bootstrap Icons + ngx-bootstrap (BS Datepicker is used in the registration step).
- TypeScript ~5.9 (strict mode), SCSS for all component styles, RxJS 7.

## Commands

- `npm start` / `ng serve` — dev server on `http://localhost:4200`.
- `ng build` — production build. Budgets: initial 500kB warn / 1MB error; `anyComponentStyle` 4kB warn / 8kB error (keep step SCSS small).
- `ng test` — Vitest via the `@angular/build:unit-test` builder. Watch mode by default; pass `--watch=false` for a single run.
- `ng e2e` — not configured; no e2e framework is installed.
- There is **no lint script and no ESLint config** — `npm run lint` does not exist. Use Prettier manually: `npx prettier --write <file>` (config in `.prettierrc`: printWidth 100, singleQuote, angular HTML parser).

## Architecture notes

- **Non-standard naming:** components are plain `.ts` files (e.g. `registration.ts`, `master.ts`), not `*.component.ts`. Classes are PascalCase, selectors are `app-*`. Follow this convention when adding steps.
- Components are standalone with `imports`, `templateUrl`, `styleUrl` (SCSS). Templates use Angular `@if`/`@for` control flow, `[(ngModel)]` (FormsModule), and `ngClass`.
- **GIA college registration flow** lives in `src/app/pages/gia-clg-reg/`:
  - `master/master.ts` runs a 5-step wizard (`currentStep`, `getStepStatus`) with `@ViewChild` refs to each step component.
  - Each step component (`registration`, `personal-information`, `office-information`, `beneficiary`, `administrative`) exposes `validateAndSave(): boolean`; Master calls it on "Save & Continue" and only advances on `true`.
  - `registration` verifies HRMS ID + DOB, generates the application ID, and emits the app context via `@Output() moveNext` to Master.
  - `personal-information` is the only fully implemented step; `office-information`, `beneficiary`, and `administrative` are stubs.
- **Validation is manual and template-driven**, not reactive forms: `shared/Services/ui-validation.service.ts` provides `validationError(field, message, controlId)` (toast + inline `fieldErrors` + DOM focus). New steps should follow the `validateAndSave()` + UiValidationService pattern.
- Services live in `src/app/services/` (`college-registration.service.ts`, `lookup.service.ts`, `circulars.service.ts`); API base URL is in `src/environments/environment.ts` (`http://localhost:5114/api`).
- **Gotcha:** `app.config.ts` only calls `provideRouter` — `provideHttpClient()` is NOT registered, but the services inject `HttpClient`. If you touch `app.config.ts`/DI, this is a likely source of `NullInjectorError`.

## Tests

- Vitest specs are colocated as `*.spec.ts` next to the component. All existing specs are minimal `should create` smoke tests using `TestBed.configureTestingModule({ imports: [Component] })`.
- Specs do not provide `HttpClient` or mock services; keep new specs self-contained in the same style.
