// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../api/secrets/index");

test("sanity", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe("server.js", () => {
  it("should set testing envirement", () => {
    expect(process.env.NODE_ENV).toBe("testing");
  });
});

describe("[POST] /register", () => {
  it("should register a new user successfully", async () => {
    const response = await request(server)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "testpassword" })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("password");
  });

  it("should return an error if username or password is missing", async () => {
    const response = await request(server)
      .post("/api/auth/register")
      .send({ username: "", password: "testpassword" })
      .expect(400);

    expect(response.body).toBe("username and password required");
  });
});

describe("[GET] jokes", () => {
  it("should return 'token required' on missing token", async () => {
    const response = await request(server)
      .get("/api/jokes")
      .send({ token: "invalid token" })
      .expect(401);

    expect(response.body).toBe("token required");
  });
  it("should return 'token invalid' on invalid or expired token", async () => {
    const response = await request(server)
      .get("/api/jokes")
      .set("Authorization", "Bearer invalidToken")
      .expect(401);

    expect(response.body).toEqual("token invalid");
  });
  // it("responds with the jokes on valid token", async () => {
  //   const newUser = { id: 1, username: "testuser" };
  //   const token = jwt.sign(newUser, JWT_SECRET);

  //   const response = await request(server)
  //     .get("/api/jokes")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.statusCode).toBe(200);
  // });
});

describe("[POST] /login", () => {
  it("should return an error if username and password are missing", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({})
      .expect(400);

    expect(response.body).toEqual("username and password required");
  });

  it("should return an error for invalid credentials", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "nonexistent", password: "wrongpassword" })
      .expect(401);

    expect(response.body).toEqual("invalid credentials");
  });
});
