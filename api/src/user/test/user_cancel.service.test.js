require('dotenv').config();
const { UserCancelService } = require('../user_cancel.service');
const { httpResponseMock } = require('./mock/http_response.mock');

const amqp = { sendMessage: jest.fn() };
describe('UserRegisterService', () => {
  let userCancelService;

  beforeEach(() => {
    userCancelService = new UserCancelService(httpResponseMock, amqp.sendMessage);
    jest.clearAllMocks();
  });

  describe('checkStatus', () => {
    it('with Active status', () => {
      const result = userCancelService.checkStatus({ status: 'Active' });

      expect(result).toBeTruthy();
    });

    it('with Cancelled status', () => {
      const result = userCancelService.checkStatus({ status: 'Cancelled' });

      expect(result).toBeTruthy();
    });

    it('with invalid status', () => {
      const result = userCancelService.checkStatus({ status: 'aaaa' });

      expect(result).toBeFalsy();
    });

    it('without property status', () => {
      const result = userCancelService.checkStatus({});

      expect(result).toBeFalsy();
    });

    it('without status', () => {
      const result = userCancelService.checkStatus();

      expect(result).toBeFalsy();
    });
  });

  describe('messageToSend', () => {
    it('with status and userId', () => {
      const payloadReceided = { status: 'Active' };
      const userId = 3;
      const result = userCancelService.messageToSend(payloadReceided, userId);

      expect(result).toEqual('{"status":"ACTIVE","userId":3}');
    });
  });

  describe('execute', () => {
    it('with payloadReceived and userId', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');
      const spyAmqp = jest.spyOn(amqp, 'sendMessage');

      const payloadReceided = { status: 'Active' };
      const userId = 3;
      const result = userCancelService.execute(payloadReceided, userId);

      expect(result).toBeTruthy();
      expect(spyHttpResponseOk).toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).not.toHaveBeenCalled();
      expect(spyHttpResponseInternalError).not.toHaveBeenCalled();
      expect(spyAmqp).toHaveBeenCalled();
    });

    it('with payloadReceived invalid', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');
      const spyAmqp = jest.spyOn(amqp, 'sendMessage');

      const payloadReceided = { status: 'xxxxx' };
      const userId = 3;
      const result = userCancelService.execute(payloadReceided, userId);

      expect(result).toBeFalsy();
      expect(spyHttpResponseOk).not.toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).toHaveBeenCalled();
      expect(spyHttpResponseInternalError).not.toHaveBeenCalled();
      expect(spyAmqp).not.toHaveBeenCalled();
    });

    it('with userID invalid', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');
      const spyAmqp = jest.spyOn(amqp, 'sendMessage');

      const payloadReceided = { status: 'Active' };
      const userId = 'a';
      const result = userCancelService.execute(payloadReceided, userId);

      expect(result).toBeFalsy();
      expect(spyHttpResponseOk).not.toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).toHaveBeenCalled();
      expect(spyHttpResponseInternalError).not.toHaveBeenCalled();
      expect(spyAmqp).not.toHaveBeenCalled();
    });

    it('with system failure', () => {
      const spyHttpResponseOk = jest.spyOn(httpResponseMock, 'ok');
      const spyHttpResponseInternalError = jest.spyOn(httpResponseMock, 'internalError');
      const spyHttpResponseInvalidFormat = jest.spyOn(httpResponseMock, 'invalidFormat');
      const spyAmqp = jest.spyOn(amqp, 'sendMessage').mockImplementation(() => {
        throw new Error('mock exception');
      });

      const payloadReceided = { status: 'Active' };
      const userId = 3;
      const result = userCancelService.execute(payloadReceided, userId);

      expect(result).toBeFalsy();
      expect(spyHttpResponseOk).not.toHaveBeenCalled();
      expect(spyHttpResponseInvalidFormat).not.toHaveBeenCalled();
      expect(spyHttpResponseInternalError).toHaveBeenCalled();
      expect(spyAmqp).toHaveBeenCalled();
    });
  });
});
