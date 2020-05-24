export type Empty = void | undefined | null;
export type AnyFunction = (...args: any[]) => any;
export type NoIOFunction = () => void;
export type AsyncNoIOFunction = () => Promise<void>;
export type Nullable<T> = undefined | null | void | T;
