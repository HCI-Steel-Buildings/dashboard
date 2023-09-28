/* Create a react login page using typescript */

import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonImg,
} from "@ionic/react";
import "./Login.css";
import LoginButton from "../Components/LogInButton";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <LoginButton />
      </IonContent>
    </IonPage>
  );
};

export default Login;
