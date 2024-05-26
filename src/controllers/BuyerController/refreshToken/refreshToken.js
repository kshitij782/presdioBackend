import {
  success,
  internalServerError,
  badRequest,
} from "../../../helpers/api-response";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import buyerModel from "../../../models/BuyerModel/buyerModel";
dotenv.config();
export async function refreshToken(request, response, next) {
  try {
    const incomingRefreshToken =
      request.cookies.refreshToken || request.body.refreshToken;
    if (!incomingRefreshToken) {
      return badRequest(request, response, "UnAuthorized Token");
    }
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await buyerModel.findById(decodedRefreshToken._id);
    if (!user) {
      return badRequest(request, response, "Invalid Refresh Token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      return badRequest(request, response, "Refresh Token is Expired or used");
    }
    const option = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    return response
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json({
        accessToken,
        newRefreshToken,
      });
  } catch (error) {
    return internalServerError(request, response, error.message);
  }
}
const generateAccessTokenAndRefreshToken = async (sellerId) => {
  try {
    const user = await buyerModel.findById(sellerId);
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
