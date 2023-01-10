class Error_409 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Error_409;