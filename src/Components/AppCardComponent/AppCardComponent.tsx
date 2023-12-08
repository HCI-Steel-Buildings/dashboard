import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonRouterLink,
  IonIcon,
} from "@ionic/react";
import { AwesomeButton } from "react-awesome-button";
import { arrowForward } from "ionicons/icons";

interface AppCardProps {
  title: string;
  description: string;
  route: string;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, route }) => {
  return (
    <IonCard>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCardContent>
              <IonCardTitle>
                <strong>{title}</strong>
              </IonCardTitle>
              {description}
            </IonCardContent>
          </IonCol>
          <IonRouterLink routerLink={route} className="card-button-container">
            <AwesomeButton>
              <IonIcon icon={arrowForward} />
            </AwesomeButton>
          </IonRouterLink>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default AppCard;
