export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

export type Size = 'sm' | 'md' | 'lg' | 'xl';
