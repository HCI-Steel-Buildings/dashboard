import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonIcon,
  IonButton,
  IonCard,
  IonCardTitle,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import "./Home.css";
import { useCommonContext } from "../Context/CommonContext";
import React, { useState } from "react";
import QuotesAnalytics from "../Components/Quotes";

const Charts: React.FC = () => {
  const data = useCommonContext();

  // Start JSX
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="title">Monthy Analytics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data.loading ? (
          <div className="spinner-container">
            <IonSpinner />
          </div>
        ) : (
          <IonGrid>
            <IonCol size="4">
              <IonRow>
                <IonCard>
                  <IonToolbar>
                    <IonTitle>
                      <strong>Total Monthly Quotes</strong>
                    </IonTitle>
                  </IonToolbar>
                  <QuotesAnalytics />
                </IonCard>
              </IonRow>
            </IonCol>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Charts;
