# Paquete de Replicación — Ticketera E2E (Cypress)

## Paso a paso (rápido)
1) `npm ci`
2) `npx cypress verify`
3) (opcional) `cp cypress.env.example.json cypress.env.json` y setear `BASE_URL` si corrés local
4) **GUI:** `npx cypress open` | **Headless:** `npx cypress run`
5) Evidencias en `cypress/videos/**` y `cypress/screenshots/**`

## CI (GitHub Actions)
- Workflow: `.github/workflows/e2e-tests.yml`
- Dispara en push/PR; adjunta artefactos.
- Si existe `CYPRESS_RECORD_KEY` (secret), graba en Cypress Cloud (usa `projectId`).

## Runner de referencia (tu run real)
- Ubuntu 24.04.3 LTS, runner v2.328.0, image ubuntu-24.04 (20250831.1.0)
- Node 20 LTS recomendado (>=18 OK)
- Headless Chrome/Electron

## Variables de entorno (ejemplo, sin secretos)
- `BASE_URL`: http://localhost:5173
- `TEST_EMAIL` / `TEST_PASSWORD`: dummy si aplica

**Nunca** subas `CYPRESS_RECORD_KEY` al repo.
