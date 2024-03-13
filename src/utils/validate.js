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
  if (startDate && endDate) {
    const end = dayjs(endDate, { format: "DD/MM/YYYY" });
    const start = dayjs(startDate, { format: "DD/MM/YYYY" });
    console.log("valllidatetttt", start, end);

    const differenceInDays = end.diff(start, "days");
    console.log("logggvalidatettetetete", differenceInDays);

    if (differenceInDays > 30) {
      return null;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export function validateDateRange(startDate, endDate) {
  console.log("startDatestartDatestartDatestartDate", startDate);
  console.log("endDateendDateendDateendDateendDate", endDate);
  // Parse the dates and create Date objects
  const [startDay, startMonth, startYear] = startDate.split("/");
  const [endDay, endMonth, endYear] = endDate.split("/");
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);

  // Calculate the difference in milliseconds
  const diff = end - start;

  // Convert the difference to days
  const days = diff / (1000 * 60 * 60 * 24);

  // Check if the difference is more than 30 days
  if (days > 30) {
    return "The start date and end date can't be more than 30 days apart.";
  }

  return null;
}
