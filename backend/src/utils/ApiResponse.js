/**
 * Standardized API Success Response
 */
class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination !== null) this.pagination = pagination;
  }

  /**
   * Send a success response
   * @param {Response} res - Express response object
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   * @param {object|null} pagination - { page, limit, total, pages }
   */
  static send(res, statusCode, message, data = null, pagination = null) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, data, pagination));
  }

  static ok(res, message, data = null) {
    return ApiResponse.send(res, 200, message, data);
  }

  static created(res, message, data = null) {
    return ApiResponse.send(res, 201, message, data);
  }

  static paginated(res, message, data, page, limit, total) {
    const pages = Math.ceil(total / limit);
    const pagination = { page, limit, total, pages };
    return ApiResponse.send(res, 200, message, data, pagination);
  }
}

module.exports = ApiResponse;
