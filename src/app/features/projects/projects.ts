import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../core/services/api';
import { Project } from '../../models/project.model';

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'StayEase Booking App',
    description: 'Luxury hotel booking platform built with Angular. Features room discovery, booking flow, checkout experience, and production integration with the payment app and backend API.',
    tech_stack: ['Angular', 'TypeScript', 'SCSS', 'Stripe', 'Vercel'],
    demo_link: 'https://stayease-booking-app.vercel.app/',
    github_link: 'https://github.com/athitthiyan/stayease-booking-app',
    display_date: 'Apr 2026',
    created_at: null,
  },
  {
    id: 2,
    title: 'PayFlow Payment App',
    description: 'Standalone payment experience connected to the hotel booking system. Handles checkout confirmation, payment states, and transaction flow with a clean Angular frontend.',
    tech_stack: ['Angular', 'TypeScript', 'Stripe', 'SCSS', 'Vercel'],
    demo_link: 'https://payflow-payment-app.vercel.app/',
    github_link: 'https://github.com/athitthiyan/payflow-payment-app',
    display_date: 'Apr 2026',
    created_at: null,
  },
  {
    id: 3,
    title: 'InsightBoard Admin',
    description: 'Analytics dashboard for monitoring bookings, revenue, and transactions across the hotel platform. Built for admin workflows with charts and operational visibility.',
    tech_stack: ['Angular', 'TypeScript', 'Chart.js', 'SCSS', 'Vercel'],
    demo_link: 'https://insightboard-admin.vercel.app/',
    github_link: 'https://github.com/athitthiyan/insightboard-admin',
    display_date: 'Apr 2026',
    created_at: null,
  },
  {
    id: 4,
    title: 'HotelAPI Backend',
    description: 'FastAPI backend powering the full hotel platform with PostgreSQL, booking APIs, payment endpoints, analytics routes, and Railway deployment.',
    tech_stack: ['FastAPI', 'Python', 'PostgreSQL', 'SQLAlchemy', 'Railway'],
    demo_link: 'https://hotel-api-production-447d.up.railway.app/docs',
    github_link: 'https://github.com/athitthiyan/hotelapi-backend',
    display_date: 'Apr 2026',
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
