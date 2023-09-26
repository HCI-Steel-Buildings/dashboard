import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonIcon,
  IonButton,
} from "@ionic/react";
import "./Home.css";
import { useCommonContext } from "../Context/CommonContext";
import React, { useState } from "react";
import { personOutline } from "ionicons/icons";

const Home: React.FC = () => {
  const data = useCommonContext();
  console.log(data);

  // Start JSX
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="title">Welcome to HCI Steel Buildings</IonTitle>
          <IonButton slot="end" className="avatar">
            <IonIcon icon={personOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data.loading ? (
          <div className="spinner-container">
            <IonSpinner />
          </div>
        ) : (
          <div>Test</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
