import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";
import "./Home.css";
import { Calendar } from "../Components/Calendar/Calendar";
import { useMondayData } from "../Context/MondayDataContext";
import { formatDate } from "../Utils/dateUtils";
import React, { useState } from "react";

const Home: React.FC = () => {
  // CONTEXT
  const data = useMondayData();
  // STATE
  const [searchTerm, setSearchTerm] = useState<string>("");
  // LOCAL VARIABLES
  const currentDate = new Date();

  if (!data) {
    console.log("Data is still being fetched...");
    return <IonPage>Loading...</IonPage>;
  }

  console.log("Data in Home:", data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: "bold" }}>
            Home - {formatDate(currentDate)}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Calendar searchTerm={searchTerm} key={searchTerm} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
