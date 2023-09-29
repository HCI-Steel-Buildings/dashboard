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
} from "@ionic/react";
import React, { useState } from "react";

const ComponentCalculator: React.FC = () => {
  const [width, setWidth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [roofPitch, setRoofPitch] = useState<number>(0);
  const [eaveHeight, setEaveHeight] = useState<number>(0);

  const [results, setResults] = useState<{
    hhrPanels: number;
    rssPanels: number;
    panelLength: number;
    ridgeHeight: number;
    hhrStructuralScrews: number;
    hhrStructuralScrewsOverage: number;
    hhrStructuralScrewsTotal: number;
    hhrStitchScrews: number;
    hhrStitchScrewsOverage: number;
    hhrStitchScrewsTotal: number;
    hhrClosures: number;
    rssStructuralScrews: number;
    rssStructuralScrewsOverage: number;
    rssStructuralScrewsTotal: number;
    rssClips: number;
    rssClipsOverage: number;
    rssClipsTotal: number;
    panheadScrews: number;
    rssClosures: number;
  }>({
    hhrPanels: 0,
    rssPanels: 0,
    panelLength: 0,
    ridgeHeight: 0,
    hhrStructuralScrews: 0,
    hhrStructuralScrewsOverage: 0,
    hhrStructuralScrewsTotal: 0,
    hhrStitchScrews: 0,
    hhrStitchScrewsOverage: 0,
    hhrStitchScrewsTotal: 0,
    hhrClosures: 0,
    rssStructuralScrews: 0,
    rssStructuralScrewsOverage: 0,
    rssStructuralScrewsTotal: 0,
    rssClips: 0,
    rssClipsOverage: 0,
    rssClipsTotal: 0,
    panheadScrews: 0,
    rssClosures: 0,
  });

  const calculate = () => {
    const riseOfRoof = (width / 2) * (roofPitch / 12);
    const hhrPanels = Math.ceil(((length * 12) / 36) * 2);
    const rssPanels = Math.ceil(((length * 12) / 18) * 2);
    const panelLength = Math.sqrt((width / 2) ** 2 + riseOfRoof ** 2);
    const ridgeHeight = riseOfRoof + eaveHeight;

    // Calculating HHR Components
    const hhrStructuralScrews = (panelLength / 3 - 2) * 3 + 15 * hhrPanels;
    const hhrStructuralScrewsOverage = hhrStructuralScrews * 0.1;
    const hhrStructuralScrewsTotal =
      hhrStructuralScrews + hhrStructuralScrewsOverage;
    const hhrStitchScrews = (panelLength * hhrPanels) / 2;
    const hhrStitchScrewsOverage = hhrStitchScrews * 0.1;
    const hhrStitchScrewsTotal = hhrStitchScrews + hhrStitchScrewsOverage;
    const hhrClosures = hhrPanels * 2;

    // Calculating RSS Components
    const rssStructuralScrews = rssPanels * 8;
    const rssStructuralScrewsOverage = rssStructuralScrews * 0.1;
    const rssStructuralScrewsTotal =
      rssStructuralScrews + rssStructuralScrewsOverage;
    const rssClips = (panelLength / 3) * hhrPanels;
    const rssClipsOverage = rssClips * 0.1;
    const rssClipsTotal = rssClips + rssClipsOverage;
    const panheadScrews = rssClips * 2;
    const rssClosures = rssPanels;

    setResults({
      hhrPanels,
      rssPanels,
      panelLength,
      ridgeHeight,
      hhrStructuralScrews,
      hhrStructuralScrewsOverage,
      hhrStructuralScrewsTotal,
      hhrStitchScrews,
      hhrStitchScrewsOverage,
      hhrStitchScrewsTotal,
      hhrClosures,
      rssStructuralScrews,
      rssStructuralScrewsOverage,
      rssStructuralScrewsTotal,
      rssClips,
      rssClipsOverage,
      rssClipsTotal,
      panheadScrews,
      rssClosures,
    });
  };

  const reset = () => {
    setWidth(0);
    setLength(0);
    setRoofPitch(0);
    setEaveHeight(0);
    setResults({
      hhrPanels: 0,
      rssPanels: 0,
      panelLength: 0,
      ridgeHeight: 0,
      hhrStructuralScrews: 0,
      hhrStructuralScrewsOverage: 0,
      hhrStructuralScrewsTotal: 0,
      hhrStitchScrews: 0,
      hhrStitchScrewsOverage: 0,
      hhrStitchScrewsTotal: 0,
      hhrClosures: 0,
      rssStructuralScrews: 0,
      rssStructuralScrewsOverage: 0,
      rssStructuralScrewsTotal: 0,
      rssClips: 0,
      rssClipsOverage: 0,
      rssClipsTotal: 0,
      panheadScrews: 0,
      rssClosures: 0,
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
          {/* HHR Results Card */}
          <IonCard>
            <IonCardContent>
              <IonLabel>
                <strong>
                  <h2>HHR Results: Based on 3' Purlin Spacing</h2>
                </strong>
                <p>
                  <strong>Panels Needed:</strong> {results.hhrPanels}
                </p>
                <p>
                  <strong>Structural Screws:</strong>{" "}
                  {results.hhrStructuralScrewsTotal.toFixed(2)}
                </p>
                <div style={{ display: "flex", fontSize: "" }}>
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.hhrStructuralScrews.toFixed(2)}</strong>{" "}
                    (original)
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>+</strong>
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>
                      {results.hhrStructuralScrewsOverage.toFixed(2)}
                    </strong>{" "}
                    (overage)
                  </p>
                </div>
                <p>
                  <strong>Stitch Screws:</strong>{" "}
                  {results.hhrStitchScrewsTotal.toFixed(2)}
                </p>
                <div style={{ display: "flex", fontSize: "" }}>
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.hhrStitchScrews.toFixed(2)}</strong>{" "}
                    (original)
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>+</strong>
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.hhrStitchScrewsOverage.toFixed(2)}</strong>{" "}
                    (overage)
                  </p>
                </div>
                <p>
                  <strong>Closures:</strong> {results.hhrClosures}
                </p>
              </IonLabel>
            </IonCardContent>
          </IonCard>

          {/* RSS Results Card */}
          <IonCard>
            <IonCardContent>
              <IonLabel>
                <strong>
                  <h2>RSS Results: Based on 3' Purlin Spacing</h2>
                </strong>
                <p>
                  <strong>Panels Needed:</strong> {results.rssPanels}
                </p>
                <p>
                  <strong>Structural Screws:</strong>{" "}
                  {results.rssStructuralScrewsTotal.toFixed(2)}
                </p>
                <div style={{ display: "flex", fontSize: "" }}>
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.rssStructuralScrews.toFixed(2)}</strong>{" "}
                    (original)
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>+</strong>
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>
                      {results.rssStructuralScrewsOverage.toFixed(2)}
                    </strong>{" "}
                    (overage)
                  </p>
                </div>
                <p>
                  <strong>RSS Clips:</strong> {results.rssClipsTotal.toFixed(2)}
                </p>
                <div style={{ display: "flex", fontSize: "" }}>
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.rssClips.toFixed(2)}</strong> (original)
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>+</strong>
                  </p>
                  &nbsp;
                  <p style={{ fontSize: ".65rem" }}>
                    <strong>{results.rssClipsOverage.toFixed(2)}</strong>{" "}
                    (overage)
                  </p>
                </div>
                <p>
                  <strong>Panhead Screws:</strong>{" "}
                  {results.panheadScrews.toFixed(2)}
                </p>
                <p>
                  <strong>Closures:</strong> {results.rssClosures}
                </p>
              </IonLabel>
            </IonCardContent>
          </IonCard>
          {/* Additional Results */}
          <IonItem>
            <IonLabel>Panel Length: {results.panelLength.toFixed(2)}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Ridge Height: {results.ridgeHeight.toFixed(2)}</IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ComponentCalculator;
