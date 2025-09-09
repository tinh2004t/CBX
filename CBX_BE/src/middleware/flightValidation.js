const Joi = require('joi');

const flightDetailSchema = Joi.object({
  time: Joi.string().required().messages({
    'string.empty': 'Thời gian bay không được để trống',
    'any.required': 'Thời gian bay là bắt buộc'
  }),
  duration: Joi.string().required().messages({
    'string.empty': 'Thời gian bay không được để trống',
    'any.required': 'Thời gian bay là bắt buộc'
  }),
  flightCode: Joi.string().required().messages({
    'string.empty': 'Mã chuyến bay không được để trống',
    'any.required': 'Mã chuyến bay là bắt buộc'
  }),
  aircraft: Joi.string().required().messages({
    'string.empty': 'Loại máy bay không được để trống',
    'any.required': 'Loại máy bay là bắt buộc'
  }),
  status: Joi.string().valid('Còn chỗ', 'Sắp hết', 'Hết chỗ').default('Còn chỗ')
});

const flightSchema = Joi.object({
  departure: Joi.string().required().messages({
    'string.empty': 'Điểm khởi hành không được để trống',
    'any.required': 'Điểm khởi hành là bắt buộc'
  }),
  destination: Joi.string().required().messages({
    'string.empty': 'Điểm đến không được để trống',
    'any.required': 'Điểm đến là bắt buộc'
  }),
  airline: Joi.string().required().messages({
    'string.empty': 'Hãng hàng không không được để trống',
    'any.required': 'Hãng hàng không là bắt buộc'
  }),
  airlineLogo: Joi.string().uri().allow('').messages({
    'string.uri': 'Logo hãng hàng không phải là URL hợp lệ'
  }),
  date: Joi.string().required().messages({
    'string.empty': 'Ngày bay không được để trống',
    'any.required': 'Ngày bay là bắt buộc'
  }),
  price: Joi.string().required().messages({
    'string.empty': 'Giá vé không được để trống',
    'any.required': 'Giá vé là bắt buộc'
  }),
  flights: Joi.array().items(flightDetailSchema).min(1).required().messages({
    'array.min': 'Phải có ít nhất một chuyến bay',
    'any.required': 'Danh sách chuyến bay là bắt buộc'
  })
});

const flightUpdateSchema = flightSchema.fork(
  ['departure', 'destination', 'airline', 'date', 'price', 'flights'],
  (schema) => schema.optional()
);

const validateFlight = (data) => {
  return flightSchema.validate(data, { abortEarly: false });
};

const validateFlightUpdate = (data) => {
  return flightUpdateSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateFlight,
  validateFlightUpdate
};