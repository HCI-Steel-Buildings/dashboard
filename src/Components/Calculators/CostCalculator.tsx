import {
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

const CostCalculator: React.FC = () => {
  const [width, setWidth] = useState<number | null>(null);
  const [length, setLength] = useState<number | null>(null);
  const [buildingCost, setBuildingCost] = useState<number | null>(null);
  const [results, setResults] = useState<{
    engineeringCost: number;
    structuralCost: number;
    foundationCost: number;
  } | null>(null);

  const categories = {
    "Anything under 1,000 sq ft": 6000,
    "Between 1,001 - 2,400 sq ft": 6500,
    "Between 2,401 - 6,000 sq ft": 7000,
    "Between 6,001 - 10,000 sq ft": 7500,
    "Between 10,001 - 20,000 sq ft": 8000,
    "Between 20,001 - 30,000 sq ft": 8500,
    "Between 30,001 - 40,000 sq ft": 9000,
    "Between 40,001 - 50,000 sq ft": 9500,
    "Between 50,001 - 60,000 sq ft": 10000,
    "Between 60,001 - 70,000 sq ft": 10500,
    "Between 70,001 - 80,000 sq ft": 11000,
    "Between 80,001 - 90,000 sq ft": 11500,
  };

  const determineEngineeringCost = (
    squareFootage: number,
    buildingCost: number
  ) => {
    for (const [category, baseCost] of Object.entries(categories)) {
      if (category.includes("under") && squareFootage <= 1000) {
        return baseCost + 0.015 * buildingCost;
      } else if (category.includes("-")) {
        const bounds = category.split("-");
        const lowerBound = parseInt(bounds[0].replace(/[^\d]/g, ""), 10);
        const upperBound = parseInt(bounds[1].replace(/[^\d]/g, ""), 10);
        if (lowerBound <= squareFootage && squareFootage <= upperBound) {
          return baseCost + 0.015 * buildingCost;
        }
      }
    }
    return 11500 + 0.015 * buildingCost; // Default to the highest category
  };

  const calculate = () => {
    if (width && length && buildingCost) {
      const squareFootage = width * length;
      const engineeringCost = determineEngineeringCost(
        squareFootage,
        buildingCost
      );
      const structuralCost = 0.85 * engineeringCost;
      const foundationCost = 0.15 * engineeringCost;

      setResults({
        engineeringCost,
        structuralCost,
        foundationCost,
      });
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">Length:</IonLabel>
            <IonInput
              value={length}
              onIonChange={(e) => setLength(parseFloat(e.detail.value!))}
              type="number"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Width:</IonLabel>
            <IonInput
              value={width}
              onIonChange={(e) => setWidth(parseFloat(e.detail.value!))}
              type="number"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Building Cost:</IonLabel>
            <IonInput
              value={buildingCost}
              onIonChange={(e) => setBuildingCost(parseFloat(e.detail.value!))}
              type="number"
            />
          </IonItem>

          <IonButton expand="block" onClick={calculate}>
            Calculate
          </IonButton>

          {results && (
            <IonCard>
              <IonCardContent>
                <IonText>
                  <div>
                    Engineering Cost: ${results.engineeringCost.toFixed(2)}
                  </div>
                  <div>
                    Structural Cost: ${results.structuralCost.toFixed(2)}
                  </div>
                  <div>
                    Foundation Cost: ${results.foundationCost.toFixed(2)}
                  </div>
                </IonText>
              </IonCardContent>
            </IonCard>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CostCalculator;
