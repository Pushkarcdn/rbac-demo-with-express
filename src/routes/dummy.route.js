import models from "../models/index.js";
import successResponse from "../utils/responses/successResponse.js";
import { hashPassword } from "../lib/bcrypt.js";

const { finance_records, roles, permissions, role_permissions, users } = models;

export default (router) => {
  router.get("/set-dummy-data", setDummyData);
};

const setDummyData = async (req, res, next) => {
  try {
    // Inserting roles
    await roles.insertMany([
      {
        _id: "68709cfeeb2e6c052bfd1579",
        role_name: "Employee",
      },
      {
        _id: "68709d063a2de9d12a67b138",
        role_name: "Admin",
      },
      {
        _id: "68709d09028408a5e7985d31",
        role_name: "Manager",
      },
    ]);

    // Inserting permissions
    await permissions.insertMany([
      {
        _id: "68709d2a028408a5e7985d32",
        permission_name: "view_finance_record",
      },
      {
        _id: "68709d2a028408a5e7985d33",
        permission_name: "create_finance_record",
      },
      {
        _id: "68709d2a028408a5e7985d34",
        permission_name: "edit_finance_record",
      },
      {
        _id: "68709d2a028408a5e7985d35",
        permission_name: "delete_finance_record",
      },
    ]);

    // Inserting role_permissions associations
    await role_permissions.insertMany([
      // Employee has create permission
      {
        role_id: "68709cfeeb2e6c052bfd1579",
        permission_id: "68709d2a028408a5e7985d33",
      },
      // Manager has edit permission
      {
        role_id: "68709d09028408a5e7985d31",
        permission_id: "68709d2a028408a5e7985d34",
      },
      // Admin has delete permission
      {
        role_id: "68709d063a2de9d12a67b138",
        permission_id: "68709d2a028408a5e7985d35",
      },

      // everyone has view permission
      {
        role_id: "68709cfeeb2e6c052bfd1579",
        permission_id: "68709d2a028408a5e7985d32",
      },
      {
        role_id: "68709d09028408a5e7985d31",
        permission_id: "68709d2a028408a5e7985d32",
      },
      {
        role_id: "68709d063a2de9d12a67b138",
        permission_id: "68709d2a028408a5e7985d32",
      },
    ]);

    // Inserting users
    await users.insertMany([
      {
        username: "admin1",
        full_name: "Admin 1",
        email: "admin@gmail.com",
        password_hash: await hashPassword("Admin@123"),
        role_id: "68709d063a2de9d12a67b138", // Admin role
      },
      {
        username: "manager1",
        full_name: "Manager 1",
        email: "manager@gmail.com",
        password_hash: await hashPassword("Manager@123"),
        role_id: "68709d09028408a5e7985d31", // Manager role
      },
      {
        username: "employee1",
        full_name: "Employee 1",
        email: "employee@gmail.com",
        password_hash: await hashPassword("Employee@123"),
        role_id: "68709cfeeb2e6c052bfd1579", // Employee role
      },
    ]);

    // Insert finance records
    await finance_records.insertMany([
      {
        date: new Date("2023-01-15"),
        amount: 1500.0,
        category: "Salary",
        payment_method: "Bank Transfer",
        payment_status: "completed",
      },
      {
        date: new Date("2023-01-20"),
        amount: -120.5,
        category: "Office Supplies",
        payment_method: "Credit Card",
        payment_status: "completed",
      },
      {
        date: new Date("2023-02-01"),
        amount: -450.0,
        category: "Rent",
        payment_method: "Bank Transfer",
        payment_status: "completed",
      },
      {
        date: new Date("2023-02-10"),
        amount: 2000.0,
        category: "Client Payment",
        payment_method: "Check",
        payment_status: "completed",
      },
      {
        date: new Date("2023-02-15"),
        amount: -85.25,
        category: "Utilities",
        payment_method: "Direct Debit",
        payment_status: "completed",
      },
      {
        date: new Date(),
        amount: 1200.0,
        category: "Contract Work",
        payment_method: "PayPal",
        payment_status: "pending",
      },
    ]);

    return successResponse(res, {}, "Dummy data inserted successfully");
  } catch (error) {
    next(error);
  }
};
