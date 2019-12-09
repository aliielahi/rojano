const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateApplicationInput(data) {
  let errors = {};

  data.type = !isEmpty(data.type) ? data.type : '';
  data.details = !isEmpty(data.details) ? data.details : '';
  data.subject = !isEmpty(data.subject) ? data.subject : '';

  if (Validator.isEmpty(data.type)) {
    errors.type = 'نوع کلاس الزامی است.';
  }

  if (Validator.isEmpty(data.details)) {
    errors.details = 'توضیحات الزامی است.';
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = 'موضوع کلاس الزامی است.';
  }

  if( !(data.type == 'Public' || data.type == 'Semi-Private' || data.type == 'Tutor' || data.type == 'ProblemSolving') )
        errors.type = 'یکی از گزینه ها را انتخاب کنید.'

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
