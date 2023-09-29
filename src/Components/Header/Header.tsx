import React from "react";
import { IonAvatar, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import LoginButton from "../LogInButton";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { isAuthenticated, user } = useAuth0();
  console.log(user);
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>Welcome {user?.name} to HCI Expiremental!</IonTitle>
        <IonAvatar />
        {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
