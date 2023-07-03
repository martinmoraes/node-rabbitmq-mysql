const httpResponseMock = {
  ok: jest.fn(),
  internalError: jest.fn(),
  invalidFormat: jest.fn(),
  other: jest.fn(),
};

module.exports = { httpResponseMock };
