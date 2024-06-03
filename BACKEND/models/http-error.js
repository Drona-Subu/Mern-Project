class HttpError extends Error {
  constructor(message, errorCode) {
    // calling the constructor of base class i.e. Error class.
    // This adds a "message" property.
    super(message);

    // Adds a "code" property.
    this.code = errorCode;
  }
}

module.exports = HttpError;
