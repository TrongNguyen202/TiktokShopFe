import dayjs from "dayjs";

export const validateEmail = (email) => {
  if (email === "") return true;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^\+?[0-9]{10}$/;

  return regex.test(phoneNumber);
};

export const validateReferralPhoneNumber = (referralPhoneNumber) => {
  if (referralPhoneNumber === "") return true;
  const regex = /^\+?[0-9]{10,15}$/;

  return regex.test(referralPhoneNumber);
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) return false;

  return true;
};

// validate length longer than 50
export const validateName = (name) => {
  if (name.length > 50) {
    return "Tên không được vượt quá 50 ký tự";
  }
  return null;
};

// validate end date - start date less or equal 30 days
export const validateEndDate = (startDate, endDate) => {
  console.log("validatettetettetetetet", startDate, endDate);
  const priorDate = new Date(new Date().setDate(endDate.getDate() - 30));

  if (priorDate > startDate) {
    return null;
  } else {
    return 1;
  }
};
