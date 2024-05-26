import buyerModel from "../../models/BuyerModel/buyerModel";
import sellerModel from "../../models/SellerModel/sellerModel";
import propertyModel from "../../models/PropertyModel/propertyModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../../helpers/api-response";
import { uploadImageToCloudinary } from "../../helpers/commonFunction";

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
    const loggedUser = request.user._id;
    await buyerModel.findByIdAndUpdate(loggedUser, {
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

export async function buyerInterestedProperty(request, response, next) {
  try {
    const { id } = request.params;
    const loggedUser = request.user._id;
    const buyer = await buyerModel.findById(loggedUser);
    if (!buyer) {
      return badRequest(request, response, "Buyer not found");
    }
    buyer.interestedProperty.push(id);
    const property = await propertyModel.findById(id);
    if (!property) {
      return badRequest(request, response, "Property not found");
    }
    property.interestedBuyer.push(loggedUser);
    await buyer.save();
    await property.save();
    return success(request, response, "Property saved SuccessFully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}

export async function buyerViewInterestedProperty(request, response, next) {
  try {
    const loggedUser = request.user._id;
    const buyer = await buyerModel
      .findOne({ _id: loggedUser })
      .populate("interestedProperty")
      .select("-password");
    if (!buyer) {
      return badRequest(request, response, "Buyer not found");
    }
    return success(request, response, buyer, "All Property Fetch SuccessFully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}
export async function updateProfile(request, response, next) {
  try {
    const image = request.file.path;
    const loggedUser = request.user._id;
    const user = await buyerModel.findById(loggedUser);
    if (!user) {
      return badRequest(request, response, "User Not Found");
    }
    const imageUrl = await uploadImageToCloudinary(image);
    user.profileImage = imageUrl;
    await user.save();
    return success(request, response, "", "Profile Updated Successfully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server error"
    );
  }
}
