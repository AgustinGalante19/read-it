export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ResultWithMetadata<T, M = Record<string, any>>
  extends Result<T> {
  metadata?: M;
}
