import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const routeModules = [
  './src/routes/userRoutes.js',
  './src/routes/mealRoutes.js',
  './src/routes/orderRoutes.js',
  './src/routes/alertRoutes.js',
  './src/routes/reviewRoutes.js',
  './src/routes/mealRequestRoutes.js',
  './src/routes/financeRoutes.js',
  './src/routes/specialAlert.routes.js',
];

for (const modulePath of routeModules) {
  test(`loads ${modulePath} without handler errors`, async () => {
    const mod = await import(pathToFileURL(join(projectRoot, modulePath)).href);
    assert.ok(mod.default, `${modulePath} should default-export a router`);
  });
}

test('mealRequestController exports all route handlers', async () => {
  const controller = await import(
    pathToFileURL(join(projectRoot, 'src/controllers/mealRequestController.js')).href
  );
  const required = [
    'createRequest',
    'getAvailableRequests',
    'getMyRequests',
    'acceptRequest',
    'fulfillRequest',
    'updateRequest',
    'deleteRequest',
  ];
  for (const name of required) {
    assert.equal(typeof controller.default[name], 'function', `missing ${name}`);
  }
});
