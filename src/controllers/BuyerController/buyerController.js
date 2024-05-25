import buyerModel from "../../models/BuyerModel/buyerModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../../helpers/api-response";

const generateAccessTokenAndRefreshToken = async (buyerId) => {
  try {
    const user = await buyerModel.findById(buyerId);
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

export async function buyerSignUp(request, response, next) {
  const { firstName, lastName, email, password, phone } = request.body;

  if (!email || !password || !firstName || !lastName || !phone) {
    return badRequest(request, response, "", "All fields are required");
  }
  try {
    const data = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      password: password,
    };
    const buyer = await buyerModel.create(data);
    return success(request, response, "", "Buyer Register Successfully");
  } catch (error) {
    console.log(error);
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}

export async function buyerLogin(request, response, next) {
  try {
    const { email, password } = request.body;
    const buyer = await buyerModel.findOne({ email: email });
    if (!buyer) {
      return badRequest(request, response, "Buyer not Found");
    }
    const isPasswordValid = await buyer.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return badRequest(request, response, "", "Password is invalid");
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(buyer._id);
    const loggedInUser = await buyerModel
      .findById(buyer._id)
      .select("-password");
    const options = {
      httpOnly: true,
      secure: true,
    };
    return response
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}

export async function buyerLogout(request, response, next) {
  try {
    await buyerModel.findByIdAndUpdate(request.user._id, {
      $set: {
        refreshToken: undefined,
      },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return response
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Buyer Logout SuccessFully" });
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}
