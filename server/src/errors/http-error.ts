class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    if (!message || !statusCode) {
      throw new Error('Invalid error props');
    }

    super(message);

    this.statusCode = statusCode;
  }
}

export { HttpError };
