const path = require('path');
const Constants = require('../app/constants');
const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const { setTimeout } = require('timers/promises');


chai.use(chaiHttp);
require('dotenv').config();
const app = require('../app');
const AutorRepository = require(path.join(
    '../database', Constants.DB_ESPEC, 'repositories/autorRepository'
));
const CategoriaRepository = require(path.join(
    '../database', Constants.DB_ESPEC, 'repositories/categoriaRepository'
));
const ItemRepository = require(path.join(
    '../database', Constants.DB_ESPEC, 'repositories/itemRepository'
));

const MOCK_item_new = {
    "titulo": "Item_incluido",
    "descricao": "Descricao do item incluido",
}
const MOCK_item_update = {
    "titulo": "Item_alterado",
    "descricao": "Descricao do item alterado",
}
const MOCK_autor_new = {
    "name": "Autor_incluido",
    "email": "autorincluido@gmail.com",
    "password": "123456",
    "confirmPassword": "123456",
    "is_root": false
}
const MOCK_autor_new2= {
    "name": "Autor_incluido2",
    "email": "autorincluido2@gmail.com",
    "password": "123456",
    "confirmPassword": "123456",
    "is_root": false
}
const MOCK_categoria_new = {
    "descricao": "Categoria_incluida",
}
const MOCK_categoria_new2 = {
    "descricao": "Categoria_incluida2",
}

function Normaliza(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    const { titulo, descricao, categoria_id, autor_id } = wObj;
    return { titulo, descricao, categoria_id, autor_id };
}

function GetId(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    return wObj.id;
}


describe('Testes de Item', function() {
    this.timeout(Infinity);
    before(async () => {
        const item = await  ItemRepository.findOne( { titulo: MOCK_item_new.titulo });
        if (item) await  ItemRepository.delete( item.id );

        const categoria = await  CategoriaRepository.findOne( 
            { descricao: MOCK_categoria_new.descricao }
        );
        if (categoria) {
            MOCK_item_new.categoria_id = GetId(categoria);
        } else {
            const categoriaNew = await  CategoriaRepository.create( MOCK_categoria_new);
            MOCK_item_new.categoria_id = GetId(categoriaNew);
        }
        const categoria2 = await  CategoriaRepository.findOne( 
            { descricao: MOCK_categoria_new2.descricao }
        );
        if (categoria2) {
            MOCK_item_update.categoria_id = GetId(categoria2);
        } else {
            const categoriaNew2 = await  CategoriaRepository.create( MOCK_categoria_new2);
            MOCK_item_update.categoria_id = GetId(categoriaNew2);
        }
 
        const autor = await  AutorRepository.findOne( { email: MOCK_autor_new.email });
        if (autor) {
            MOCK_item_new.autor_id = GetId(autor);
        } else {
            const autorNew = await  AutorRepository.create( MOCK_autor_new);
            MOCK_item_new.autor_id = GetId(autorNew);
        }
        const autor2 = await  AutorRepository.findOne( { email: MOCK_autor_new2.email });
        if (autor2) {
            MOCK_item_update.autor_id = GetId(autor2);
        } else {
            const autorNew2 = await  AutorRepository.create( MOCK_autor_new2);
            MOCK_item_update.autor_id = GetId(autorNew2);
        }
    });
    var itemCount = 0;
    var incluidoId;
    it("incluir  item", async () => {
            const createData = await  ItemRepository.create( MOCK_item_new);
            incluidoId = GetId(createData);
            assert.deepEqual(
                Normaliza(createData), 
                Normaliza(MOCK_item_new)
            );
    });
    it("Obter um item", async () => {
        const itemObtido = await  ItemRepository.findById(incluidoId);
        assert.deepEqual(Normaliza(itemObtido),Normaliza(MOCK_item_new));
    })
    it("Obter uma lista de items", async () => {
        const lista = await  ItemRepository.list({
            attributes: ['id', 'titulo', 'descricao', 'categoria_id', 'autor_id'],
            order: ['id']
        });
        itemCount = lista.length;
        const ultimo = lista[lista.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_item_new));
    })
    it("Obter uma pagina de items", async () => {
        lastPage = Math.ceil(itemCount / Constants.ROWS_PER_PAGE);
        const pagina = await  ItemRepository.paginatedList({
            attributes:  ['id', 'titulo', 'descricao', 'categoria_id', 'autor_id'],
            order: ['id'],
            page: lastPage
        });
        const ultimo = pagina.rows[pagina.rows.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_item_new));
    })
    it("Alterar item", async () => {
            const updateData = await  ItemRepository.update(
                incluidoId,
                MOCK_item_update
            );
            const itemAlterado = await  ItemRepository.findById(incluidoId);
            console.log('itemAlterado',Normaliza(itemAlterado));
            console.log('Normaliza(MOCK_item_update)',Normaliza(MOCK_item_update));
            assert.deepEqual(
                Normaliza(itemAlterado), 
                Normaliza(MOCK_item_update)
            );
    });
    it("Excluir item", async () => {
            await  ItemRepository.delete(incluidoId);
            const itemDeletado = await  ItemRepository.findById(incluidoId);
            assert.deepEqual(itemDeletado, undefined);
    });

})