import {sellerSignUp,sellerLogin} from '../../controllers/SellerController/sellerContoller';

export async function sellerRoutes(app){
    app.post('/api/v1/seller/signup',sellerSignUp);
    app.post("/api/v1/seller/login",sellerLogin);
    
}