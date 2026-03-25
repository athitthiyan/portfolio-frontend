import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ContactForm } from '../../models/project.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://portfolio-api-qgk1.onrender.com';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  submitContact(data: ContactForm): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/contact`, data);
  }
}
