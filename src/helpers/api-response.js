export const success = (request, response, options, message) => {
  response.status(200).json({
    data: {
      options,
    },
    message: message,
    error: false,
    success: true,
  });
};

export const internalServerError = (request, response, err, message) => {
  response.status(500).json({
    err,
    message,
    error: true,
    success: false,
  });
};
export const badRequest = (request, response, err, message) => {
  response.status(400).json({
    err,
    message,
    error: true,
    success: false,
  });
};
