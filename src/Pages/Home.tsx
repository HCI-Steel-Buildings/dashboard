import React from "react";
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import Header from "../Components/Header/Header";
import MessageOfTheDay from "../Components/MesssageOfTheDay/MessageOfTheDay";
import "./Home.css";
import AppCard from "../Components/AppCardComponent/AppCardComponent";
import { useCommonContext } from "../Context/CommonContext";
import Snowfall from "react-snowfall";

// Inside your component return statement
const Home: React.FC = () => {
  const cardData = [
    {
      title: "Purchasing",
      description: "Navigate to Purchasing Hub💵",
      route: "/purchasing",
    },
    {
      title: "Minis",
      description: "Explore the Minis Department🔬",
      route: "/minis",
    },
    {
      title: "Analytics",
      description: "Dive into Analytics📈",
      route: "/charts",
    },
    {
      title: "Calculator",
      description: "All your calculations in one place✅",
      route: "/calculator",
    },
  ];

  const { data } = useCommonContext();
  console.log(data);
  return (
    <IonPage>
      <Snowfall style={{ zIndex: 1000 }} color="red" snowflakeCount={50} />

      <IonContent fullscreen>
        <Header />

        <IonGrid>
          <IonRow>
            <IonCol>
              <MessageOfTheDay />
            </IonCol>
          </IonRow>
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
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
