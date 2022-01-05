const Yup = require('yup');
const Item = require('../models/Item');
const Autor = require('../models/Autor');
const Categoria = require('../models/Categoria');
const Constants = require('../constants');

class ItemController {
  async index(req, res) {
    let items;
    const { page = 1, sort = 'id' } = req.query;
    const includeAutor = { model: Autor, as: 'autor',attributes: ['name'] };
    const includeCategoria = { 
      model: Categoria, as: 'categoria',attributes: ['descricao'] };
    const { categoria: categoriaFilter } = req.body; 
    const filter = categoriaFilter
        ? {categoria_id : categoriaFilter}
        : '';
    const sortEspec =
      sort.substring(0, sort.indexOf('.')) === 'autor'
        ? [includeAutor, sort.substring(sort.indexOf('.') + 1), 'ASC']
        : sort.substring(0, sort.indexOf('.')) === 'categoria'
        ? [includeCategoria, sort.substring(sort.indexOf('.') + 1), 'ASC']
        : sort;
    items = await Item.findAndCountAll({
      attributes: ['id','titulo'],
      include: [includeAutor, includeCategoria],
      where: filter,
      order: [sortEspec],
      limit: Constants.ROWS_PER_PAGE,
      offset: (page - 1) * Constants.ROWS_PER_PAGE
    });
    
    items.perpage = Constants.ROWS_PER_PAGE;
    return res.json(items);
  }

  async getOne(req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item não cadastrado.' });
    }

    const { id, titulo, descricao, autoId,categoriaId } = item;

    const autor = await Autor.findByPk(req.params.id)
    const { name: autorName} = autor;

    const categoria = await Categoria.findByPk(req.params.id)
    const { descricao: categoriaDescricao } = categoria;

    return res.json({
      id,
      titulo,
      descricao,
      autorName,
      categoriaDescricao
    });
  }


  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      autorId: Yup.number().positive().required(),
      categoriaId: Yup.number().positive().required()
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos.' });

    const autor = await Autor.findByPk(req.body.autorId);
    if (!autor)
      return res.status(400).json({ error: 'Autor não cadastrado.' });

    const categoria = await Categoria.findByPk(req.body.categoriaId);
    if (!categoria)
      return res.status(400).json({ error: 'Categoria não cadastrada.' });

    const { id, titulo, descricao } = await Item.create({
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      autor_id: req.body.autorId,
      categoria_id: req.body.categoriaId
    });

    return res.json({ id, titulo, descricao });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      autorId: Yup.number().positive(),
      categoriaId: Yup.number().positive()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos.' });

    const {
      titulo: newTitulo,
      descricao: newDescricao,
      autorId: newAutorId,
      categoriaId: newCategoriaId
    } = req.body;

    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item de blog não cadastrado.' });
    }

    if (newAutorId && newAutorId !== item.autorId) {
      const autor = await Autor.findByPk(newAutorId);
      if (!autor) {
        return res.status(400).json({ error: 'Autor não cadastrado.' });
      }
    }

    if (newCategoriaId && newCategoriaId !== item.categoriaId) {
      const categoria = await Categoria.findByPk(newCategoriaId);
      if (!categoria) {
        return res.status(400).json({ error: 'Categoria não cadastrada.' });
      }
    }

    const { id, titulo, descricao } = await item.update({
      titulo: newTitulo,
      descricao: newDescricao,
      autor_id: newAutorId,
      categoria_id: newCategoriaId
    });
  

    return res.json({ id, titulo, descricao });

  }

  async delete(req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item de blog não cadastrado.' });
    }

    const {
      id,
      titulo,
      descricao,
    } = item;
    await item.destroy();

    return res.json({ id, titulo, descricao });
  }
}


module.exports = new ItemController();
