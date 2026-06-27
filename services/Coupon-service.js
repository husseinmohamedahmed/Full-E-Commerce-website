const Coupon = require("../models/Coupon-Model");
const asynchandler = require("express-async-handler");
const factory = require("./handlersFactory.js");
const customError = require("../utils/customer-error.js");



const createCoupon = factory.create(Coupon);

const getAllCoupons = factory.getAll(Coupon);

const getCoupon = factory.getOne(Coupon);

const updateCoupon = factory.updateOne(Coupon);

const deleteCoupon = factory.deleteOne(Coupon);

module.exports = {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon
};
