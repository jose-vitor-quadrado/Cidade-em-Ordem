import { InjectionToken } from '@angular/core';

/** URL base do backend. Troque aqui (ou forneça outro valor em app.config.ts). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://localhost:7119',
});
