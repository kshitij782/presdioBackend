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
