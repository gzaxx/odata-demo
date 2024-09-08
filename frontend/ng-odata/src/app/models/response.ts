export interface Response<T> {
  '@odata.count': number;
  value: Array<T>;
}
