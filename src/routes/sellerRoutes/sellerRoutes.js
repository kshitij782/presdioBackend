import {
  sellerSignUp,
  sellerLogin,
  sellerLogout,
} from "../../controllers/SellerController/sellerContoller";
import { verifyJwtSeller } from "../../middleware/verifyJwt";
export async function sellerRoutes(app) {
  app.post("/api/v1/seller/signup", sellerSignUp);
  app.post("/api/v1/seller/login", sellerLogin);
  app.get("/api/v1/seller/logout", verifyJwtSeller, sellerLogout);
}
