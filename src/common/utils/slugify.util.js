module.exports = function generateSlug(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u065F]/g, "") // حذف علائم حرکتی عربی
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, "") // حذف کاراکترهای غیرمجاز (غیر از فارسی، انگلیسی، اعداد و فاصله)
      .replace(/\s+/g, "-") // تبدیل فاصله‌ها به -
      .replace(/-+/g, "-"); // جلوگیری از چندتا - پشت سر هم
  };
  