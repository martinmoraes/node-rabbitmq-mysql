require('dotenv').config();
const { userSchema } = require('../user_validate.schema');

describe('validade user schema', () => {
  let validUser;

  beforeEach(() => {
    validUser = {
      id: 1,
      name: 'Martin Morães',
      email: 'martin@gmail.xxx',
      fone: '999999',
    };
  });
  describe('validate id', () => {
    it('with valid id', () => {
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation).toEqual(
        expect.objectContaining({
          value: { email: 'martin@gmail.xxx', fone: '999999', id: 1, name: 'Martin Morães' },
        }),
      );
    });

    it('with invalid id', () => {
      validUser.id = 'a';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"id" must be a number');
    });

    it('without id', () => {
      delete validUser.id;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation).toEqual(
        expect.objectContaining({
          value: { name: 'Martin Morães', email: 'martin@gmail.xxx', fone: '999999' },
        }),
      );
    });
  });

  describe('validate name', () => {
    it('with valid name', () => {
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation).toEqual(
        expect.objectContaining({
          value: { email: 'martin@gmail.xxx', fone: '999999', id: 1, name: 'Martin Morães' },
        }),
      );
    });

    it('with invalid name', () => {
      validUser.name = 1;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"name" must be a string');
    });

    it('with name greater than 100', () => {
      validUser.name =
        'Xu@muK7Wfn5XLainsL^bkNRqrk%u8G8biVxjJ4C^ACHgvaRyCe2^BHAUy2RBBf&u2A!%Fj6E6o5VtuztB!B7FNpaMdH^VvVTHkqH@';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual(
        '"name" length must be less than or equal to 100 characters long',
      );
    });

    it('without name', () => {
      delete validUser.name;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"name" is required');
    });
  });

  describe('validate email', () => {
    it('with valid email', () => {
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation).toEqual(
        expect.objectContaining({
          value: { email: 'martin@gmail.xxx', fone: '999999', id: 1, name: 'Martin Morães' },
        }),
      );
    });

    it('with invalid email', () => {
      validUser.email = 'qweqwewqe.qwqw';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"email" must be a valid email');
    });

    it('with name greater than 0', () => {
      validUser.email =
        'Xu@muK7Wfn5XLainsL@^bkNRqrk%u8G8biVxjJ4C^.ACHgvaRyCe2^BHAUy2RBBf&u2A!%Fj6E6o5VtuztB!B7FNpaMdH^VvVTHkqH@';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual(
        '"email" length must be less than or equal to 80 characters long',
      );
    });

    it('without email', () => {
      delete validUser.email;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"email" is required');
    });
  });

  describe('validate fone', () => {
    it('with valid fone', () => {
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation).toEqual(
        expect.objectContaining({
          value: { email: 'martin@gmail.xxx', fone: '999999', id: 1, name: 'Martin Morães' },
        }),
      );
    });

    it('with numeric fone', () => {
      validUser.fone = 1;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"fone" must be a string');
    });

    it('with fone greater than 32', () => {
      validUser.fone =
        'Xu@muK7Wfn5XLainsL@^bkNRqrk%u8G8biVxjJ4C^.ACHgvaRyCe2^BHAUy2RBBf&u2A!%Fj6E6o5VtuztB!B7FNpaMdH^VvVTHkqH@';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual(
        '"fone" length must be less than or equal to 32 characters long',
      );
    });

    it('without fone', () => {
      delete validUser.fone;
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"fone" is required');
    });
  });

  describe('other properties', () => {
    it('with unexpected properties', () => {
      validUser.other = 'other';
      const validation = userSchema.validate(validUser, { abortEarly: false });

      expect(validation.error.details[0].message).toEqual('"other" is not allowed');
    });
  });
});
