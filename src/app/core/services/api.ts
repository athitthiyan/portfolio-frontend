import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { Project, ContactForm } from '../../models/project.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://zqqfzgiiqgpfcnqjidta.supabase.co/functions/v1';

  // In-memory cache — one HTTP call per app session, instant on re-render
  private projectsCache$: Observable<Project[]> | null = null;

  getProjects(): Observable<Project[]> {
    if (!this.projectsCache$) {
      this.projectsCache$ = this.http
        .get<Project[]>(`${this.baseUrl}/projects`)
        .pipe(
          shareReplay(1) // cache the last emitted value, replay to new subscribers
        );
    }
    return this.projectsCache$;
  }

  // Call this if you ever need to force-refresh (e.g. after adding a project)
  clearProjectsCache(): void {
    this.projectsCache$ = null;
  }

  submitContact(data: ContactForm): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/contact`, data);
  }
}
