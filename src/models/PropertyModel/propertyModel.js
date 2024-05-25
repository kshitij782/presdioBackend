import { Schema, model } from "mongoose";

const propertyModel = new Schema({
  propertyName: {
    type: string,
    required: [true, "property is required"],
  },
  price: {
    type: number,
    required: [true, "price is required"],
  },
  location: {
    type: string,
    required: [true, "location is required"],
  },
  pincode: {
    type: number,
    required: [true, "pincode is required"],
  },
  details: {
    type: string,
    required: [true, "details is required"],
  },
  image: {
    type: string,
    required: [true, "image is required"],
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  interestedBuyer: {
    type: [Schema.Types.ObjectId],
    ref: "Buyer",
  },
});

export default model("property", propertyModel);
