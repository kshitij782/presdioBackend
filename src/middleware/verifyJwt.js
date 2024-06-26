import jwt from "jsonwebtoken";
import buyerModel from "../models/BuyerModel/buyerModel";
import sellerModel from "../models/SellerModel/sellerModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../helpers/api-response";
import dotenv from "dotenv";
dotenv.config();
export async function verifyJwt(request, response, next) {
  try {
    const token =
      request.cookies?.accessToken ||
      request.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return badRequest(request, response, "", "UnAuthorize Token");
    }
    const decodedInformation = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    // const user = await buyerModel
    //   .findById(decodedInformation?._id)
    //   .select("-password -refreshToken");
    // if (!user) {
    //   //discuss about frontend
    //   return badRequest(request, response, "", "Invalid AccessToken");
    // }
    console.log(decodedInformation);
    request.user = decodedInformation;
    next();
  } catch (error) {
    return internalServerError(
      request,
      response,
      error,
      "Error While Verify Jwt"
    );
  }
}
