import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import { authorizeUser } from "../../middlewares/auth.middleware.js";

const { finance_records } = models;

const getFinanceRecords = async (req, res, next) => {
  try {
    await authorizeUser(req.user, "view_finance_records");
    const financeRecords = await finance_records.find();
    return successResponse(
      res,
      financeRecords,
      "Finance records fetched successfully!",
      "finance_records",
    );
  } catch (error) {
    next(error);
  }
};

const createFinanceRecord = async (req, res, next) => {
  try {
    const financeRecord = await finance_records.create(req.body);
    return successResponse(
      res,
      financeRecord,
      "Finance record created successfully!",
      "finance_records",
    );
  } catch (error) {
    next(error);
  }
};

const getFinanceRecordById = async (req, res, next) => {
  try {
    const financeRecord = await finance_records.findById(req.params.id);
    return successResponse(
      res,
      financeRecord,
      "Finance record fetched successfully!",
      "finance_records",
    );
  } catch (error) {
    next(error);
  }
};

const updateFinanceRecord = async (req, res, next) => {
  try {
    const financeRecord = await finance_records.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    return successResponse(
      res,
      financeRecord,
      "Finance record updated successfully!",
      "finance_records",
    );
  } catch (error) {
    next(error);
  }
};

const deleteFinanceRecord = async (req, res, next) => {
  try {
    await finance_records.findByIdAndDelete(req.params.id);
    return successResponse(
      res,
      {},
      "Finance record deleted successfully!",
      "finance_records",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getFinanceRecords,
  createFinanceRecord,
  getFinanceRecordById,
  updateFinanceRecord,
  deleteFinanceRecord,
};
