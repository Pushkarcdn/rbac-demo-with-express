import FinanceRecordsController from "../controllers/finance_records/finance_records.controller.js";

export default (router) => {
  router
    .route("/finance-records")
    .post(FinanceRecordsController.createFinanceRecord);

  router
    .route("/finance-records")
    .get(FinanceRecordsController.getFinanceRecords);

  router
    .route("/finance-records/:id")
    .get(FinanceRecordsController.getFinanceRecordById);

  router
    .route("/finance-records/:id")
    .put(FinanceRecordsController.updateFinanceRecord);

  router
    .route("/finance-records/:id")
    .delete(FinanceRecordsController.deleteFinanceRecord);
};
