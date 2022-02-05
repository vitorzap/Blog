const Yup = require('yup');
const AutorRepository = require('../../database/postgres/repositories/autorRepository');
const CategoriaRepository = require('../../database/postgres/repositories/categoriaRepository');
const ItemRepository = require('../../database/postgres/repositories/itemRepository');



class ItemController {
  async index(req, res) {
    const { page = 1} = req.query;
    const { categoria_id: categoriaId } = req.body;
    var espec = {
      page: page,
      attributes: [
        'id',
        'titulo',
        'descricao',
        'autor_id',
        'categoria_id'
      ],
      order: ['autor.name']
    };
    if (categoriaId) {
      espec['where'] = { categoria_id: categoriaId };
    }
    return res.json( await ItemRepository.paginatedList(espec));
  }

  async getOne(req, res) {
    const item = await ItemRepository.findById(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item não cadastrado.' });
    }
    return res.json(item);
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

    const autor = await AutorRepository.findById(req.body.autorId);
    if (!autor)
      return res.status(400).json({ error: 'Autor não cadastrado.' });

    const categoria = await CategoriaRepository.findById(req.body.categoriaId);
    if (!categoria)
      return res.status(400).json({ error: 'Categoria não cadastrada.' });

    const { id, titulo, descricao } = await ItemRepository.create({
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

    const item = await ItemRepository.findById(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item de blog não cadastrado.' });
    }

    if (newAutorId && newAutorId !== item.autorId) {
      const autor = await AutorRepository.findById(newAutorId);
      if (!autor) {
        return res.status(400).json({ error: 'Autor não cadastrado.' });
      }
    }

    if (newCategoriaId && newCategoriaId !== item.categoriaId) {
      const categoria = await CategoriaRepository.findById(newCategoriaId);
      if (!categoria) {
        return res.status(400).json({ error: 'Categoria não cadastrada.' });
      }
    }

    const { id, titulo, descricao } = await ItemRepository.update(
      req.params.id, 
      {
        titulo: newTitulo,
        descricao: newDescricao,
        autor_id: newAutorId,
        categoria_id: newCategoriaId
      }      
    );
  
    return res.json({ id, titulo, descricao });

  }

  async delete(req, res) {
    const item = await ItemRepository.findById(req.params.id);
    if (!item) {
      return res.status(400).json({ error: 'Item de blog não cadastrado.' });
    }

    const { id, titulo, descricao } = item;
  
    await ItemRepository.delete(req.params.id);

    return res.json({ id, titulo, descricao });
  }
}


module.exports = new ItemController();
