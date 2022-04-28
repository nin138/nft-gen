export class Result<T, E> {
  private constructor(private success: boolean, private value: T | E) {}
  static ok<T>(value: T) {
    return new Result<T, any>(true, value);
  }
  static err<E>(error: E) {
    return new Result<any, E>(false, error);
  }

  ok() {
    return this.success;
  }

  then(ok: (value: T) => void, err: (err: E) => void): any {
    if(this.ok()) return ok(this.value as T);
    return err(this.value as E);
  }

  unwrap(): T {
    if(!this.ok()) throw new Error('unwrap err result');
    return this.value as T;
  }

  raw(): T | E {
    return this.value;
  }
}