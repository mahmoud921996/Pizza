import dbConnect from "../../../utils/mongo";
import Product from "../../../models/product";
export default async function handler(req, res) {
  const { method, cookies } = req;
  const token = cookies.token;
  await dbConnect();
  if (method === "GET") {
    try {
      const Products = await Product.find();
      res.status(201).json(Products);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    if (!token || token !== process.env.TOKEN) {
      return res.status(401).json("Not Authenticated!!");
    }
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
