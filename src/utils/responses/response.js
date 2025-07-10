class SuccessResponse {
  constructor() {
    this.success = true;
    this.status = null;
    this.data = [];
    this.message = "";
    this.source = "";
  }
}

class ErrorResponse {
  constructor(status, message, source) {
    this.status = status;
    this.message = message;
    this.source = source;
  }
  success = false;
  status;
  message;
  source;
}

export { SuccessResponse, ErrorResponse };
