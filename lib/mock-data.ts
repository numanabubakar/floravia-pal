export interface Product {
  id: string;
  name: string;
  type: 'standard' | 'premium';
  description: string;
  contents: string[];
  imageUrl: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  featured: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  role: 'member' | 'volunteer' | 'moderator' | 'admin';
  status: 'active' | 'inactive';
  bio?: string;
  imageUrl?: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  message: string;
  status: 'completed' | 'pending';
}
