class HttpResponse {
  constructor(response) {
    this.response = response;
  }

  ok(message) {
    return this.response.code(200).send({ message });
  }

  internalError(message) {
    return this.response.code(500).send({ message });
  }

  notFound(payload) {
    return this.response.code(404).send(payload);
  }

  invalidFormat(errors) {
    return this.response.code(403).send({ validationErrors: errors });
  }
}

module.exports = { HttpResponse };
