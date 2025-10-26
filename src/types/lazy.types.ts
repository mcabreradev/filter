export interface LazyFilterOptions {
  chunkSize?: number;
  maxResults?: number;
  skipCount?: number;
}

export type LazyFilterResult<T> = Generator<T, void, undefined>;

export type AsyncLazyFilterResult<T> = AsyncGenerator<T, void, undefined>;

export interface ChunkedFilterOptions<T> {
  chunkSize: number;
  processChunk?: (chunk: T[], chunkIndex: number) => void;
}
