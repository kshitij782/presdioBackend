import {
  buyerSignUp,
  buyerLogin,
  buyerLogout,
} from "../../controllers/BuyerController/buyerController";
import { verifyJwtBuyer } from "../../middleware/verifyJwt";
export async function buyerRoutes(app) {
  app.post("/api/v1/buyer/signup", buyerSignUp);
  app.post("/api/v1/buyer/login", buyerLogin);
  app.get("/api/v1/buyer/logout", verifyJwtBuyer, buyerLogout);
}
