import {
  sellerSignUp,
  sellerLogin,
  sellerLogout,
  sellerCreateProperty,
  sellerUpdateProperty,
  sellerViewAllProperty,
  sellerViewBuyerDetails,
  updateProfile,
} from "../../controllers/SellerController/sellerContoller";
import { refreshToken } from "../../controllers/SellerController/refreshToken/refreshToken";
import multer from "multer";
import { upload } from "../../middleware/multer.middleware";
import { verifyJwt } from "../../middleware/verifyJwt";
export async function sellerRoutes(app) {
  app.post("/api/v1/seller/signup", sellerSignUp);
  app.post("/api/v1/seller/login", sellerLogin);
  app.get("/api/v1/seller/logout", verifyJwt, sellerLogout);
  app.post(
    "/api/v1/seller/createproperty",
    verifyJwt,
    upload.single("image"),
    sellerCreateProperty
  );
  app.post(
    "api/v1/seller/updateproperty/:id",
    verifyJwt,
    upload.single("image"),
    sellerUpdateProperty
  );
  app.post(
    "/api/v1/seller/deleteproperty/:id",
    verifyJwt,
    sellerUpdateProperty
  );
  app.get("/api/v1/seller/viewallproperty", verifyJwt, sellerViewAllProperty);
  app.get(
    "/api/v1/seller/viewbuyerdetails/:id",
    verifyJwt,
    sellerViewBuyerDetails
  );
  app.post(
    "/api/v1/seller/updateProfile",
    verifyJwt,
    upload.single("image"),
    updateProfile
  );
}
