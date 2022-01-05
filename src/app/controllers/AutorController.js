const Yup = require('yup');
const Autor = require('../models/Autor');
const Item= require('../models/Item');
const Constants = require('../constants');

class AutorController {
  async index(req, res) {
    let autores;
    const { page = 1, sort = 'name' } = req.query;
    autores = await Autor.findAndCountAll({
      attributes: ['id', 'name','email', 'is_root'],
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
      attributes: ['id', 'name', 'is_root'],
      order: ['name']
    });
    return res.json(autores);
  }

  async getOne(req, res) {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não cadastrado.' });
    }

    const { id, name, email, is_root: isRoot } = autor;

    return res.json({
      id,
      name,
      email,
      isRoot
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref('password'), null]),
      is_root: Yup.boolean()        
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

    const { 
      id, 
      name, 
      email, 
      password, 
      is_root: isRoot 
    } = await Autor.create(req.body);

    return res.json({
      id,
      name,
      email,
      password,
      isRoot
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      is_root: Yup.boolean()
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Dados não válidos' });

    const { email: newEmail, oldPassword } = req.body;

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

    if (oldPassword && !(await autor.checkPassword(oldPassword)))
      return res.status(401).json({ error: 'Senha não confere.' });
 
    const { id, name, email, is_root: isRoot } = await autor.update(req.body);

    return res.json({
      id,
      name,
      email,
      isRoot
    });
  }

  async delete(req, res) {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não existe.' });
    }

    const item = await Item.findOne({
      where: { autor_id: req.params.id }
    });
    if (item) {
      return res.status(400).json({
        error: 'Existe pelo menos um item de blog ligado a este autor.'
      });
    }

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
