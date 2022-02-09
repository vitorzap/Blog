const path = require('path');
const Constants = require('../app/constants');
const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const { setTimeout } = require('timers/promises');

require('dotenv').config();
const app = require('../app');
const CategoriaRepository = require(path.join(
    '../database', Constants.DB_ESPEC, 'repositories/categoriaRepository'
));
const MOCK_categoria_new = {
    "descricao": "Categoria_incluida",
}
const MOCK_categoria_update = {
    "descricao": "Categoria_alterada",

}

function Normaliza(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    const { descricao } = wObj;
    return { descricao };
}

function GetId(obj) {
    const wObj = !('dataValues' in obj) ? obj : obj.dataValues;
    return wObj.id;
}


describe('Testes de Categoria', function() {
    this.timeout(Infinity);
    before(async () => {
        const categoria = await  CategoriaRepository.findOne( 
            { descricao: MOCK_categoria_new.descricao }
        );
        if (categoria) await  CategoriaRepository.delete( categoria.id );
    });
    var categoriaCount = 0;
    var incluidoId;
    it("incluir  categoria", async () => {
            const createData = await  CategoriaRepository.create( MOCK_categoria_new);
            incluidoId = GetId(createData);
            assert.deepEqual(
                Normaliza(createData), 
                Normaliza(MOCK_categoria_new)
            );
    });
    it("Obter um categoria", async () => {
        const categoriaObtida = await  CategoriaRepository.findById(incluidoId);
        assert.deepEqual(Normaliza(categoriaObtida),Normaliza(MOCK_categoria_new));
    })
    it("Obter uma lista de categorias", async () => {
        const lista = await  CategoriaRepository.list({
            attributes: ['id', 'descricao'],
            order: ['id']
        });
        categoriaCount = lista.length;
        const ultimo = lista[lista.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_categoria_new));
    })
    it("Obter uma pagina de categoriaes", async () => {
        lastPage = Math.ceil(categoriaCount / Constants.ROWS_PER_PAGE);
        const pagina = await  CategoriaRepository.paginatedList({
            attributes: ['id', 'descricao'],
            order: ['id'],
            page: lastPage
        });
        const ultimo = pagina.rows[pagina.rows.length - 1];
        assert.deepEqual(Normaliza(ultimo),Normaliza(MOCK_categoria_new));
    })
    it("Alterar categoria", async () => {
            const updateData = await  CategoriaRepository.update(
                incluidoId,
                MOCK_categoria_update
            );
            const categoriaAlterado = await  CategoriaRepository.findById(incluidoId);
            assert.deepEqual(
                Normaliza(categoriaAlterado), 
                Normaliza(MOCK_categoria_update)
            );
    });
    it("Excluir categoria", async () => {
            await  CategoriaRepository.delete(incluidoId);
            const categoriaDeletado = await  CategoriaRepository.findById(incluidoId);
            assert.deepEqual(categoriaDeletado, undefined);
    });

})