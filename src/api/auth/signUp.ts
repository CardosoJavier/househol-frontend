import { SignUpType } from "../../models";
import { supabase } from "../../utils";

export async function signUp({ userInfo }: { userInfo: SignUpType }) {
  const email = userInfo.email;
  const password = userInfo.password;
  const firtName = userInfo.name;
  const lastName = userInfo.lastName;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firtName,
        last_name: lastName,
      },
    },
  });
  if (error) {
    return error;
  }
}
