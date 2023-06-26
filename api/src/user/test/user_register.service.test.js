require('dotenv').config();
const { UserRegisterService } = require('../user_register.service');
const { httpResponseMock } = require('./mock/http_response.mock');
const { validUser, errorRequire } = require('./mock/mock_user');

const amqp = { sendMessage: jest.fn() };
describe('UserRegisterService', () => {
  let userRegisterService;

  beforeEach(() => {
    userRegisterService = new UserRegisterService(httpResponseMock, amqp.sendMessage);
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('with correct user', () => {
      const result = userRegisterService.validateUser(validUser);

      expect(result).toEqual([]);
    });

    it('without user attributes', () => {
      const result = userRegisterService.validateUser({});

      expect(result).toEqual(errorRequire);
    });
  });

  describe('checkUser', () => {
    it('with correct user', () => {
      const result = userRegisterService.checkUser(validUser);

      expect(result).toBeTruthy();
    });

    it('without user attributes', () => {
      const result = userRegisterService.checkUser({});

      expect(result).toBeFalsy();
    });
  });

  describe('execute', () => {
    it('with correct user', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');

      userRegisterService.execute(validUser);

      expect(spyHttpResponseOk).toHaveBeenCalled();
      expect(spyHttpResponseInternalError).not.toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).not.toHaveBeenCalled();
    });

    it('without user attributes', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');

      userRegisterService.execute({});

      expect(spyHttpResponseOk).not.toHaveBeenCalled();
      expect(spyHttpResponseInternalError).not.toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).toHaveBeenCalled();
    });

    it('with system failure', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');
      const spyAmqp = jest.spyOn(amqp, 'sendMessage').mockImplementation(() => {
        throw new Error('mock exception');
      });

      userRegisterService.execute(validUser);

      expect(spyHttpResponseOk).not.toHaveBeenCalled();
      expect(spyHttpResponseInternalError).toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).not.toHaveBeenCalled();
      expect(spyAmqp).toHaveBeenCalled();
    });
  });
});
