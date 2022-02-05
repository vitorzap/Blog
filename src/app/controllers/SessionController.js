require('dotenv').config();
const Yup = require('yup');
const jwt = require('jsonwebtoken');
const Autor = require('../models/postgres/Autor');
const GetRedisClient = require('../../cache/redisClient');

var redisClient = GetRedisClient();

class SessionController {
  async login(req,res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation failed' });

    const { email, password } = req.body;

    const autor = await Autor.findOne({
      where: { email }
    });

    if (!autor)
      return res
        .status(401)
        .json({ error: 'Login failed' });

    if (!autor.checkPassword(password)) {
      return res
      .status(401)
      .json({ error: 'Login failed' });     
    }
   
    const { 
      id: loggedId,
      name: loggedName, 
      email: loggedEmail, 
      is_root: loggedIsRoot 
    } = autor;

    return res.json({
      loggedAutor: {
        name: loggedName,
        email: loggedEmail,
        is_root: loggedIsRoot
      },
      token: jwt.sign(
        { 
          loggedId,
          loggedIsRoot 
        },
        process.env.AUTH_SECRET,
        {
          expiresIn: process.env.AUTH_EXPIRES_IN
        }
      )
    });
  };

  async logout(req,res) {

    const headerAuthorization = req.headers.authorization;

    if (!headerAuthorization) {
      return res.status(401).json({ error: 'Token não informado' });
    }
  
    const [, token] = headerAuthorization.split(' ');
    const dtTime = new Date().getTime().toString();
 
    await redisClient.set(`tokenBlkL:${req.loggedId}:${dtTime}`, token, {
      EX: process.env.CACHE_EXPIRES_IN,
      NX: true
    });
    const value = await redisClient.get(`tokenBlkL:${req.loggedId}:${dtTime}`);
    
    return res.json({ token: token });

  };

}



module.exports = new SessionController();