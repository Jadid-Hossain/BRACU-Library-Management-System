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
}

interface BorrowBookParams {
  userId: string;
  bookId: string;
}

interface ReturnBookParams {
  recordId: string;
  bookId: string;
}

interface ReserveBookParams {
  userId: string;
  bookId: string;
}

interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: Date;
  expiryDate?: Date;
  status: "WAITING" | "READY" | "BORROWED" | "EXPIRED" | "CANCELLED";
  position: number;
  createdAt: Date;
}
