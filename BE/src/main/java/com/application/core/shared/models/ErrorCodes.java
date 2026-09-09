package com.application.core.shared.models;

public enum ErrorCodes {
  /// https://firebase.google.com/docs/reference/admin/error-handling

  /**	Failed to fetch public key certificates required to verify a JWT (ID token or session cookie).*/
  CERTIFICATE_FETCH_FAILED,
  /**	A user already exists with the provided email.*/
  EMAIL_ALREADY_EXISTS,
  /**	The ID token specified to verifyIdToken() is expired.*/
  EXPIRED_ID_TOKEN,
  /**	The session cookie specified to verifySessionCookie() iis expired.*/
  EXPIRED_SESSION_COOKIE,
  /**	The provided dynamic link domain is not configured or authorized for the current project. Related to email action link APIs.*/
  INVALID_DYNAMIC_LINK_DOMAIN,
  /**	The ID token specified to verifyIdToken() is invalid.*/
  INVALID_ID_TOKEN,
  /**	The session cookie specified to verifySessionCookie() is invalid.*/
  INVALID_SESSION_COOKIE,
  /**	A user already exists with the provided phone number.*/
  PHONE_NUMBER_ALREADY_EXISTS,
  /**	The ID token specified to verifyIdToken() is revoked.*/
  REVOKED_ID_TOKEN,
  /**	The session cookie specified to verifySessionCookie() is expired.*/
  REVOKED_SESSION_COOKIE,
  /**	The domain of the continue URL is not whitelisted. Related to email action link APIs. */
  UNAUTHORIZED_CONTINUE_URL,
  /**	No user record found for the given identifier.*/
  USER_NOT_FOUND,
  /**	A user already exists .*/
  USER_ALREADY_EXISTS,
}
