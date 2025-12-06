const MESSAGES = {
  required: "This field is required",
  min: (min) => `This value should be above ${min}`,
  max: (max) => `This value should be below ${max}`,
  minLength: (min) => `This input is below the minimum length of ${min} characters`,
  maxLength: (max) => `This input exceeds the maximum length of ${max} characters`,
  email: `Please enter a valid email address`,
  password: `Minimum eight characters and at least one letter and one number`,
  onlyLetters: `This input is only for alphabetic values`,
  chargeRegex: "Only two decimals allowed.",
  passwordMatch: `Passwords must match`
};

export default MESSAGES;
