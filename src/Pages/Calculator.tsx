import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonGrid,
  IonCol,
  IonRow,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import React from "react";
import ComponentCalculator from "../Components/Calculators/ComponentCalculator";
import WallSquareFootageCalculator from "../Components/Calculators/WallSquareFootageCalculator";
import TrimCalculator from "../Components/Calculators/TrimCalculator";

const Calculator: React.FC = () => {
  return (
    <IonPage>
      {/* HEADER */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>HCI Calculators</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* MAIN CONTENT */}
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong> Component Calculator 🧮</strong>
                  </IonCardTitle>
                </IonCardHeader>
                <ComponentCalculator />
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Trim Pricing Calculator🏛️</strong>
                  </IonCardTitle>
                </IonCardHeader>
                <TrimCalculator />
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Wall SF Calculator 🧱</strong>
                  </IonCardTitle>
                </IonCardHeader>
                <WallSquareFootageCalculator />
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Calculator;
