const request = require("supertest");
const app = require("../index");
const client = require("../index").client;


require("dotenv").config();

describe("Orders",()=>{

    it("api to return all orders for a seller to fail",async()=>{
        const res = await request(app).get("/order-items").set('Authorization', '');
        expect(res.statusCode).toBe(401);
    });

    it("api to delete order for a seller to fail",async()=>{
        const res = await request(app).delete("/order-items/6d953888a914b67350d5bc4d48f2acab").set('Authorization', '');
        expect(res.statusCode).toBe(401);
    });
});



describe("Users",()=>{

    it("api to update account for a seller to fail",async()=>{
        const res = await request(app).patch("/account").set('Authorization', '');
        expect(res.statusCode).toBe(401);
    });
});