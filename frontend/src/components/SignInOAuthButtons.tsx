import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) {
    return null;
  }
  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };
  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="bg-zinc-800 w-full text-white border-zinc-200 hover:bg-zinc-700 h-11"
    >
      Contine with Google
    </Button>
  );
};

export default SignInOAuthButtons;
