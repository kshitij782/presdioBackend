import express, { json } from "express";
import { wrapRoutes } from "./routes/wrap-routes";
const app = express();

app.use(json());

const PORT = process.env.PORT || 3000;
wrapRoutes(app);

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
