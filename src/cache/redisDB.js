const redis = require('redis');

class RedisDatabase {
  constructor() {
    this.init();
  }

  async init() {
    console.log('Conectando a database REDIS');
    console.log(process.env.REDIS_URL);

    this.client = redis.createClient(process.env.REDIS_UR);
  
    this.client.on('connect', () => { 
      console.log('Conectado ao database REDIS com sucesso !!!')
    });
    this.client.on('error', (err) => console.log('Erro de conexão ao Redis', err));
  
    await this.client.connect();

  }
}

module.exports = RedisDatabase;
