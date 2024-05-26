import { Schema, model } from "mongoose";

const propertyModel = new Schema({
  propertyName: {
    type: String,
    required: [true, "property is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  pincode: {
    type: Number,
    required: [true, "pincode is required"],
  },
  details: {
    type: String,
    required: [true, "details is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  bathrooms: {
    type: Number,
    required: [true, "bathrooms is required"],
  },
  bedrooms: {
    type: Number,
    required: [true, "bedrooms is required"],
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "seller",
  },
  interestedBuyer: {
    type: [Schema.Types.ObjectId],
    ref: "buyer",
  },
  likeCount: {
    type: [Schema.Types.ObjectId],
    ref: "buyer",
  },
});

export default model("property", propertyModel);
