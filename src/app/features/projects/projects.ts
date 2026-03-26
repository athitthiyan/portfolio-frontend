import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api';
import { Project } from '../../models/project.model';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Hotel Booking System',
    description: 'Full-stack hotel reservation platform with real-time availability, dynamic pricing, and payment integration. Handles 10,000+ monthly transactions.',
    tech_stack: ['Angular', 'FastAPI', 'PostgreSQL', 'Stripe'],
    demo_link: null, github_link: null, display_date: 'Jan 2024', created_at: null,
  },
  {
    id: 2,
    title: 'Portfolio API',
    description: 'RESTful backend API built with FastAPI and Supabase PostgreSQL. Features connection pooling and production-ready CORS handling.',
    tech_stack: ['FastAPI', 'SQLAlchemy', 'Supabase', 'Python'],
    demo_link: null, github_link: null, display_date: 'Mar 2024', created_at: null,
  },
  {
    id: 3,
    title: 'Angular Portfolio',
    description: 'Animated dark-theme portfolio with Angular 19, zoneless change detection, and smooth scroll animations.',
    tech_stack: ['Angular 19', 'TypeScript', 'FastAPI', 'SSR'],
    demo_link: null, github_link: null, display_date: 'Mar 2024', created_at: null,
  },
];

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  loading = signal(true);

  // Start with fallback so grid is always in DOM — no reveal timing issue
  projects = signal<Project[]>(FALLBACK_PROJECTS);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false); // ✅ important for SSR
      return;
    }

    this.apiService.getProjects().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.projects.set(data);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false); // ✅ fallback will show
      }
    });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => observer.observe(el));
  }

  getDisplayDate(project: Project): string {
    if (project.display_date) return project.display_date;
    if (project.created_at) {
      const d = new Date(project.created_at);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return '';
  }
}
