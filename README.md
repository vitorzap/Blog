# ABlog - API para Blog

## Introdução
Este software implementa uma API para uso na criação de um BLOG.

## Ambiente
- Escrito em Node.Js
- Utiliza SGBD Postgres
- Sequelize
- Express
- 
## Banco de Dados

O BD do ABlog contém somente 3 tabelas
- Autor - Contendo os autores dos tiems de blog
```sh
id: INTEGER - identificador único
name: STRING - Nome do autor
email: STRING - Email do autor
```
- Categoria - As categorias em que se classificam os itens de blog
```sh
id: INTEGER - identificador único
descricao: STRING - descrição da categoria
```
- Item - Os itens do blog
```sh
id: INTEGER - identificador único
titulo: STRING - título do item de blog
descricao: TEXT - contém o texto do blog
autor_id: INTEGER - chave estrangeira de autor
categoria_id: INTEGER - chave estrangeira de categoria
```

##  Estrutura de Diretórios
```sh
* src - Diretório dos códigos fonte - contém os módulos de inicalização
    * app 
        * controllers 
        * models
    * config - Módulos de configuração (ex: configuração do SGBD)
    * database - contém o diretório de migrações e o módulo de inicialização do BD
    *    migrations - migrações
```
Em src temos o modulo app.js que é o módulo inicial da aplicação

## A API
#### Autores
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET | /autor | lista autores de forma paginada, permitindo informar a ordem e a página desejada (1)  |
GET | /listautor | lista autores de uma forma resumida (id, name) (2)|
GET | /autor/:id | obtém os dados do autor da id informada |
POST | /autor | inclusão de autor |
PUT | /autor/:id | alteração do autor da id informada |
DELETE | /autor/:id | exclusao do autor da id informada |


#### Categorias
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET | /categoria | lista categorias de forma paginada,  permitindo infroma a ordem e a página desejada (1) |
GET | /listcategoria |  lista categorias de uma forma resumida (id, name) (2)|
GET | /categoria/:id | obtém os dados da categoria da id informada |
POST | /categoria |inclusão de categoria |
PUT | /categoria/:id | alteração da categoria da id informada |
DELETE | /categoria/:id | exclusao da categoria da id informada |

#### Items
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET |/item | lista items de blog de forma paginada,  permitindo infroma a ordem e a página desejada (3) |
GET |/item/:id |obtém os detalhes do item de blog da id informada |
POST |/item | inclusão de item de blog |
PUT | /item/:id | alteração de item de blog da id informada |
DELETE | /item/:id | exclusao de item de blog da id informada |

##### Observações
- (1) - A paginação é obtida através do parametro de querystring "page" e a ordenação pelo parametro também de querystring "sort"
- (2) - função implementada com o objetivo de prover dados para o preenchimento de caixas de selação (dropdownbox) ou kista de seleção de acordo com necessário pelo frontend
- (3) - Aqui além da paginação e ordena'ão já descritos em (*) existe a possibilidade de filtrar por categoria, desde que o campo categoria (ex: {"categoria": 4 }) seja informado no corpo da requisição. Obs: Esta seleção por categoria esta apresentando problemas e será resolvido na próxima versão.

#### Formato das repostas

Todos as funcionalidades da API  retorna JSON, sendo interessante ver que as funções que implementam paginação tem o seguinte formato:

{"count": X, "rows": [], "perpage": Y}

onde: 
* count = Quantidade total de objetos selecionado 
* rows = Lista de objetos da página selecionada ( contém no máximo uma quantidade de objetos igual ao tamanho da página)
* perpage = Tamanho dá página em uso
