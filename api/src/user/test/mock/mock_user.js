const validUser = {
  id: 1,
  name: 'Martin Morães',
  email: 'martin@gmail.xxx',
  fone: '999999',
};

const errorRequire = [
  {
    name: '"name" is required',
  },
  {
    email: '"email" is required',
  },
  {
    fone: '"fone" is required',
  },
];
module.exports = { validUser, errorRequire };
