import {
  buyerSignUp,
  buyerLogin,
  buyerLogout,
  buyerInterestedProperty,
  buyerViewInterestedProperty,
  updateProfile,
} from "../../controllers/BuyerController/buyerController";
import { verifyJwt } from "../../middleware/verifyJwt";
export async function buyerRoutes(app) {
  app.post("/api/v1/buyer/signup", buyerSignUp);
  app.post("/api/v1/buyer/login", buyerLogin);
  app.get("/api/v1/buyer/logout", verifyJwt, buyerLogout);
  app.post(
    "/api/v1/buyer/interestedProperty/:id",
    verifyJwt,
    buyerInterestedProperty
  );
  app.get(
    "/api/v1/buyer/viewInterestedProperty",
    verifyJwt,
    buyerViewInterestedProperty
  );
  app.post("/api/v1/buyer/updateProfile", verifyJwt, updateProfile);
}
