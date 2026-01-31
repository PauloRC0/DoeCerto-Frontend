export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}
