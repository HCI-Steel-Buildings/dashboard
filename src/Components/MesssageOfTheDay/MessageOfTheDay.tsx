import React from "react";
import {
  IonCard,
  IonCardSubtitle,
  IonCardTitle,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./MessageOfTheDay.css";

const MessageOfTheDay = () => {
  return (
    <IonCard className="messageOfTheDayCard">
      <IonCardTitle>HAPPY NEW YEAR</IonCardTitle>
      <IonCardSubtitle>
        Click one of the apps below to launch one of the microservices.
      </IonCardSubtitle>
    </IonCard>
  );
};

export default MessageOfTheDay;
