import { model, Schema } from "mongoose";
import { ProductType } from "../interfaces/product";

const productSchema = new Schema({

});

export const Teams = model<ProductType>("Products", productSchema);
