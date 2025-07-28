import { SuccessfulSignInResponse } from "../../models";

export function isSuccessfulSignInResponse(
  response: any
): response is SuccessfulSignInResponse {
  if (!response) return false;
  return typeof response === "object" && "user" in response && "session" in response;
}