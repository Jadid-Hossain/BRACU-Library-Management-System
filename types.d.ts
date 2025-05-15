interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  price: number;
  createdAt: Date | null;
  video?: string;
  isLoanedBook?: boolean;
  daysLeft?: number;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
  price: number;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface ReturnBookParams {
  recordId: string;
  bookId: string;
}

interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: "BORROWED" | "RETURNED";
  createdAt: Date | null;
}
