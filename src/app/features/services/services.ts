import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Services {
  services = [
    {
      id: 1,
      title: 'Booking Systems',
      description: 'End-to-end booking platforms with real-time availability, payment integration, and admin dashboards.',
      icon: '📅'
    },
    {
      id: 2,
      title: 'Payment Integration',
      description: 'Secure payment gateway integration with multiple providers, transaction handling, and compliance.',
      icon: '💳'
    },
    {
      id: 3,
      title: 'Admin Dashboards',
      description: 'Powerful analytics and management dashboards with real-time data visualization and insights.',
      icon: '📊'
    },
    {
      id: 4,
      title: 'Web Applications',
      description: 'Full-stack web applications built with modern frameworks, scalable architecture, and performance optimization.',
      icon: '🚀'
    }
  ];
}
