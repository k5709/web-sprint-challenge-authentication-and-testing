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
