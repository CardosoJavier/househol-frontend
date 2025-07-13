import { AuthError } from "@supabase/supabase-js";
import { SuccessfulSignInResponse } from "../../models";
import { supabase } from "../../utils";

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return error as AuthError;
    }

    return data as SuccessfulSignInResponse;
  } catch (error) {
    console.error(error);
  }
}
