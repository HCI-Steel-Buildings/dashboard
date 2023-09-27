import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonCard,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import "./Home.css";
import { useCommonContext } from "../Context/CommonContext";
import React, { useState } from "react";
import QuotesAnalytics from "../Components/QuotesAnalytics";

const Charts: React.FC = () => {
  const data = useCommonContext();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="title">Monthly Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data.loading ? (
          <div className="spinner-container">
            <IonSpinner />
          </div>
        ) : (
          <QuotesAnalytics />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Charts;
