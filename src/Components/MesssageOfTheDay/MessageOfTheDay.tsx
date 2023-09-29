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
      <IonCardTitle>Message Of The Day</IonCardTitle>
      <IonCardSubtitle>Replace this with your message</IonCardSubtitle>
    </IonCard>
  );
};

export default MessageOfTheDay;
