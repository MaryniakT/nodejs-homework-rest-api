const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

const { login } = require("./auth");

const { DB_HOST, PORT } = process.env;

beforeEach(async () => {
  await mongoose.connect(DB_HOST);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("test login", () => {

test("user must be logged in", async () => {
const res = await request(app).post("/api/users/login").send({
    password: "123456",
    email: "test@gmail.com",
    });

expect(res.statusCode).toBe(200);
  });

test("should return a token", async () => {
    const res = await request(app).post("/api/users/login").send({
      password: "123456",
      email: "test@gmail.com",
    });
    const { token } = res.body;

 expect(token).toBeTruthy();
  });

test("should return a user object with email address and subscription as a string", async () => {
const res = await request(app).post("/api/users/login").send({
    password: "123456",
    email: "test@gmail.com",
    });
    const { user } = res.body;

expect(typeof user.email).toBe("string");

expect(typeof user.subscription).toBe("string");
  });
});