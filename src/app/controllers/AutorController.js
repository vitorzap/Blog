const Yup = require('yup');
const Autor = require('../models/Autor');
const Constants = require('../constants');

class AutorController {
  async index(req, res) {
    let autores;
    const { page = 1, sort = 'name' } = req.query;
    autores = await Autor.findAndCountAll({
      order: [sort || 'name'],
      limit: Constants.ROWS_PER_PAGE,
      offset: (page - 1) * Constants.ROWS_PER_PAGE
    });
    autores.perpage = Constants.ROWS_PER_PAGE;
    return res.json(autores);
  }

  async listautores(req, res) {
    let autores;
    autores = await Autor.findAll({
      attributes: ['id', 'name'],
      order: ['name']
    });
    return res.json(autores);
  }

  async getOne(req, res) {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não cadastrado.' });
    }

    const { id, name, email } = autor;

    return res.json({
      id,
      name,
      email
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });

    const autorWithSameEmailExists = await Autor.findOne({
      where: { email: req.body.email }
    });

    if (autorWithSameEmailExists)
      return res
        .status(400)
        .json({ error: 'Já existe uma autor com este email.' });

    const { id, name, email } = await Autor.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });

    const { email: newEmail } = req.body;

    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não cadastrada.' });
    }

    if (newEmail && newEmail !== autor.email) {
      const autorWithSameEmailExists = await Autor.findOne({
        where: { email: newEmail }
      });

      if (autorWithSameEmailExists)
        return res
          .status(400)
          .json({ error: 'Já existe uma Autor com este email.' });
    }
 
    const { id, name, email } = await autor.update(req.body);

    return res.json({
      id,
      name,
      email
    });
  }

  async delete(req, res) {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não existe.' });
    }

    // const item = await Item.findOne({
    //   where: { Autor_id: req.params.id }
    // });
    // if (item) {
    //   return res.status(400).json({
    //     error: 'Existe pelo menos um item de blog ligado a este autor.'
    //   });
    // }

    const { id, name, email } = autor;
    await autor.destroy();

    return res.json({
      id,
      name,
      email
    });
  }
}

module.exports = new AutorController();
