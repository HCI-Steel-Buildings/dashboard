import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IonButton } from "@ionic/react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <IonButton onClick={() => loginWithRedirect()}>Log In</IonButton>;
};

export default LoginButton;
