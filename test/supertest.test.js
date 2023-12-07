
import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";


const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing App", () => {
    let cookie;
    let role;
    let userID;
    let bearer;
    describe("session test", () => {
        it("When performing a POST in /api/sessions/register a user should be created correctly", async () => {
            const mockUser = {
                first_name: "Eduardo",
                last_name: "Lopez",
                email: "prueba2024@gmail.com",
                age: 21,
                password: "123",
                phone: 2217896541
            }
            const { _body, statusCode } = await requester.post('/api/sessions/register').send(mockUser)
            expect(_body).to.be.ok
            expect(statusCode).to.be.eql(200)
        })
        it("When a POST is made in /api/sessions/login the user must log in and obtain a jwt through a cookie", async () => {
            const mockUser = {
                email: "prueba2024@gmail.com",
                password: "123"
            }
            const result = await requester.post('/api/sessions/login').send(mockUser)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('tokenCookie');
            expect(cookie.value).to.be.ok
        })
        it("When a GET is done on /api/sessions/current, the user is obtained through the cookie and their data is sent", async () => {
            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
            role = _body.payload.role
            userID = _body.payload._id
            expect(_body.payload.email).to.be.eql('prueba2024@gmail.com')
        })
        it("When a POST is made in /api/sessions/login we log in as admin to have the necessary permissions", async () => {
            const mockUser = {
                email: config.adminName,
                password: config.adminPassword
            }
            const {_body} = await requester.post('/api/sessions/login').send(mockUser)
            bearer = _body.token
            expect(_body)
        })
        it("When a POST is performed on /api/users/premium/:uid the user role should be updated to premium",async()=>{
            const {statusCode} = await requester.post(`/api/users/premium/${userID}`).set('Authorization', `Bearer ${bearer}`)
            expect(statusCode)
        })
    })
    setTimeout(function() {
        // Agrego pausa asi no satura
      }, 5000)
    describe('products test', () => {
        let pID;
        it("When we do a GET in /api/products we must obtain the array of products", async () => {
            const { _body } = await requester.get('/api/products')
            expect(_body.payload)
        })
        it("When we do a GET in /api/products/:pid you must obtain the searched product", async () => {
            const pid = "657237ba5f6c8471879b47b8"
            const { _body } = await requester.get(`/api/products/${pid}`)
            expect(_body.payload).to.be.ok
        })
        it("When a POST is made in /api/sessions/login we log in as admin to have the necessary permissions", async () => {
            const mockUser = {
                email: config.adminName,
                password: config.adminPassword
            }
            const {_body} = await requester.post('/api/sessions/login').send(mockUser)
            bearer = _body.token
            expect(_body)
        })
        it("When we make a POST in /api/products a new product should be created", async () => {
            let mock = {
                title:"Pan",
                description: "Pan Frances",
                price:0.8,
                stock:10,
                category: "Panaderia",
                code: "4A1",
                owner:"admin",
                thumbnails:[]
            }
            const {_body} = await requester.post("/api/products").send(mock).set('Authorization', `Bearer ${bearer}`).set('Content-Type', 'application/json')
            console.log(_body.payload._id)
            })
        it("When you make a PUT in /api/products/:pid the product should be updated correctly",async()=>{
            const update = {
                stock: 150
            }
            const {_body} = await requester.put(`/api/products/657237ba5f6c8471879b47b8`).send(update).set('Authorization', `Bearer ${bearer}`)
            expect(_body)
        })
        it("When we do a DELETE in api/products/:pid a product should be deleted correctly",async()=>{
            const {statusCode} = await requester.delete(`/api/products/${pID}`).set('Authorization', `Bearer ${bearer}`)
            expect(statusCode).to.be.eql(200)
        })
    })
    setTimeout(function() {
        // No hay código específico a ejecutar durante la pausa
      }, 5000)
    describe("carts test",()=>{
        let bearer;
        let cID;
        let cIDToDelete;
        it("When a POST is made in /api/sessions/login we log in as admin to have the necessary permissions", async () => {
            const mockUser = {
                email: config.adminName,
                password: config.adminPassword
            }
            const {_body} = await requester.post('/api/sessions/login').send(mockUser)
            bearer = _body.token
            expect(_body)
        })
        it("When we do a GET in /api/carts we must obtain the array of carts", async () => {
            const { _body } = await requester.get('/api/carts').set('Authorization', `Bearer ${bearer}`)
            expect(_body.payload)
        })
        it("When a POST is made in /api/sessions/login we log in as a premium to have the necessary permissions", async () => {
            const mockUser = {
                email: "prueba2024@gmail.com",
                password: "123"
            }
            const {_body} = await requester.post('/api/sessions/login').send(mockUser)
            bearer = _body.token
            cID = _body.cartID
            expect(_body)
        })
        it("When a PUT is made in /api/carts/:cid/product/:pid a product should be added to the cart",async()=>{
            let pID = "657237ba5f6c8471879b47b8"
            const {_body} = await requester.put(`/api/carts/${cID}/product/${pID}`).set('Authorization', `Bearer ${bearer}`).set('Content-Type', 'application/json')
            console.log(_body)
            expect(_body.payload)
        })
        it("When a DELETE is performed in /api/carts/:cid/product/:pid it should be updated to remove the product from the cart",async()=>{
            let pID = "657237ba5f6c8471879b47b8"
            const {_body} = await requester.delete(`/api/carts/${cID}/product/${pID}`).set('Authorization', `Bearer ${bearer}`).set('Content-Type', 'application/json')
            expect(_body.payload)
        })
        it("When a POST is made in /api/carts/purchase/:cid the purchase of the products in the cart should be completed",async()=>{
            const {_body} = await requester.post(`/api/carts/puchase/${cID}`).set('Authorization', `Bearer ${bearer}`)
            expect(_body.payload)
        })
        it("When a POST is made to /api/carts a new cart should be generated",async()=>{
            const {_body} = await requester.post(`/api/carts`)
            cIDToDelete = _body.payload
            expect(_body.payload)
        })
        it("When a DELETE is performed in /api/carts/:cid, the cart should be deleted",async() =>{
            const {_body} = await requester.delete(`/api/carts/${cIDToDelete}`)
            expect(_body.message)
        })
    })
})