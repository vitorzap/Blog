const Yup = require('yup');
const Categoria = require('../models/Categoria');
const Constants = require('../constants');

class CategoriaController {
  async index(req, res) {
    let categorias;
    const { page = 1 } = req.query;
    categorias = await Categoria.findAndCountAll({
      order: ['descricao'],
      limit: Constants.ROWS_PER_PAGE,
      offset: (page - 1) * Constants.ROWS_PER_PAGE
    });
    categorias.perpage = Constants.ROWS_PER_PAGE;
    return res.json(categorias);
  }

  async listcategorias(req, res) {
    let categorias;
    categorias = await Categoria.findAll({
      attributes: ['id', 'descricao'],
      order: ['descricao']
    });
    return res.json(categorias);
  }

  async getOne(req, res) {
    const categoria = await Categoria.findByPk(req.params.id);
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
console.log(req.body);
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });
console.log('Aqui 1');
    const categoriaWithSameDescExists = await Categoria.findOne({
      where: { descricao: req.body.descricao }
    });
    console.log('Aqui 2');
    if (categoriaWithSameDescExists)
      return res
        .status(400)
        .json({ error: 'Já existe uma categoria com esta descrição.' });

    const { id, descricao } = await Categoria.create(req.body);

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

    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não cadastrada.' });
    }

    if (newDescricao && newDescricao !== categoria.descricao) {
      const categoriaWithSameDescExists = await Categoria.findOne({
        where: { descricao: newDescricao }
      });

      if (categoriaWithSameDescExists)
        return res
          .status(400)
          .json({ error: 'Já existe uma Categoria com esta descrição.' });
    }
 
    const { id, descricao} = await categoria.update(req.body);

    return res.json({
      id,
      descricao
    });
  }

  async delete(req, res) {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria não existe.' });
    }

    // const item = await Item.findOne({
    //   where: { Categoria_id: req.params.id }
    // });
    // if (item) {
    //   return res.status(400).json({
    //     error: 'Existe pelo menos um item de blog ligado a esta categoria.'
    //   });
    // }

    const { id, descricao } = categoria;
    await categoria.destroy();

    return res.json({
      id,
      descricao
    });
  }
}

module.exports = new CategoriaController();
