import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  barChart,
  calculator,
  calendarNumber,
  cashOutline,
  homeOutline,
  square,
  ticket,
} from "ionicons/icons";
import Home from "./Pages/Home";
import ProjectCenter from "./Pages/ProjectCenter";
import Minis from "./Pages/Minis";
import Charts from "./Pages/Charts";
import Calculator from "./Pages/Calculator";
import Ticket from "./Pages/Ticket";
import LoginButton from "./Components/LogInButton";

import { useAuth0 } from "@auth0/auth0-react";

/* CSS Imports */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";
import "react-awesome-button/dist/styles.css";

setupIonicReact();

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
            <IonText color="primary">
              <h2>Please wait...</h2>
            </IonText>
          </div>
        </IonContent>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 90%; /* Adjust as needed */
          }

          h2 {
            margin-top: 20px;
            font-weight: normal;
          }
        `}</style>
      </IonPage>
    );
  }

  return isAuthenticated ? (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/projectCenter">
              <ProjectCenter />
            </Route>
            <Route path="/minis">
              <Minis />
            </Route>
            <Route exact path="/charts">
              <Charts />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/calculator">
              <Calculator />
            </Route>
            <Route exact path="/tickets">
              <Ticket />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="projectCenter" href="/projectCenter">
              <IonIcon icon={cashOutline} />
              <IonLabel>Purchasing</IonLabel>
            </IonTabButton>
            <IonTabButton tab="minis" href="/minis">
              <IonIcon icon={square} />
              <IonLabel>Minis</IonLabel>
            </IonTabButton>
            <IonTabButton tab="charts" href="/charts">
              <IonIcon icon={barChart} />
              <IonLabel>Analytics</IonLabel>
            </IonTabButton>
            <IonTabButton tab="calculator" href="/calculator">
              <IonIcon icon={calculator} />
              <IonLabel>Calculator</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tickets" href="/tickets">
              <IonIcon icon={ticket} />
              <IonLabel>Tickets</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  ) : (
    <IonPage className="ion-flex ion-align-items-center ion-justify-content-center">
      <IonImg
        src="https://hcisteelbuildings.com/wp-content/uploads/2018/07/hci-logo.png"
        alt="HCI Logo"
      />
      <IonCard>
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ textAlign: "center" }}>
              <IonText>Welcome to HCI Steel Buildings!</IonText>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCardContent className="ion-text-center">
          <IonCardSubtitle>Please login to continue...</IonCardSubtitle>
          <LoginButton />
        </IonCardContent>
      </IonCard>
    </IonPage>
  );
};

export default App;
