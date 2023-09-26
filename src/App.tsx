import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { calendarNumber, homeOutline, square } from "ionicons/icons";
import Home from "./Pages/Home";
import ProjectCenter from "./Pages/ProjectCenter";
import Minis from "./Pages/Minis";
import Charts from "./Pages/Charts";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
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
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/charts">
            <Charts />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="projectCenter" href="/projectCenter">
            <IonIcon aria-hidden="true" icon={calendarNumber} />
            <IonLabel>Project Center</IonLabel>
          </IonTabButton>
          <IonTabButton tab="minis" href="/minis">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Minis</IonLabel>
          </IonTabButton>
          <IonTabButton tab="charts" href="/charts">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Analytics</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
