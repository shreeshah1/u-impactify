const { userTypes, postTypes } = require('./constants');
const firebase = require("firebase");

const isEmail = (email) => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx);
}

const isEmpty = (string) => {
  return string.trim() === '';
}

exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.type)) {
    errors.userType = 'Must not be empty';
  }
  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  }
  else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }
  if (data.type === userTypes.SOCIAL_INITIATIVE) {
    if (isEmpty(data.org)) {
      errors.org = 'Must not be empty';
    }
  }
  else {
    if (isEmpty(data.first)) {
      errors.first = 'Must not be empty';
    }
    if (isEmpty(data.last)) {
      errors.last = 'Must not be empty';
    }
  }
  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty';
  }
  else if (data.password.length < 8) {
    errors.password = 'Length must be at least 8 characters'
  }
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Must not be empty';
  }
  else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email) || isEmpty(data.password)) {
    errors.error = 'Must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateCourseCreation = (data) => {
  let errors = {};

  if (isEmpty(data.title)) {
    errors.title = 'Must not be empty';
  }
  if (isEmpty(data.summary)) {
    errors.summary = 'Must not be empty';
  }
  else if (data.summary.length > 200) {
    errors.summary = 'Summary must be less than 200 characters';
  }
  if (isEmpty(data.courseImageURL)) {
    errors.courseImageURL = 'Required';
  }
  if (isEmpty(data.instructor)) {
    errors.instructor = 'Must not be empty';
  }
  if (isEmpty(data.instructorImageURL)) {
    errors.instructorImageURL = 'Must not be empty';
  }
  if (isEmpty(data.instructorEmail)) {
    errors.instructorEmail = 'Must not be empty';
  }
  if(isEmpty(data.createdAt)){
    errors.createdAt = 'Must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateUserDetails = (data) => {
  let errors = {};

  if (isEmpty(data.imageUrl)) {
    errors.imageUrl = 'Must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validatePostCreation = (data) => {
  let errors = {};
  if (isEmpty(data.title)) {
    errors.title = 'Must not be empty';
  }
  if (isEmpty(data.content)) {
    errors.content = 'Must not be empty';
  }
  if (data.type !== postTypes.OFFERING_STR && data.type !== postTypes.ASKING_STR) {
    errors.type = 'Must choose valid type';
  }
  if (isEmpty(data.authorImageUrl)) {
    errors.authorImageUrl = 'Must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateUserSettingsDetails = (data) => {
  let errors = {};
  if (isEmpty(data.body.currentPassword)) {
    errors.currentPassword = 'Must not be empty';
  }
  if (isEmpty(data.body.newPassword)) {
    errors.newPassword = 'Must not be empty';
  }
  else if (data.body.newPassword.length < 8) {
    errors.newPassword = 'Length must be at least 8 characters'
  }
  if (isEmpty(data.body.confirmPassword)) {
    errors.confirmPassword = 'Must not be empty';
  }
  else if (data.body.newPassword !== data.body.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }
  if (data.user.type === userTypes.SOCIAL_INITIATIVE) {
    if (isEmpty(data.body.org)) {
      errors.org = 'Must not be empty';
    }
  }
  else {
    if (isEmpty(data.body.first)) {
      errors.first = 'Must not be empty';
    }
    if (isEmpty(data.body.last)) {
      errors.last = 'Must not be empty';
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}