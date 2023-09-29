import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AwesomeButton } from "react-awesome-button";
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <AwesomeButton
      style={{
        width: "200px",
        fontSize: "1.345rem",
      }}
      onPressed={() => loginWithRedirect()}
    >
      Log In
    </AwesomeButton>
  );
};

export default LoginButton;
