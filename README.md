# ABlog - API para Blog

## Introdução
Este software implementa uma API para uso na criação de um BLOG.

## Ambiente
- Escrito em Node.Js
- Utiliza SGBD Postgres
- Sequelize
- Express
- Redis
## Banco de Dados

O BD do ABlog contém somente 3 tabelas
- Autor - Contendo os autores dos items de blog
```sh
id: INTEGER - identificador único
name: STRING - Nome do autor
email: STRING - Email do autor
password_hash: STRING - Password do autor encriptada via BCRYPT
is_root - BOOLEAN - indica se o autor é administrador ou não
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

- Campos de controle - 
Além dos campos acima relacionados todas tabelas contém os seguintes campos de controle
```sh
created_at: DATE - Data e hora em que o registro foi criado
updated_at: DATE - Data e hora da ultima atualização do registro
```
Estes campos são atualizados automaticamente pelo SGBD, não existindo nenhuma implementação no ABlog para atualiza-los, 


##  Estrutura de Diretórios
```sh
* src - Diretório dos códigos fonte - contém os módulos de inicialização
    * app 
        * controllers 
        * models
        * middleware
    * config - Módulos de configuração (ex: configuração do SGBD)
    * database - contém o diretório de migrações e o módulo de inicialização do BD
    *    migrations - migrações
```
Em src temos os modulo ***app.js*** que é o módulo inicial da aplicação e o módulo ***routes.js*** onde estão concetrada as rotas do aplicativo.

## A API
#### Sessão
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET | /login | inicia a sessão |
GET | /logout | encerra a sessão |

#### Autores
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET | /autor | lista autores de forma paginada, permitindo informar a ordem e a página desejada (1)  |
GET | /listautor | lista autores de uma forma resumida (id, name) (2)|
GET | /autor/:id | obtém os dados do autor da id informada |
POST | /autor | inclusão de autor |
PUT | /autor/:id | alteração do autor da id informada |
DELETE | /autor/:id | exclusão do autor da id informada |


#### Categorias
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET | /categoria | lista categorias de forma paginada,  permitindo informa a ordem e a página desejada (1) |
GET | /listcategoria |  lista categorias de uma forma resumida (id, name) (2)|
GET | /categoria/:id | obtém os dados da categoria da id informada |
POST | /categoria |inclusão de categoria |
PUT | /categoria/:id | alteração da categoria da id informada |
DELETE | /categoria/:id | exclusão da categoria da id informada |

#### Items
| Ação | URL | Descrição |
| ------ | ------ | ---- |
GET |/item | lista items de blog de forma paginada,  permitindo informa a ordem e a página desejada (3) |
GET |/item/:id |obtém os detalhes do item de blog da id informada |
POST |/item | inclusão de item de blog |
PUT | /item/:id | alteração de item de blog da id informada |
DELETE | /item/:id | exclusão de item de blog da id informada |

##### Observações
- (1) - A paginação é obtida através do parâmetro de querystring "page" e a ordenação pelo para
âmetro também de querystring "sort"
- (2) - função implementada com o objetivo de prover dados para o preenchimento de caixas de seleção (dropdownbox) ou lista de seleção de acordo com necessário pelo frontend
- (3) - Aqui além da paginação e ordenação já descritos em (*) existe a possibilidade de filtrar por categoria, desde que o campo categoria (ex: {"categoria": 4 }) seja informado no corpo da requisição. Obs: Esta seleção por categoria esta apresentando problemas e será resolvido na próxima versão.

#### Formato das repostas

Todos as funcionalidades da API  retornam JSON, sendo interessante ver que as funções que implementam paginação tem o seguinte formato:

{"count": X, "rows": [], "perpage": Y}

onde: 
* count = Quantidade total de objetos selecionado 
* rows = Lista de objetos da página selecionada ( contém no máximo uma quantidade de objetos igual ao tamanho da página)
* perpage = Tamanho dá página em uso

A razão desta estrutura é fornecer suporte a paginação no frontend.

## Autenticação

É utilizado o "***JSON Web Token***" para o controle do acesso ao sistema, assim a cada ***login*** bem sucedido o sistema fornece um token que deve ser incluído nas requisições seguintes para que estas sejam autorizadas. O token deve ir no  "Authorization header" usando esquema "Bearer".
Para o **logout*** utiliza-se uma "***black list***" implementada no REDIS, assim a requisição de logout implica na adição do token em uso nesta lista. O token que estiver nesta lista está invalidado, já que o processo de autenticação além de validar o token, confere se este está contido nesta lista, caso esteja o acesso é negado. 


