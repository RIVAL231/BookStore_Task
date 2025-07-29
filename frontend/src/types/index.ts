// Type definitions
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  yearPublished: number;
}

export interface User {
  username: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface BooksResponse {
  message: string;
  books: Book[];
}

export interface BookResponse {
  message: string;
  book: Book;
}
