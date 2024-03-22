export class Message<T> {
  constructor(
    public id: string,
    public time: string,
    public event: string,
    public source: string,
    public data: T,
  ) {}
}
