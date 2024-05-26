import { buyerRoutes } from "./buyerRoutes/buyerRoutes";
import { healthRouter } from "./health";
import { propertyRoutes } from "./propertyRoutes/propertyRoutes";
import { sellerRoutes } from "./sellerRoutes/sellerRoutes";

export const wrapRoutes = (app) => {
  healthRouter(app);
  sellerRoutes(app);
  buyerRoutes(app);
  propertyRoutes(app);
};
