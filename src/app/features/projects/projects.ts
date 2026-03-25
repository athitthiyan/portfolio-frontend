import { Component, ChangeDetectionStrategy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { Project } from '../../models/project.model';

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

  projects = toSignal(
    isPlatformBrowser(this.platformId)
      ? this.apiService.getProjects()
      : of([] as Project[]),
    { initialValue: [] as Project[] }
  );
}
