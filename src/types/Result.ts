export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Response<T> {
  status: boolean;
  result: T;
}
