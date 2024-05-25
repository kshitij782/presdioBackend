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
      return badRequest(request, response, "Seller not Found");
    }
    const isPasswordValid = await seller.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return badRequest(request, response, "", "Password is invalid");
    }
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(seller._id);
    const loggedInUser = await sellerModel
      .findById(seller._id)
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
      "Internal Server Error"
    );
  }
}

export async function sellerLogout(request, response, next) {
  try {
    await sellerModel.findByIdAndUpdate(
      request.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return response
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "seller Logout SuccessFully" });
  } catch (error) {
    console.log(error.message);
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}
