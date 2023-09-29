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
      <IonCardTitle>Greetings! Welcome to HCI's new app.</IonCardTitle>
      <IonCardSubtitle>Click one of the apps above to explore!</IonCardSubtitle>
    </IonCard>
  );
};

export default MessageOfTheDay;
