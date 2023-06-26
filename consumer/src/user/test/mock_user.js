const UserRepository = {
  findByEmail: jest.fn(),
  updateById: jest.fn(),
  insert: jest.fn(),
  findById: jest.fn(),
  setStatusById: jest.fn(),
};

const executeQuery = {
  executeQuery: jest.fn(),
};

const userResultFind = {
  id: 1,
  name: 'Martin Morães',
  email: 'martin@gmail.xxx',
  fone: '999999',
};

const userDTOWithID = {
  id: 2,
  name: 'Novo User',
  email: 'novo@gmail.xxx',
  fone: '8888888',
};

const userDTOWithoutID = {
  name: 'Martin Morães',
  email: 'martin@gmail.xxx',
  fone: '999999',
};

module.exports = { UserRepository, userResultFind, userDTOWithID, userDTOWithoutID, executeQuery };
