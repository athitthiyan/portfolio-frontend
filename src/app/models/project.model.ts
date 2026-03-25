export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[] | null;
  demo_link: string | null;
  github_link: string | null;
  display_date: string | null;
  created_at: string | null;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
