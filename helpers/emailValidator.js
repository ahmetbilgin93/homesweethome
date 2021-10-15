export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email || email.length <= 0) return "Email Boş Olamaz.";
  if (!re.test(email)) return "Gerçek bir email adersi gerekli.";
  return "";
}
