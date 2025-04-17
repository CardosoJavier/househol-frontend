import { SERVER_URL } from "../../config";
import { SignInType } from "../../models/auth/SignIn";
import { SignUpType } from "../../models/auth/SignUp";

export async function signUp(signUpData: SignUpType) {

    try {

        // make request
        const request = await fetch(`${SERVER_URL}/auth/sign-up`, {
            method: "POST",
            body: JSON.stringify(signUpData),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        
        // get response
        if (!request.ok) {
            throw new Error("Error creating account");
        }

        console.log(await request.json());
    }

    catch (e) {
        console.log(e)
    }
}

export async function signIn(signInData: SignInType) {

    try {

        // make request
        const request = await fetch(`${SERVER_URL}/auth/sign-in`, {
            method: "POST",
            body: JSON.stringify(signInData),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        
        // get response
        if (!request.ok) {
            throw new Error("Error signing in");
        }

        console.log(await request.json());
    }

    catch (e) {
        console.log(e)
    }
}