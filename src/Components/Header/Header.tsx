import React from "react";
import { IonAvatar, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import LoginButton from "../LogInButton";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          Welcome, <strong>{user?.name}</strong> to HCIX!
        </IonTitle>
        <IonAvatar slot="end" style={{ margin: "1rem" }}>
          <img src={user?.picture} alt="profile" />
        </IonAvatar>
        {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
