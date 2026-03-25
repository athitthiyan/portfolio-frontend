import { Component, OnInit, AfterViewInit, ChangeDetectorRef, inject, PLATFORM_ID, ChangeDetectionStrategy, signal } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Projects } from '../projects/projects';
import { Services } from '../services/services';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Projects, Services, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  typedText = signal('');
  titles = ['Full Stack Developer', 'Angular Specialist', 'Python Developer', 'Booking Systems Expert'];
  titleIndex = 0;
  charIndex = 0;
  isDeleting = false;

  skillBars = [
    { name: 'Angular', pct: 92 },
    { name: 'Python / FastAPI', pct: 88 },
    { name: 'PostgreSQL', pct: 80 },
    { name: 'AWS', pct: 72 }
  ];

  stats = [
    { value: 10000, suffix: '+', label: 'Monthly Transactions', icon: '💳' },
    { value: 60, suffix: '%', label: 'User Engagement Boost', icon: '📈' },
    { value: 30, suffix: '%', label: 'Performance Increase', icon: '⚡' },
    { value: 4, suffix: '+', label: 'Years Experience', icon: '🏆' }
  ];

  animatedStats = signal<number[]>(this.stats.map(() => 0));

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.typeWriter();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollReveal();
      this.initCounters();
    }
  }

  typeWriter() {
    const current = this.titles[this.titleIndex];
    if (this.isDeleting) {
      this.typedText.set(current.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.typedText.set(current.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let speed = this.isDeleting ? 60 : 110;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.titleIndex = (this.titleIndex + 1) % this.titles.length;
      speed = 400;
    }

    setTimeout(() => this.typeWriter(), speed);
  }

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => observer.observe(el));
  }

  initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.stats.forEach((stat, i) => {
            this.animateCounter(i, stat.value);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);
  }

  animateCounter(index: number, target: number) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      const values = [...this.animatedStats()];
      if (current >= target) {
        values[index] = target;
        this.animatedStats.set(values);
        clearInterval(timer);
      } else {
        values[index] = Math.floor(current);
        this.animatedStats.set(values);
      }
    }, 16);
  }

  scrollTo(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
