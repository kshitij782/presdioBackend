export const success = (request, response, options) => {
  response.status(200).json({
    data: {
      ...options,
    },
    message: "success",
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
