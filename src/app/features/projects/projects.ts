import { Component, ChangeDetectionStrategy, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { catchError, NEVER, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api';
import { Project } from '../../models/project.model';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Hotel Booking System',
    description: 'Full-stack hotel reservation platform with real-time availability, dynamic pricing, and payment integration. Handles 10,000+ monthly transactions.',
    tech_stack: ['Angular', 'FastAPI', 'PostgreSQL', 'Stripe'],
    demo_link: null,
    github_link: null,
    display_date: 'Jan 2024',
    created_at: null,
  },
  {
    id: 2,
    title: 'Portfolio API',
    description: 'RESTful backend API built with FastAPI and Supabase PostgreSQL. Features connection pooling and production-ready CORS handling.',
    tech_stack: ['FastAPI', 'SQLAlchemy', 'Supabase', 'Python'],
    demo_link: null,
    github_link: null,
    display_date: 'Mar 2024',
    created_at: null,
  },
  {
    id: 3,
    title: 'Angular Portfolio',
    description: 'Animated dark-theme developer portfolio with Angular 19, zoneless change detection, SSR, and smooth scroll-reveal animations.',
    tech_stack: ['Angular 19', 'TypeScript', 'FastAPI', 'SSR'],
    demo_link: null,
    github_link: null,
    display_date: 'Mar 2024',
    created_at: null,
  },
];

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects {
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  // loading starts true always — server renders spinner, avoids hydration mismatch
  loading = signal(true);
  hasError = signal(false);

  // Server: NEVER emits → keeps loading=true → spinner in SSR HTML
  // Browser: real HTTP call → loading=false when response arrives
  private projects$ = isPlatformBrowser(this.platformId)
    ? this.apiService.getProjects().pipe(
        tap(() => this.loading.set(false)),
        catchError(() => {
          this.hasError.set(true);
          this.loading.set(false);
          return of(FALLBACK_PROJECTS);
        })
      )
    : NEVER;

  projects = toSignal(this.projects$, { initialValue: [] as Project[] });

  getDisplayDate(project: Project): string {
    if (project.display_date) return project.display_date;
    if (project.created_at) {
      const d = new Date(project.created_at);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return '';
  }
}
