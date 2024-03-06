import React from "react";
import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import LoginButton from "../LogInButton";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const { isAuthenticated, user } = useAuth0();

  // Debug: Check if isAuthenticated is behaving as expected
  console.log("Is Authenticated:", isAuthenticated);

  return (
    <IonHeader>
      <IonToolbar>
        <IonGrid>
          <IonRow>
            <IonCol size="auto">
              <IonAvatar style={{ margin: "0.5rem" }}>
                {/* Ensure user?.picture is not undefined or null */}
                {user?.picture && <img src={user?.picture} alt="profile" />}
              </IonAvatar>
            </IonCol>
            <IonCol>
              {/* Adjusted for better alignment of the text */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Welcome, <strong>{user?.name || "Guest"}</strong> to HCIX
              </div>
            </IonCol>
            {/* Directly rendering buttons to ensure visibility */}
          </IonRow>
        </IonGrid>
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
