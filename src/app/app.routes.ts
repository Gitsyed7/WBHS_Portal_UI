import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'about-us', loadComponent: () => import('./pages/about-us/about-us').then(m => m.AboutUs) },
  { path: 'contact-us', loadComponent: () => import('./pages/contact-us/contact-us').then(m => m.ContactUs) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq').then(m => m.Faq) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: '', component: Home }
];

import { Home } from './pages/home/home';

