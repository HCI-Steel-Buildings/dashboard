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
                    <strong>OTHER CALCULATOR COMING SOON</strong>
                    <IonCardSubtitle>
                      For now you have 2 of the same calculator!
                    </IonCardSubtitle>
                  </IonCardTitle>
                </IonCardHeader>
                <ComponentCalculator />
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default Calculator;
