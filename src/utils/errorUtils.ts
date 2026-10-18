/**
 * errorUtils.ts
 * Translates low-level technical errors (Firebase Auth, Firestore, network)
 * into polite, client-facing, business-oriented error messages.
 */

export function getFriendlyErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  // Extract error code and raw message
  const code: string = error?.code || "";
  const rawMsg: string = typeof error === "string" ? error : error?.message || "";

  // 1. Google & Firebase Authentication Errors
  if (code === "auth/popup-closed-by-user" || rawMsg.includes("popup-closed-by-user")) {
    return "Sign-in was cancelled before completion. Please click 'Continue with Google' whenever you're ready to proceed.";
  }

  if (code === "auth/cancelled-popup-request" || rawMsg.includes("cancelled-popup-request")) {
    return "Previous sign-in request was interrupted. Please click to try again.";
  }

  if (code === "auth/popup-blocked" || rawMsg.includes("popup-blocked")) {
    return "The sign-in window was blocked by your browser. Please allow popups for DumDum Delivery or use page redirect.";
  }

  if (code === "auth/network-request-failed" || rawMsg.includes("network-request-failed")) {
    return "Unable to reach the server. Please check your internet connection and try again.";
  }

  if (code === "auth/too-many-requests" || rawMsg.includes("too-many-requests")) {
    return "Too many attempts detected. For your security, please wait a moment before trying again.";
  }

  if (code === "auth/user-disabled" || rawMsg.includes("user-disabled")) {
    return "This user account is currently deactivated. Please contact our support team for assistance.";
  }

  if (code === "auth/configuration-not-found" || rawMsg.includes("configuration-not-found")) {
    return "Sign-in service is currently updating. Please try again in a few moments.";
  }

  if (code === "auth/account-exists-with-different-credential") {
    return "An account already exists with this email using a different sign-in method. Please use your original sign-in provider.";
  }

  if (code === "auth/invalid-credential" || rawMsg.includes("invalid-credential")) {
    return "The sign-in credentials could not be verified. Please try signing in again.";
  }

  // 2. Cloud Firestore & Database Errors
  if (code === "permission-denied" || rawMsg.includes("permission-denied")) {
    return "You do not have permission to perform this action. Please make sure you are signed in as an administrator.";
  }

  if (code === "unavailable" || rawMsg.includes("unavailable")) {
    return "Our database service is temporarily busy. Please wait a few seconds and try again.";
  }

  if (code === "not-found" || rawMsg.includes("not-found")) {
    return "The requested record could not be found. It may have been relocated or removed.";
  }

  if (code === "already-exists" || rawMsg.includes("already-exists")) {
    return "A record with this identifier already exists in the system. Please use a unique code or name.";
  }

  if (code === "resource-exhausted") {
    return "Service capacity limit reached. Please try again shortly.";
  }

  // 3. Clean up generic "Firebase: Error (auth/...)" strings if unhandled
  if (rawMsg.startsWith("Firebase: Error (") || rawMsg.startsWith("FirebaseError:")) {
    // Extract inner code if possible
    const match = rawMsg.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const innerCode = match[1].replace(/^(auth|firestore)\//, "").replace(/-/g, " ");
      return `We encountered an issue during verification (${innerCode}). Please try again or reach out to support.`;
    }
    return "Authentication could not be completed at this time. Please try again.";
  }

  // Fallback to provided message if clean, otherwise friendly fallback
  if (rawMsg && !rawMsg.includes("Firebase:") && rawMsg.length < 140) {
    return rawMsg;
  }

  return "We couldn't process this request right now. Please check your connection and try again.";
}
