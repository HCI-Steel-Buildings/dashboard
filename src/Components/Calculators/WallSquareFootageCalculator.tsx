import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";

const WallSquareFootageCalculator: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [roofPitch, setRoofPitch] = useState<number>(0);
  const [eaveHeight, setEaveHeight] = useState<number>(0);

  const [results, setResults] = useState<{
    panelLength: number;
    ridgeHeight: number;
    totalBaseArea: number;
    eaveArea: number;
  }>({
    panelLength: 0,
    ridgeHeight: 0,
    totalBaseArea: 0,
    eaveArea: 0,
  });

  const calculate = () => {
    const riseOfRoof = (width / 2) * (roofPitch / 12);
    const panelLength = Math.sqrt((width / 2) ** 2 + riseOfRoof ** 2);
    const ridgeHeight = riseOfRoof + eaveHeight;
    // BASE AREA
    const endWallArea = eaveHeight * width * 2;
    const sideWallArea = eaveHeight * length * 2;
    const totalBaseArea = sideWallArea + endWallArea;

    // Gable Eave Area
    const runIncrease = (roofPitch / 12) * (0.5 * width);
    const eaveArea = runIncrease * (0.5 * width) * 2;

    setResults({
      panelLength,
      ridgeHeight,
      totalBaseArea,
      eaveArea,
    });
  };

  const reset = () => {
    setWidth(0);
    setLength(0);
    setRoofPitch(0);
    setEaveHeight(0);
    setResults({
      panelLength: 0,
      ridgeHeight: 0,
      totalBaseArea: 0,
      eaveArea: 0,
    });
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Width</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={width}
              onIonChange={(e) => setWidth(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Length</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={length}
              onIonChange={(e) => setLength(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Roof Pitch</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={roofPitch}
              onIonChange={(e) => setRoofPitch(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Eave Height</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={eaveHeight}
              onIonChange={(e) => setEaveHeight(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonButton expand="full" onClick={calculate}>
            Calculate
          </IonButton>
          <IonButton expand="full" onClick={reset} color="medium">
            Reset
          </IonButton>
        </IonCol>
      </IonRow>
      {/* Display Results */}
      <IonRow>
        <IonCol>
          {/* Walls */}
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <strong>
                <h2>Base SF</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                {results.totalBaseArea} sf
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol>
          {/* RSS Results Card */}
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <IonLabel>
                <strong>
                  <h2>Gable Eave SF</h2>
                </strong>
                <strong style={{ fontSize: "2rem" }}>
                  {results.eaveArea} sf
                </strong>
              </IonLabel>
            </IonCardContent>
          </IonCard>
          {/* Additional Results */}
        </IonCol>
        <IonCol>
          <IonCard style={{ textAlign: "center" }} color={"primary"}>
            <IonCardContent>
              <IonLabel>
                <strong>
                  <h2>Total SF</h2>
                </strong>
                <IonText style={{ fontWeight: "bold" }}>
                  <strong style={{ fontSize: "2rem" }}>
                    {results.totalBaseArea + results.eaveArea} sf
                  </strong>
                </IonText>
              </IonLabel>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default WallSquareFootageCalculator;
