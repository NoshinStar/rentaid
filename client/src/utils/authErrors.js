export function authErrorMessage(err) {
  if (err.errors?.length) return err.errors[0].message

  switch (err.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try signing in."
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password."
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters."
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later."
    case "auth/network-request-failed":
      return "Network error. Check your connection."
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in was cancelled."
    case "auth/popup-blocked":
      return "Your browser blocked the Google window. Allow pop-ups and try again."
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email. Sign in with your password."
    default:
      return err.message || "Something went wrong. Please try again."
  }
}