const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const app = require('../app');
require('dotenv').config();


describe('Testes de login', () => {
    describe("post /login", () => {
        it("Deve obter o token de autenticacao", async (done) => {
            await chai.request('app')
                .post("/login")
                .send({
                    "email": "vitor@hotmail.com",
                    "password": "123456"
                })
                .end((err,res) => {
                    res.shoud.have.status(200);
                    res.body.shoud.be.a('object');
                    done();
                })
        })
    })
    // this.beforeAll(() => {})
})
describe('Testes de autor', () => {
    describe("get /autor", () => {
        it("Deve obter todos registros de autor", (done) => {
            chai.request(app)
                .get("/autor")
                .end((err,res) => {
                    res.shoud.have.status(200);
                    res.body.shoud.be.a('object');
                    done();
                })
        })
    })
    // this.beforeAll(() => {})
})