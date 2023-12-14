import React, { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonToolbar,
  IonTitle,
  IonIcon,
} from "@ionic/react";
import ComponentCalculator from "../Components/Calculators/ComponentCalculator";
import WallSquareFootageCalculator from "../Components/Calculators/WallSquareFootageCalculator";
import TrimCalculator from "../Components/Calculators/TrimCalculator";
import CostCalculator from "../Components/Calculators/CostCalculator";
import { removeCircleOutline } from "ionicons/icons";

const Calculator: React.FC = () => {
  const [isComponentCalcMinimized, setComponentCalcMinimized] = useState(false);
  const [isTrimCalcMinimized, setTrimCalcMinimized] = useState(false);
  const [isWallSFCalcMinimized, setWallSFCalcMinimized] = useState(false);
  const [isCostCalcMinimized, setCostCalcMinimized] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>HCI Calculators</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Component Calculator 🧮</strong>
                    <IonButton
                      onClick={() =>
                        setComponentCalcMinimized(!isComponentCalcMinimized)
                      }
                    >
                      {isComponentCalcMinimized ? (
                        "+"
                      ) : (
                        <IonIcon icon={removeCircleOutline} />
                      )}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
                {!isComponentCalcMinimized && <ComponentCalculator />}
              </IonCard>
            </IonCol>

            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Trim Pricing Calculator 🏛️</strong>
                    <IonButton
                      onClick={() => setTrimCalcMinimized(!isTrimCalcMinimized)}
                    >
                      {isTrimCalcMinimized ? (
                        "+"
                      ) : (
                        <IonIcon icon={removeCircleOutline} />
                      )}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
                {!isTrimCalcMinimized && <TrimCalculator />}
              </IonCard>
            </IonCol>

            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Wall SF Calculator 🧱</strong>
                    <IonButton
                      onClick={() =>
                        setWallSFCalcMinimized(!isWallSFCalcMinimized)
                      }
                    >
                      {isWallSFCalcMinimized ? (
                        "+"
                      ) : (
                        <IonIcon icon={removeCircleOutline} />
                      )}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
                {!isWallSFCalcMinimized && <WallSquareFootageCalculator />}
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Engineering Cost Calculator 🤖</strong>
                    <IonButton
                      onClick={() => setCostCalcMinimized(!isCostCalcMinimized)}
                    >
                      {isCostCalcMinimized ? (
                        "+"
                      ) : (
                        <IonIcon icon={removeCircleOutline} />
                      )}
                    </IonButton>
                  </IonCardTitle>
                </IonCardHeader>
                {!isCostCalcMinimized && <CostCalculator />}
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Calculator;
