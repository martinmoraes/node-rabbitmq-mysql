

# Skeelo Recrutamento

---
![JPG](https://pbs.twimg.com/profile_images/1189989686078562306/HqtcTyhQ_400x400.jpg)


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