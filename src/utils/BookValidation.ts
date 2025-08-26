import { GoogleBookItem } from '@/types/Book';

export class BookValidation {
  static isValidGoogleBookItem(item: GoogleBookItem): boolean {
    return !!(item && item.id && item.volumeInfo && item.volumeInfo.title);
  }

  static isValidGoogleId(id: string): boolean {
    return typeof id === 'string' && id.length > 0;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidStatus(status: number): boolean {
    return [1, 2, 3].includes(status);
  }

  static isValidDateString(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date) && !isNaN(Date.parse(date));
  }
}
