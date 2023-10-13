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
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";

// Interface for a single component
export interface Component {
  price: string;
  name: string;
  amountPerCoil?: number;
}

// Interface for the array of components
export type Components = Component[];

// Add how many can fit in per coil in object
// Add history

const components: Components = [
  { price: "3.14", name: "C-1", amountPerCoil: 3 },
  { price: "1.57", name: "C-2", amountPerCoil: 3 },
  { price: "0.63", name: "C-3", amountPerCoil: 3 },
  { price: "1.05", name: "C-4" },
  { price: "1.57", name: "C-5" },
  { price: "1.57", name: "C-6" },
  { price: "1.05", name: "C-7" },
  { price: "1.57", name: "C-8" },
  { price: "1.05", name: "C-9" },
  { price: "1.05", name: "C-10" },
  { price: "1.05", name: "C-11" },
  { price: "0.79", name: "C-12" },
  { price: "0.39", name: "C-13" },
  { price: "0.79", name: "C-14" },
  { price: "0.52", name: "C-15" },
  { price: "1.57", name: "C-16" },
  { price: "0.79", name: "C-17" },
  { price: "0.31", name: "C-18" },
  { price: "0.39", name: "C-19" },
  { price: "0.79", name: "C-20" },
  { price: "0.79", name: "C-21" },
  { price: "0.35", name: "C-22" },
  { price: "0.79", name: "C-24" },
  { price: "0.79", name: "C-25" },
  { price: "0.52", name: "C-26" },
  { price: "0.52", name: "C-27" },
  { price: "0.52", name: "C-28" },
  { price: "1.05", name: "C-29" },
  { price: "1.05", name: "C-30" },
  { price: "1.05", name: "C-31" },
  { price: "0.29", name: "C-32" },
  { price: "0.79", name: "C-3BG" },
  { price: "1.05", name: "C-4A" },
  { price: "3.14", name: "R-3" },
  { price: "0.79", name: "R-4" },
  { price: "1.57", name: "R-5" },
  { price: "0.63", name: "R-6" },
  { price: "1.05", name: "R-7" },
  { price: "0.63", name: "R-8" },
  { price: "1.57", name: "R-9" },
  { price: "1.05", name: "R-10" },
  { price: "0.79", name: "R-11" },
  { price: "0.79", name: "R-12" },
  { price: "0.45", name: "R-13" },
  { price: "1.05", name: "R-14" },
  { price: "3.14", name: "R-15" },
  { price: "0.63", name: "R-16" },
  { price: "1.57", name: "R-18" },
  { price: "3.14", name: "R-19" },
  { price: "1.57", name: "R-20" },
  { price: "1.57", name: "R-21" },
  { price: "1.57", name: "R-22" },
];

const TrimCalculator: React.FC = () => {
  // Inputs
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [feet, setFeet] = useState<number>(0);
  const [inches, setInches] = useState<number>(0);
  const percentage = 5;

  const [results, setResults] = useState<{
    pricePerLinearFoot: number;
    totalPrice: number;
    linearFoot: number;
    totalPriceRounded: number;
    total: number;
  }>({
    pricePerLinearFoot: 0,
    totalPrice: 0,
    linearFoot: 0,
    totalPriceRounded: 0,
    total: 0,
  });

  const filteredComponents = components.filter((comp) =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const feetAndInchesToDecimal = (feet: number, inches: number) => {
    return feet + inches / 12;
  };

  const calculate = () => {
    const selectedComp = components.find(
      (comp) => comp.name === selectedComponent
    );
    const selectedComponentPrice = selectedComp?.price || "0";
    const amountPerCoil = selectedComp?.amountPerCoil || 1; // Defaulting to 1 if not available

    const pricePerLinearFoot = parseFloat(selectedComponentPrice) * percentage;
    const totalPrice = pricePerLinearFoot * quantity;
    const totalPriceRounded = Math.round(totalPrice * 100) / 100; // round to 2 decimal places
    const totalLinearFeet = feetAndInchesToDecimal(feet, inches);

    const total = (totalLinearFeet * quantity) / amountPerCoil; // Use amountPerCoil here

    setResults({
      pricePerLinearFoot,
      totalPrice,
      linearFoot: totalLinearFeet,
      totalPriceRounded,
      total,
    });
  };

  const reset = () => {
    setQuantity(0);
    setSelectedComponent("");
    setSearchTerm("");
    setResults({
      pricePerLinearFoot: 0,
      totalPrice: 0,
      linearFoot: 0,
      totalPriceRounded: 0,
      total: 0,
    });
  };

  const handleComponentChange = (e: CustomEvent) => {
    const selectedCompName = e.detail.value;
    setSelectedComponent(selectedCompName);
    const comp = components.find((comp) => comp.name === selectedCompName);
    if (comp) {
      const pricePerLinearFoot = parseFloat(comp.price) * percentage;
      setResults((prevResults) => ({
        ...prevResults,
        pricePerLinearFoot,
      }));
    }
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value!)}
            placeholder="Search for components"
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel>Component</IonLabel>
            <IonSelect
              value={selectedComponent}
              placeholder="Select a Component"
              onIonChange={handleComponentChange}
            >
              {filteredComponents.map((comp) => (
                <IonSelectOption key={comp.name} value={comp.name}>
                  {comp.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">
              <strong>QTY</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={quantity}
              onIonChange={(e) => setQuantity(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Length (Feet)</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={feet}
              onIonChange={(e) => setFeet(Number(e.detail.value))}
            ></IonInput>
          </IonItem>
        </IonCol>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">
              <strong>Length (Inches)</strong>
            </IonLabel>
            <IonInput
              type="number"
              value={inches}
              onIonChange={(e) => setInches(Number(e.detail.value))}
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
          <IonCard>
            <IonCardContent
              style={{
                textAlign: "center",
              }}
            >
              <strong>
                <h2>Price Per Linear Foot</h2>
              </strong>
              <strong
                style={{
                  fontSize: "2rem",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                ${results.pricePerLinearFoot.toFixed(2)}{" "}
                <IonText style={{ fontSize: "1rem" }}>/lnft</IonText>
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol>
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <strong>
                <h2>Total Price</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                ${results.totalPriceRounded.toFixed(2)}
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol>
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <strong>
                <h2>Linear Foot</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                {results.total.toFixed(2)}'
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TrimCalculator;
