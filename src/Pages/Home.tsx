import React from "react";
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import Header from "../Components/Header/Header";
import MessageOfTheDay from "../Components/MesssageOfTheDay/MessageOfTheDay";
import "./Home.css";
import AppCard from "../Components/AppCardComponent/AppCardComponent";
const Home: React.FC = () => {
  const cardData = [
    {
      title: "Project Center",
      description: "Navigate to Project Center",
      route: "/projectCenter",
    },
    {
      title: "Minis",
      description: "Explore the Minis",
      route: "/minis",
    },
    {
      title: "Analytics",
      description: "Dive into Analytics",
      route: "/charts",
    },
  ];

  return (
    <IonPage>
      <IonContent fullscreen>
        <Header />

        <IonGrid>
          {/* Row for App Navigation Boxes */}
          <IonRow>
            {cardData.map((card, index) => (
              <IonCol key={index}>
                <AppCard
                  title={card.title}
                  description={card.description}
                  route={card.route}
                />
              </IonCol>
            ))}
          </IonRow>

          {/* Row for Message of the Day */}
          <IonRow>
            <IonCol>
              <MessageOfTheDay />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
