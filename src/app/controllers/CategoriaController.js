const Yup = require('yup');
const CategoriaRepository = require('../../database/postgres/repositories/categoriaRepository');
const ItemRepository = require('../../database/postgres/repositories/itemRepository');

const Constants = require('../constants');

class CategoriaController {
  async index(req, res) {
    const { page = 1} = req.query;
    return res.json( await CategoriaRepository.paginatedList({
      page: page,
      attributes: ['id', 'descricao'],
      order: ['descricao']
    }));
  }

  async listcategorias(req, res) {
    return res.json( await CategoriaRepository.list({
      attributes: ['id', 'descricao'],
      order: ['descricao']
    }));
  }

  async getOne(req, res) {
    const categoria = await CategoriaRepository.findById(req.params.id);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não cadastrada.' });
    }

    const { id, descricao } = categoria;

    return res.json({
      id,
      descricao
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      descricao: Yup.string().required()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });

    const categoriaWithSameDescExists = 
        await CategoriaRepository.findOne({ descricao: req.body.descricao });

    if (categoriaWithSameDescExists)
      return res
        .status(400)
        .json({ error: 'Já existe uma categoria com esta descrição.' });

    const { id, descricao } = await CategoriaRepository.create(req.body);

    return res.json({
      id,
      descricao
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });

    const { descricao: newDescricao } = req.body;

    const categoria = await CategoriaRepository.findById(req.params.id);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não cadastrada.' });
    }
    
    if (newDescricao && newDescricao !== categoria.descricao) {
      const categoriaWithSameDescExists = 
        await CategoriaRepository.findOne({ descricao: newDescricao });
      if (categoriaWithSameDescExists)
      return res
          .status(400)
          .json({ error: 'Já existe uma Categoria com esta descrição.' });
    }
 
    const { id, descricao} = 
      await CategoriaRepository.update(req.params.id, req.body);

    return res.json({
      id,
      descricao
    });
  }

  async delete(req, res) {
    const categoria = await CategoriaRepository.findById(req.params.id);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não existe.' });
    }

    const item = await ItemRepository.findOne({ categoria_id: req.params.id });
    if (item) {
      return res.status(400).json({
        error: 'Existe pelo menos um item de blog ligado a esta categoria.'
      });
    }

    const { id, descricao } = categoria;
    await CategoriaRepository.delete(req.params.id);

    return res.json({
      id,
      descricao
    });
  }
}

module.exports = new CategoriaController();
