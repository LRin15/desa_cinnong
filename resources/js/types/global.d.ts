//types/global.d.ts
import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}
