// copied from https://github.com/maxisam/ngx-window-token/blob/master/projects/ngx-window-token/src/lib/window.ts
import { InjectionToken } from '@angular/core';


export const WINDOW = new InjectionToken<Window>(
  'WindowToken',
  typeof window !== 'undefined' && window.document ? { providedIn: 'root', factory: () => window } : undefined
);