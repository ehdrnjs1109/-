export interface Project {
  id: number;
  category: 'stage' | 'motion';
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  venue?: string;
  usage?: string;
  role?: string;
  period?: string;
  concept?: string;
  scope?: string;
  result?: string;
  displayOrder: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  type: string;
  message: string;
  createdAt: string;
}
