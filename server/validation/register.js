const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';
    data.state = !isEmpty(data.state) ? data.state : '';
    data.grade = !isEmpty(data.grade) ? data.grade : '';
    data.field = !isEmpty(data.field) ? data.field : '';
    data.school = !isEmpty(data.school) ? data.school : '';
    data.homeNumber = !isEmpty(data.homeNumber) ? data.homeNumber : '';

    if (!Validator.isLength(data.name, { min: 3, max: 30 })) {
        errors.name = ' این فیلد باید بین ۳ تا ۳۰ کاراکتر باشد.';
    }

    if (Validator.isEmpty(data.name)) {
      errors.name = 'نام و نام خانوادگی الزامی است.';
    }

    if (!Validator.isEmail(data.email) ) {
        errors.email = 'این ایمیل صحیح نیست';
    }

    if (Validator.isEmpty(data.email) ) {
        errors.email = 'ایمیل الزامی است.';
    }

    if (!Validator.isLength(data.password, { min: 6, max: 50 })) {
        errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    if (Validator.isEmpty(data.password) ) {
        errors.password = 'رمز عبور الزامی است.';
    }

    if (Validator.isEmpty(data.password2) ) {
        errors.password2 = 'تایید رمز عبور الزامی است.';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'رمز های عبور باید یکی باشند';
    }

    if (Validator.isEmpty(data.state) ) {
      errors.state = 'استان هحل سکونت الزامی است.';
    }

    if (Validator.isEmpty(data.school) ) {
        errors.school = 'نام مدرسه الزامی است.';
    }

    if (Validator.isEmpty(data.grade) ) {
      errors.grade = 'پایه تحصیلی الزامی است.';
    }

    if (Validator.isEmpty(data.field) ) {
        errors.field = 'رشته الزامی است.';
      }

    if (!Validator.isLength(data.phoneNumber, { min: 11, max: 11 })) {
        errors.phoneNumber = 'تلفن تماس باید ۱۱ کاراکتر باشد';
    }

    if (Validator.isEmpty(data.phoneNumber) ) {
        errors.phoneNumber = 'تلفن تماس الزامی است. لطفا فونت خود را انگلیسی کنید';
    }

    if (Validator.isEmpty(data.homeNumber) ) {
        errors.homeNumber = 'تلفن منزل الزامی است';
    }

    if( !(data.grade == '12th' || data.grade == '11th' || data.grade == '10th' || data.grade == 'graduated') )
        errors.grade = 'پایه تحصیلی باید ۱۱ ام ۱۲ ام یا ۱۰ ام باشد'

    return {
        errors,
        isValid: isEmpty(errors)
    }
}