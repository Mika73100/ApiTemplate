export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: {
    name: string;
  };
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
}