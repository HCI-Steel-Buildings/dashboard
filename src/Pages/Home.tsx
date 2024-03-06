import React from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  isPlatform,
  IonImg,
} from "@ionic/react";
import Header from "../Components/Header/Header";
import MessageOfTheDay from "../Components/MesssageOfTheDay/MessageOfTheDay";
import "./Home.css";
import AppCard from "../Components/AppCardComponent/AppCardComponent";
import { useCommonContext } from "../Context/CommonContext";
// import Snowfall from "react-snowfall";

// Inside your component return statement
const Home: React.FC = () => {
  const cardData = [
    {
      title: "Purchasing",
      description: "Navigate to Purchasing Hub💵",
      route: "/purchasing",
    },
    {
      title: "Pre-Eng Quoting",
      description: "Explore the Minis Department🔬",
      route: "/mbs",
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
    {
      title: "Quotes",
      description: "Create a quote📝",
      route: "/quotes",
    },
  ];

  const { data } = useCommonContext();
  const colSize = isPlatform("mobile") ? "12" : "6";
  return (
    <IonPage>
      {/* <Snowfall style={{ zIndex: 1000 }} color="red" snowflakeCount={50} /> */}
      <IonContent fullscreen>
        <Header />

        <IonGrid>
          <IonRow
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IonImg
              src="https://cdn.dribbble.com/users/1072488/screenshots/11848987/media/f69852d96f1e1737c3229a7f554c4df4.gif"
              style={{ width: "15%" }}
            />
          </IonRow>

          {/* Row for App Navigation Boxes */}
          <IonRow>
            {cardData.map((card, index) => (
              <IonCol key={index} size={colSize}>
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
