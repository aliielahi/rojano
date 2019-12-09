const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'این ایمیل صحیح نیست';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'ایمیل الزامی است.';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'رمز عبور الزامی است.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
