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

const MOCK_autor_new = {
    "name": "Autor_incluido",
    "email": "autorincluido@gmail.com",
    "password": "123456",
    "confirmPassword": "123456",
    "is_root": false
}
const MOCK_autor_update = {
    "name": "Autor_alterado",
    "email": "autoralterado@gmail.com",
    "is_root": true
}

function Normaliza(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    const { name, email, is_root } = wObj;
    return { name, email, is_root };
}

function GetId(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    return wObj.id;
}


describe('Testes de Autor', function() {
    this.timeout(Infinity);
    before(async () => {
        const autor = await  AutorRepository.findOne( { email: MOCK_autor_new.email });
        if (autor) await  AutorRepository.delete( autor.id );
    });
    var autorCount = 0;
    var incluidoId;
    it("incluir  autor", async () => {
            const createData = await  AutorRepository.create( MOCK_autor_new);
            incluidoId = GetId(createData);
            assert.deepEqual(
                Normaliza(createData), 
                Normaliza(MOCK_autor_new)
            );
    });
    it("Obter um autor", async () => {
        const autorObtido = await  AutorRepository.findById(incluidoId);
        assert.deepEqual(Normaliza(autorObtido),Normaliza(MOCK_autor_new));
    })
    it("Obter uma lista de autores", async () => {
        const lista = await  AutorRepository.list({
            attributes: ['id', 'name', 'email', 'is_root'],
            order: ['id']
        });
        autorCount = lista.length;
        const ultimo = lista[lista.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_autor_new));
    })
    it("Obter uma pagina de autores", async () => {
        lastPage = Math.ceil(autorCount / Constants.ROWS_PER_PAGE);
        const pagina = await  AutorRepository.paginatedList({
            attributes: ['id', 'name', 'email', 'is_root'],
            order: ['id'],
            page: lastPage
        });
        const ultimo = pagina.rows[pagina.rows.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_autor_new));
    })
    it("Alterar autor", async () => {
            const updateData = await  AutorRepository.update(
                incluidoId,
                MOCK_autor_update
            );
            const autorAlterado = await  AutorRepository.findById(incluidoId);
            assert.deepEqual(
                Normaliza(autorAlterado), 
                Normaliza(MOCK_autor_update)
            );
    });
    it("Excluir autor", async () => {
            await  AutorRepository.delete(incluidoId);
            const autorDeletado = await  AutorRepository.findById(incluidoId);
            assert.deepEqual(autorDeletado, undefined);
    });

})