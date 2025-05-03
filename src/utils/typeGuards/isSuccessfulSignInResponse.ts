import { SuccessfulSignInResponse } from "../../models";

export function isSuccessfulSignInResponse(
  response: any
): response is SuccessfulSignInResponse {
  return response && typeof response === "object" && "user" in response && "session" in response;
}