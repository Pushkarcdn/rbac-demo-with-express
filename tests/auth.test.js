import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import mongoose from "mongoose";
import app from "../app.js"; // Make sure your app exports default

import dotenv from "dotenv";
dotenv.config({
  path: `.env.local`,
});

describe("Auth API endpoints", () => {
  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "testpassword123",
    full_name: "Test User", // Added required field
  };

  beforeAll(async () => {
    // MongoDB connection is handled by jest.setup.js

    // Create a default role for testing
    const Roles = mongoose.model("Roles");
    try {
      // Check if the role already exists
      const existingRole = await Roles.findOne({ role_name: "user" });
      if (!existingRole) {
        // Create a default role
        const defaultRole = new Roles({ role_name: "user" });
        const role = await defaultRole.save();
        testUser.role_id = role._id;
      } else {
        testUser.role_id = existingRole._id;
      }
    } catch (error) {
      console.error("Error creating default role:", error);
    }
  }, 15000);

  beforeEach(async () => {
    // Clean up users collection before each test
    await mongoose.connection.collection("users").deleteMany({});
  });

  afterAll(async () => {
    // Cleanup is handled by jest.setup.js
  }, 15000);

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      // expect(response.body.data).toHaveProperty("_id");
      // expect(response.body.data.username).toBe(testUser.username);
      expect(response.body.success).toBe(true);
    }, 10000);
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      await request(app).post("/api/auth/register").send(testUser);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.success).toBe(true);
    }, 10000);
  });
});
