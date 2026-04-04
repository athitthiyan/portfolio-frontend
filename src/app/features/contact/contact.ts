import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api';
import { ContactForm } from '../../models/project.model';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {
  private apiService = inject(ApiService);

  form = signal<ContactForm>({
    name: '',
    email: '',
    message: ''
  });

  isSubmitting = signal(false);
  submitMessage = signal('');
  isSuccess = signal(false);

  onSubmit() {
    if (!this.validateForm()) return;

    this.isSubmitting.set(true);
    this.submitMessage.set('');

    this.apiService.submitContact(this.form()).subscribe({
      next: (response) => {
        this.isSuccess.set(true);
        this.submitMessage.set(response.message || 'Message sent successfully!');
        this.form.set({ name: '', email: '', message: '' });
        this.isSubmitting.set(false);

        setTimeout(() => {
          this.isSuccess.set(false);
          this.submitMessage.set('');
        }, 5000);
      },
      error: (error) => {
        this.isSuccess.set(false);
        this.submitMessage.set(
          error.error?.message ||
          error.error?.error ||
          'Failed to send message. Please try again.'
        );
        this.isSubmitting.set(false);

        setTimeout(() => {
          this.submitMessage.set('');
        }, 5000);
      }
    });
  }

  private validateForm(): boolean {
    const { name, email, message } = this.form();
    if (!name || !email || !message) {
      this.submitMessage.set('Please fill in all fields');
      this.isSuccess.set(false);
      return false;
    }
    if (!this.isValidEmail(email)) {
      this.submitMessage.set('Please enter a valid email');
      this.isSuccess.set(false);
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  updateForm(field: keyof ContactForm, value: string) {
    this.form.update(current => ({
      ...current,
      [field]: value
    }));
  }
}
