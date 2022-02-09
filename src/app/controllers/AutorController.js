const bcrypt = require('bcryptjs');
const Yup = require('yup');
const Constants = require('../constants');
const ItemRepository = require('../../database/postgres/repositories/itemRepository');
const AutorRepository = require('../../database/postgres/repositories/autorRepository');


class AutorController {

  async index(req, res) {
    const { page = 1, sort = 'name' } = req.query;
    return res.json( await AutorRepository.paginatedList({
      attributes: ['id', 'name','email', 'is_root'],
      order: [sort],
      page: page
    }
    ));
  }

  async listautores(req, res) {
    return res.json(
      await AutorRepository.list({
        attributes: ['id', 'name', 'is_root'],
        order: ['name']
      })
    );
  }

  async getOne(req, res) {
    // const autor = await Autor.findByPk(req.params.id);
    const autor = await AutorRepository.findById(req.params.id);
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

    // const autorWithSameEmailExists = await Autor.findOne({
    //   where: { email: req.body.email }
    // });
    const autorWithSameEmailExists = 
          await AutorRepository.findOne({ email: req.body.email });

    if (autorWithSameEmailExists)
      return res
        .status(400)
        .json({ error: 'Já existe uma autor com este email.' });

    const { password } = req.body; 
    console.log('password',password);
    const password_hash = await bcrypt.hash(password, 8);
    console.log('password_hash',password_hash);
    const { 
      id, 
      name, 
      email, 
      is_root: isRoot
    } = await AutorRepository.create({...req.body, password_hash});


    return res.json({
      id,
      name,
      email,
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

    const { email: newEmail, password, oldpassword: oldPassword } = req.body;

    const autor = await AutorRepository.findById(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não cadastrado.' });
    }

    if (newEmail && newEmail !== autor.email) {
      const autorWithSameEmailExists = await AutorRepository.findOne(
        { email: newEmail }
      );

      if (autorWithSameEmailExists)
        return res
          .status(400)
          .json({ error: 'Já existe uma Autor com este email.' });
    }

    if (oldPassword && !(await bcrypt.compare(oldPassword, autor.password_hash)))
      return res.status(401).json({ error: 'Senha não confere.' });
 
    // if (oldPassword && !(await autor.checkPassword(oldPassword)))
    //   return res.status(401).json({ error: 'Senha não confere.' });
 
    // const { id, name, email, is_root: isRoot, password_hash } = 
    //     await AutorRepository.update(req.params.id,req.body);
    var password_hash = '';
    if (password && oldPassword) {
      password_hash = await bcrypt.hash(password, 8);
    }
    const { 
      id, 
      name, 
      email, 
      is_root: isRoot
    } = (password && oldPassword) 
        ? await AutorRepository.update(
            req.params.id,
            {...req.body, password_hash}
        )
        : await AutorRepository.update(req.params.id,req.body);

    return res.json({
      id,
      name,
      email,
      isRoot
    });
  }

  async delete(req, res) {
    // const autor = await Autor.findByPk(req.params.id);
    const autor = await AutorRepository.findById(req.params.id);
    if (!autor) {
      return res.status(400).json({ error: 'Autor não existe.' });
    }

    // const item = await Item.findOne({
    const item = await ItemRepository.findOne({ autor_id: req.params.id });
    if (item) {
      return res.status(400).json({
        error: 'Existe pelo menos um item de blog ligado a este autor.'
      });
    }

    const { id, name, email } = autor;
    // await autor.destroy();
    await AutorRepository.delete(req.params.id);

    return res.json({
      id,
      name,
      email
    });
  }
}

module.exports = new AutorController();
