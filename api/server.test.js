// Write your tests here
const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

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
      .expect(200);

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

  it("should return an error if the username is already taken", async () => {
    const response = await request(server)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "testpassword" })
      .expect(400);

    expect(response.body).toBe("username taken");
  });
});

describe("[POST] /login", () => {
  it("should return an error if username and password are missing", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "", password: "" })
      .expect(400);

    expect(response.body).toBe("username and password required");
  });

  it("should return an error for invalid credentials", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ username: "nonexistent", password: "wrongpassword" })
      .expect(400);

    expect(response.body).toBe("invalid credentials");
  });
});
