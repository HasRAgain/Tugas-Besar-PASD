// This file defines a server-wide unique identifier that changes every time the Node/NPM process restarts.
// We use globalThis to ensure it survives Next.js Fast Refresh (HMR) during development.

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

if (!(globalThis as any).SERVER_INSTANCE_ID) {
  (globalThis as any).SERVER_INSTANCE_ID = generateId();
}

export const SERVER_INSTANCE_ID = (globalThis as any).SERVER_INSTANCE_ID;
