export interface CustomError extends Error {
  statusCode: number;
  statusMsg: string;
}

export class HTTPError extends Error implements CustomError {
  constructor(
    public statusCode: number,
    public statusMsg: string,
    public message: string,
    public options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'HTTPError';
  }
}
