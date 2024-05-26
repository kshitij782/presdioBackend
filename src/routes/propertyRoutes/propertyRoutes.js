import {
  getAllProperty,
  likeTheProperty,
} from "../../controllers/PropertyController/propertyContoller";
import { verifyJwt } from "../../middleware/verifyJwt";
export const propertyRoutes = (app) => {
  app.get("/api/v1/property", verifyJwt, getAllProperty);
  app.post("/api/v1/property/like/:id", verifyJwt, likeTheProperty);
};
