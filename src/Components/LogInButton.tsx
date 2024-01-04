import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AwesomeButton } from "react-awesome-button";
import { IonButton } from "@ionic/react";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    // <AwesomeButton
    <IonButton
      style={{
        width: "200px",
        fontSize: "1.345rem",
      }}
      // onPress={() => loginWithRedirect()}
      onClick={() => loginWithRedirect()}
    >
      Log In
    </IonButton>
  );
};

export default LoginButton;
