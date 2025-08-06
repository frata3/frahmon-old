import moment from "jalali-moment";

const toPersianDigits = (str) => {
  return str.toString().replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit]);
};

export const toJalali = (date) => {
  if (!date) return "";

  const now = moment();
  const inputDate = moment(date);
  const jInput = moment(date).locale("fa");

  const diffYears = now.diff(inputDate, "years");

  if (diffYears >= 1) {
    return toPersianDigits(jInput.format("YYYY/MM/DD"));
  } else {
    return toPersianDigits(jInput.format("D MMMM")); 
  }
};

export const toJalaliRelative = (date) => {
  if (!date) return "";
  const relative = moment(date).locale("fa").fromNow();
  return toPersianDigits(relative);
};

export const registerJalaliHelpers = (req, res, next) => {
  res.locals.toJalali = toJalali;
  res.locals.toJalaliRelative = toJalaliRelative;
  next();
};
