import sellerModel from "../../models/SellerModel/sellerModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../../helpers/api-response";

const generateAccessTokenAndRefreshToken = async (sellerId) => {
  try {
    const user = await sellerModel.findById(sellerId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Some thing went wrong while generating access token and refreshToken"
    );
  }
};

export async function sellerSignUp(request, response, next) {
  const { username, email, password } = request.body;
  try {
    const data = {
      username: username,
      email: email,
      password: password,
    };
    const newSeller = await sellerModel.create(data);
    return success(request, response, "", "Seller Register Successfully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}

export async function sellerLogin(request, response, next) {
  try {
    const { email, password } = request.body;

    const seller = await sellerModel.findOne({ email: email });
    if (!seller) {
      return badRequest(request, response, "Invalid Email or Password");
    }
    return success(request, response, "Seller Login Successfully", sellerModel);
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}
