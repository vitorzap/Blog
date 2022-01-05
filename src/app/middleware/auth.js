require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const GetRedisClient = require('../../database/redisClient');
var redisClient = GetRedisClient();

async function auth(req, res, next) {

  const headerAuthorization = req.headers.authorization;

  if (!headerAuthorization) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const [, token] = headerAuthorization.split(' ');
  
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.AUTH_SECRET);
    req.loggedId = decoded.loggedId;
    req.loggedIsRoot = decoded.loggedIsRoot
    // Inicio - Verificando se o token esta na black list -------------------------------
    const blackListKeys = await redisClient.keys(`tokenBlkL:${req.loggedId}:*`); 
    for (const key of blackListKeys) {
      var blkListToken = await redisClient.get(key);
      if (token==blkListToken) {
        return res.status(401).json({ error: 'Não autorizado' });
      }
    };
    // Fim - Verificando se o token esta na black list -------------------------------
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
};

module.exports = { auth };