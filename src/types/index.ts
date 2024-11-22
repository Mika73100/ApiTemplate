export interface User {
  id: number;
  name: string;
  email: string;
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