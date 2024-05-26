import propertyModel from "../../models/PropertyModel/propertyModel";
import buyerModel from "../../models/BuyerModel/buyerModel";
import {
  success,
  internalServerError,
  badRequest,
} from "../../helpers/api-response";

export async function getAllProperty(request, response, next) {
  try {
    const loggedUser = request.user._id;
    const Buyer = await buyerModel.findById(loggedUser);
    if (!Buyer) {
      return badRequest(
        request,
        response,
        "Buyer not found",
        "Buyer not found"
      );
    }
    const property = await propertyModel
      .find()
      .populate({ path: "sellerId", select: "firstName lastName phone email" });
    return success(
      request,
      response,
      property,
      "All Property Fetch SuccessFully"
    );
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}

export async function likeTheProperty(request, response, next) {
  try {
    const { id } = request.params;
    const loggedUser = request.user._id;
    const user = await buyerModel.findById(loggedUser);
    if (!user) {
      return badRequest(
        request,
        response,
        "Unauthorized User",
        "Unauthorized User"
      );
    }
    const property = await propertyModel.findById(id);
    if (!property) {
      return badRequest(
        request,
        response,
        "Property not found",
        "Property not found"
      );
    }
    property.likeCount.push(user);
    await property.save();
    return success(request, response, "Like the property");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}

export async function unlikeTheProperty(request,response,next){
  try {
    const { id } = request.params;
    const loggedUser = request.user._id;
    const user = await buyerModel.findById(loggedUser);
    if (!user) {
      return badRequest(
        request,
        response,
        "Unauthorized User",
        "Unauthorized User"
      );
    }
    const property = await propertyModel.findById(id);
    if (!property) {
      return badRequest(
        request,
        response,
        "Property not found",
        "Property not found"
      );
    }
    // property.likeCount.pull(user);
    await property.save();
    return success(request, response, "Unlike the property");
  } catch (error) {
    return internalServerError(
      request,
      response,
      error.message,
      "Internal server error"
    );
  }
}