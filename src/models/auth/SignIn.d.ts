import { Session, User, WeakPassword } from "@supabase/supabase-js";

export type SignInType = {
    email: String;
    password: String;
}

export type SuccessfulSignInResponse = {
    user: User;
    session: Session;
    weakPassword?: WeakPassword;
}