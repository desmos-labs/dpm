import { PasswordComplexityScore } from '../components/PasswordComplexityScore';

export default function evaluatePasswordComplexity(password: string): PasswordComplexityScore {
  const specialChars = '\\|!"£$%&/()=?^\'[]*+@#{}<>';
  if (password.length < 6) {
    return 0;
  }
  let uppercaseChars = 0;
  let numberChars = 0;
  let specialCharsCount = 0;

  for (let i = 0; i < password.length; i += 1) {
    if (!Number.isNaN(Number(password[i]))) {
      numberChars += 1;
    } else if (specialChars.indexOf(password[i]) >= 0) {
      specialCharsCount += 1;
    } else if (password[i].toUpperCase() === password[i]) {
      uppercaseChars += 1;
    }
  }

  let score = 1;
  if (uppercaseChars > 0) {
    score += 1;
  }
  if (numberChars > 0) {
    score += 1;
  }
  if (specialCharsCount > 0) {
    score += 1;
  }

  return score as PasswordComplexityScore;
}
