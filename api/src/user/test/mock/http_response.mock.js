const httpResponseMock = {
  ok: jest.fn(),
  internalError: jest.fn(),
  invalidFormat: jest.fn(),
};

module.exports = { httpResponseMock };
