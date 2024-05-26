import sellerModel from "../../models/SellerModel/sellerModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../../helpers/api-response";
import fs from "fs";
import propertyModel from "../../models/PropertyModel/propertyModel";
import { uploadImageToCloudinary } from "../../helpers/commonFunction";
const cloudinary = require("cloudinary").v2;

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
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
export async function sellerSignUp(request, response, next) {
  const { firstName, lastName, email, password, phone } = request.body;

  try {
    const result = await sellerModel.find({ email: email });
    if (result.length > 0) {
      return badRequest(request, response, "Email already exist");
    }

    const data = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
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

export async function sellerCreateProperty(request, response, next) {
  try {
    const {
      propertyName,
      price,
      location,
      pincode,
      details,
      bedrooms,
      bathrooms,
    } = request.body;
    const image = request.file.path;
    const loggedUser = request.user._id;
    const imageUrl = await cloudinary.uploader.upload(
      image,
      { folder: "samples" },
      (error, result) => {
        if (error) {
          throw new Error("Error while Uploading the image in cloudinary");
        } else {
          console.log("Image uploaded successfully:", result.url);
          fs.unlink(request.file.path, (err) => {
            if (error) {
              console.error("Error deleting file:", error);
            } else {
              console.log("File deleted successfully");
            }
          });
          return { result: result.url, message: "Upload SuccessFully !!!" };
        }
      }
    );
    const data = {
      propertyName: propertyName,
      price: price,
      location: location,
      pincode: pincode,
      details: details,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      image: imageUrl.url,
      sellerId: loggedUser,
      interestedBuyer: [],
    };
    const propertyCreate = await propertyModel.create(data);
    const seller = await sellerModel.findById(loggedUser);
    seller.sellerProperty.push(propertyCreate._id);
    await seller.save();
    return success(request, response, "", "Property Created Successfully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}

export async function sellerUpdateProperty(request, response, next) {
  const { propertyName, price, location, pincode, details } = request.body;
  const { id } = request.params;
  const image = request.file.path;
  const loggedUser = request.user._id;
  try {
    const sellerPropertyDetails = await propertyModel.findById(id);
    if (!sellerPropertyDetails) {
      return badRequest(request, response, "Property not found");
    }
    const updateDetails = await propertyModel.findByIdAndUpdate(id, {
      propertyName: propertyName,
      price: price,
      location: location,
      pincode: pincode,
      details: details,
      sellerId: loggedUser,
      interestedBuyer: [],
    });
    return success(request, response, "", "Property Updated Successfully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server Error"
    );
  }
}

export async function sellerDeleteProperty(request, response, next) {
  const { id } = request.params;
  try {
    return success(request, response, "", "Property Deleted Successfully");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server error"
    );
  }
}

export async function sellerViewAllProperty(request, response, next) {
  try {
    const loggedUser = request.user._id;

    const sellerProperty = await sellerModel
      .findById(loggedUser)
      .populate("sellerProperty")
      .select("-password -refreshToken");
    if (!sellerProperty) {
      return badRequest(request, response, "Seller Not Found");
    }
    return success(
      request,
      response,
      sellerProperty,
      "Your All Interested Buyers"
    );
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server error"
    );
  }
}

export async function sellerViewBuyerDetails(request, response, next) {
  try {
    const { id } = request.params;
    const loggedUser = request.user._id;
    const user = await sellerModel.findById(loggedUser);
    if (!user) {
      return badRequest(request, response, "User Not Found");
    }
    if (!user.sellerProperty.includes(id)) {
      return badRequest(request, response, "Property Not Found");
    }

    const buyerDetails = await propertyModel.findById(id).populate({
      path: "interestedBuyer",
      select: "firstName lastName email phone",
    });
    if (!buyerDetails) {
      return badRequest(request, response, "Buyer Not Found");
    }
    return success(request, response, buyerDetails, "Buyer Details");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal Server error"
    );
  }
}

export async function updateProfile(request, response, next) {
  try {
    const image = request.file.path;
    const loggedUser = request.user._id;
    const user = await sellerModel.findById(loggedUser);
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
