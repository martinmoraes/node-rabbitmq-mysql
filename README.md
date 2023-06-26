# Skeelo

Este projeto consiste em desenvolver uma solução de troca mensagens, por RabbitMQ, como parte do processo de recrutamento e avaliação para a empresa [Skeelo](https://skeelo.com/).


<BR>

# Skeelo Recrutamento

---
![JPG](https://app.skeelo.com/conheca-o-skeelo/img/logo-primary.svg)


## Bem vindo

Obrigado por participar do desafio do Skeelo! Estamos muito contentes pelo seu primeiro passo para fazer parte de um time excepcional. Você deverá criar uma solução com duas aplicações: uma api e um projeto que consome mensagens de uma fila.

Pense no desafio como uma oportunidade de mostrar todo o seu conhecimento. E faça com calma, você tem uma semana para entregar! Sua avaliação será baseada nos seguintes tópicos:

- Arquitetura
- Qualidade do código desenvolvido (**em inglês**)
- Conhecimentos na linguagem e pacotes
- Raciocínio lógico

### Linguagem

- [Node.js](https://nodejs.org/en)
- [MySQL](https://www.mysql.com)

### Pacotes obrigatórios

- [Fastify](https://github.com/fastify/fastify)
- [RabbitMQ](https://www.npmjs.com/package/amqplib)
- [Sequelize](https://github.com/sequelize/sequelize) ou [TypeORM](https://github.com/typeorm/typeorm) ou [Prisma](https://github.com/prisma/prisma)

### Testes

- Sabemos que testes não é um tópico que todos dominam ou tem conhecimento, por isso aceitamos desafios de todos os perfis e diferentes níveis de conhecimento técnico. Mas nos preocupamos com a qualidade, saúde e evolução do produto e por isso acreditamos bastante em testes automatizados.

# Aplicações

### Api

 Uma api em Node.js utilizando Fastify com uma rota de cadastro de usuário e uma de cancelamento, controlados por status "**Active**" e "**Cancelled**". A api deve validar os dados recebidos e retornar os devidos códigos de status para cada resposta, use sua criatividades para as possíveis validações. Se os dados estiverem corretos a aplicação deve colocar a mensagem recebida em uma fila do RabbitMQ, uma fila para cada rota.

### Consumer

Uma aplicação em Node.js com a implementação que consome as mensagens das filas utilizadas pela api. Ao receber as mensagens da fila a aplicação deve validar os dados no banco de dados com as devidas regras: 

 - **Cadastro não existente no banco de dados**: Inserir os dados do usuário no banco de dados
 - **Cadastro existente no banco de dados**: Atualizar os dados do usuário no banco de dados
 - **Cancelamento existente no banco de dados**: Atualizar o status do usuário
 - **Cancelamento não existente no banco de dados**: mover a mensagem para uma [fila morta](https://en.wikipedia.org/wiki/Dead_letter_queue)

### MySQL

Sinta-se a vontade para criar a própria estrutura de dados para ser utilizada nessa solução só pedimos que todas as operções feitas no banco de dados pela aplicação sejam feitas no formato [raw query](https://sequelize.org/v7/manual/raw-queries.html), este item é **obrigatório**. 


### Ganha mais pontos se tiver:

- Logs utilizando o [ELK](https://www.elastic.co/what-is/elk-stack)
- Testes unitários


### Iremos ficar encantados:
- Algo inesperado e surpreendente;


## **Processo de entrega**

---

Após finalizar a implementação do desafio, abra um pull request para este repositório seguindo os passos abaixo:

1. Faça um fork deste repositório, não clone este repositório diretamente;
2. Os commit's e as alterações devem ser feitas no **SEU** fork;
3. Envie um Pull Request;
4. Deixe o fork público para facilitar a inspeção do código.

### **ATENÇÃO**

Não faça push diretamente para este repositório!


<br><BR>

# Arquitetura

O sistema tem dois aplicativos: A **API** e o **Consumer**. Estes sistemas se comunicam por meio de uma queue (RabbitMQ).

## Descrição

- **API**: É um serviço web com rotas para criar usuário e cancelar usuário. Quando a aplicação recebe uma requisição os dados são validados e colocados na respectiva fila.

- **Consumer**: É uma aplicação 'consumer', recebe dados das fila e pocessa conforme a fila de origem. Se a operação de "Cancelled" não puder ser realizada os dados são colocados em uma fila "Dead letter".

## Dados de input / output
### API
A API tem duas rotas web com operações para "user":

<br>

#### POST /user
Esta rota é para registrar/ cadastrar um usuário. O payload consite em um objeto JSON no body da requisição:
```
{
  "id": 1,
  "name": "Martin Morães",
  "email": "martin@gmail.sss",
  "fone": "999999"
}
```
A resposta será um objeto JSON com o seguinte conteúdo: 
```
{
    "message": "Request received"
}
```
<br>

#### DELETE /user/:{userID}
Esta rota é para ativar ou cancelar um usuário. A requisição é feita informando o id do usuário na url e fornecendo um payload no bady, indicando de é uma operação para ativar ou cancelar o usuário.

- Para ativar o usuário o payload é:
```
{
    "status": "Active"
}
```
P.S.: Os formatos aceitos o status são: "active", "Active e/ou "ACTIVE".

<BR>

- Para cancelar um usuário o payload é:
``` 
{
    "status": "Cancelled"
}
```
P.S.: Os formatos aceitos o status são: "cancelled", "Cancelled e/ou "CANCELLED".

<BR>

Para todos os casos a resposta será um objeto JSON com o seguinte conteúdo: 
```
{
    "message": "Request received"
}
```


<br><BR>

# Tecnologias utilizadas

## Qualidade de Código

- **prettier**: Ferramenta de formatação de código que ajuda a manter a consistência e a legibilidade do código-fonte.
- **eslint**: Ferramenta de análise estática de código para JavaScript. Ela ajuda a identificar problemas e erros comuns no código, além de aplicar regras de estilo e boas práticas de programação.
- **lint-stageg**: Permite executar linters de código apenas nos arquivos modificados em um determinado commit.
- **test coverage**: É uma métrica usada para medir a extensão em que o código de um programa é testado pelos casos de teste. Ele indica a porcentagem de código que é executado durante a execução dos testes automatizados.


## Outras tecnologias

- **Fastfy**: Framework para desenvolvimento de aplicações web em Node.js. Ele fornece uma camada de abstração sobre o servidor HTTP do Node.js.
- **NodeJS**: Ambiente de tempo de execução de código aberto baseado no motor JavaScript V8 do Google Chrome. Ele permite que você execute JavaScript no lado do servidor.
- **NPM**: Node Package Manager é o gerenciador de pacotes padrão para o ecossistema do Node.js. Ele permite que os desenvolvedores instalem, gerenciem e compartilhem pacotes de código reutilizáveis ​​(módulos) para seus projetos.
- **Jest**: Framework de teste de código aberto para JavaScript, projetado principalmente para testar aplicativos e bibliotecas do Node.js.
- **winston**: Biblioteca de registro (logging) para o Node.js. Ela fornece uma interface flexível e extensível para registrar mensagens e eventos nos aplicativos Node.js.
- **nodemon**: É uma ferramenta que agiliza o desenvolvimento, pois economiza tempo e esforço ao automatizar o processo de reinicialização do servidor sempre que necessário.


<br><BR>

# Testar a API

Para testar a funcionalidade da API pode ser utilizado um o Postman.
Para testar rodando local certifique-se que a aplicação esteja rodando conforme mostrado, logo abaixo, na sessão **Instalação**.

<BR>

## Postman
Para fazer as requisições com o [Postman](https://www.postman.com/). Importe em seu Postman a environment e a collection da pasta postman, na raiz do projeto.
Utiliza as informações mostradas na sessão **Dados de input / output**

<BR>

## RabbitMQ Management Console
Com o RMC pode visualizar as mensagem que transitam em cada fila. Pode acessar pelo navegador, com a solução rodando na máquina local, com o seginte endereço:
P.S.: **usuário**: guest e **senha**: guest
```
http://localhost:15672/
```

<BR>

## MySQL Workbench
Os dados podem ser visualizado com MySQL Workbench ou outro similar. Considerando que a solução esteja rodando na máquina local, crie uma conexão com os seguintes dados:
- HOST = localhost
- DATABASE = skeelo
- USER = skeelo
- PASSWORD = skeelo


<br><BR>

# Instalação


## Obtendo o projeto
Passo 1: Clone o projeto. Na sua pasta de projetos execute o seguinte comando.

```
git clone https://martinmoraes@bitbucket.org/martinmoraes/nodejs.git
```

<BR>

## Acesse a raiz do projeto com o seguinte comando:
```
cd nodejs
```

<br>

## --- As instruões a seguir serão para o projeto **API**


Passo 2: Instale as dependências. Na pasta raiz do projeto, execute os seguintes comando.

```
cd api
npm install
```

## Criação das variáveis de ambiente

Criar o arquivo **.env**, na pasta **api** do projeto, com o seguinte conteudo

P.S.: A variável de ambiente "LOG_DIR" deve conter o path completo para a pasta "log", ou se o seu sistema operacional suportar LOG_DIR=~/log.

```
LOG_DIR=./log
AMQP_HOST='amqp://guest:guest@localhost'
HTTP_PORT=3000
NODE_ENV=development
```

## Execução em modo de produção 

Iniciar a aplicação - Ainda na pasta **api** do projeto execute o comando abaixo.

P.S.: certifique que a variável de ambiênte NODE_ENV seja **production**

```
npm run start:prod
```

## Execução em modo desenvolvimento

Rodar o projeto - Certifique-se de estar na pasta **api** do projeto e execute o seguinte comando.

P.S.: certifique que a variável de ambiênte NODE_ENV seja **development**

```
npm run start:dev
```

<BR>

## --- As instruões a seguir serão para o projeto **CONSUMER** 

Passo 2: Instale as dependências. Na pasta raiz do projeto, execute os seguintes comando.

```
cd consumer
npm install
```

## Criação das variáveis de ambiente

Criar o arquivo **.env**, na pasta **consumer** do projeto, com o seguinte conteudo

P.S.: A variável de ambiente "LOG_DIR" deve conter o path completo para a pasta "log", ou se o seu sistema operacional suportar LOG_DIR=~/log.

```
LOG_DIR=./log
MYSQL_HOST=localhost
MYSQL_DATABASE=skeelo
MYSQL_USER=skeelo
MYSQL_PASSWORD=skeelo
AMQP_HOST='amqp://guest:guest@localhost'
NODE_ENV=development
```

## Execução em modo de produção 

Iniciar a aplicação - Ainda na pasta **api** do projeto execute o comando abaixo.

P.S.: certifique que a variável de ambiênte NODE_ENV seja **production**

```
npm run start:prod
```

## Execução em modo desenvolvimento

Rodar o projeto - Certifique-se de estar na pasta **api** do projeto e execute o seguinte comando.

P.S.: certifique que a variável de ambiênte NODE_ENV seja **development**

```
npm run start:dev
```



<br><BR>

# Testes

Os testes de unidade são uma prática de desenvolvimento de software em que unidades individuais de código são testadas para verificar se funcionam conforme o esperado.

- Para rodar todos os teste, certifique-se de estar na pasta do respectivo projeto (api ou consumer) e execute o seguinte comando:

```
npm run test
```

<br><BR>

# Comandos

Certifique-se de estar na pasta do respectivo projeto (api ou consumer) e execute os comandos abaixo

## Linter

Executa o ESLint e faz alterações nos arquivos. Estando na raiz do projeto execute o seguinte comando:

```
npm run lint:fix
```

## Prettier

Formata os arquivos JavaScript (com extensão .ts) no diretório 'src' e em todos dentro dele. Estando na raiz do projeto execute o seguinte comando:

```
npm run format
```

## Coverage

Verifica a cobertura de teste, Estando na raiz do projeto execute o seguinte comando:

```
npm run test:coverage
```
