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
  IonItemDivider,
  IonList,
} from "@ionic/react";
import React, { useState } from "react";

// Interface for a single component
export interface Component {
  price: string;
  name: string;
  amountPerCoil?: number;
  gauge: string;
}

// Interface for the array of components
export type Components = Component[];

// TODO: Add history``

const components: Components = [
  { name: "C-1", amountPerCoil: 1, price: "3.14", gauge: "26" },
  { name: "C-2", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "C-3", amountPerCoil: 5, price: "0.63", gauge: "26" },
  { name: "C-4", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-5", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "C-6", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "C-7", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-8", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "C-9", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-10", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-11", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-12", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-13", amountPerCoil: 8, price: "0.39", gauge: "26" },
  { name: "C-14", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-15", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "C-16", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "C-17", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-18", amountPerCoil: 10, price: "0.31", gauge: "26" },
  { name: "C-19", amountPerCoil: 8, price: "0.39", gauge: "26" },
  { name: "C-20", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-21", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-22", amountPerCoil: 9, price: "0.35", gauge: "26" },
  { name: "C-24", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-25", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-26", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "C-27", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "C-28", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "C-29", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-30", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-31", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "C-32", amountPerCoil: 11, price: "0.29", gauge: "26" },
  { name: "C-3BG", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "C-4A", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-3", amountPerCoil: 1, price: "3.14", gauge: "26" },
  { name: "R-4", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-5", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "R-6", amountPerCoil: 5, price: "0.63", gauge: "26" },
  { name: "R-7", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-8", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-9", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-10", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "R-11", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-12", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-13", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "R-14", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "R-15", amountPerCoil: 2, price: "1.57", gauge: "26" },
  { name: "R-16", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-17", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-18", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-19", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-20", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-21", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-22", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-23", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-24", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-25", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-26", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-27", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-28", amountPerCoil: 6, price: "0.52", gauge: "26" },
  { name: "R-29", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-30", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-31", amountPerCoil: 3, price: "1.05", gauge: "26" },
  { name: "R-32", amountPerCoil: 11, price: "0.29", gauge: "26" },
  { name: "R-3BG", amountPerCoil: 4, price: "0.79", gauge: "26" },
  { name: "R-4A", amountPerCoil: 3, price: "1.05", gauge: "26" },
  {
    name: "26 GA Comm. Downspouts",
    amountPerCoil: 1,
    price: "6.28",
    gauge: "26",
  },
  {
    name: "26 GA 1:12 HHR Comm. Gutters",
    amountPerCoil: 1,
    price: "6.28",
    gauge: "26",
  },
  {
    name: "26 GA 2:12 HHR Comm. Gutters",
    amountPerCoil: 1,
    price: "6.28",
    gauge: "26",
  },
  {
    name: "26 GA 3:12 HHR Comm. Gutters",
    amountPerCoil: 1,
    price: "6.28",
    gauge: "26",
  },
  {
    name: "26 GA 4:12 HHR Comm. Gutters",
    amountPerCoil: 1,
    price: "12.56",
    gauge: "26",
  },
  {
    name: "26 GA 1:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "12.56",
    gauge: "26",
  },
  {
    name: "26 GA 2:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "12.56",
    gauge: "26",
  },
  {
    name: "26 GA 3:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "12.56",
    gauge: "26",
  },
  {
    name: "26 GA 4:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "12.56",
    gauge: "26",
  },
  {
    name: "24 GA Comm. Downspout",
    amountPerCoil: 1,
    price: "10.32",
    gauge: "24",
  },
  {
    name: "24 GA 1:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "10.32",
    gauge: "24",
  },
  {
    name: "24 GA 2:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "10.32",
    gauge: "24",
  },
  {
    name: "24 GA 3:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "10.32",
    gauge: "24",
  },
  {
    name: "24 GA 4:12 RSS Comm. Gutters",
    amountPerCoil: 1,
    price: "10.32",
    gauge: "24",
  },
];

const TrimCalculator: React.FC = () => {
  // Inputs
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [feet, setFeet] = useState<number>(0);
  const [inches, setInches] = useState<number>(0);
  const [gaugeFilter, setGaugeFilter] = useState<string>("ALL");

  type HistoryItem = {
    date: Date;
    component: string;
    quantity: number;
    feet: number;
    inches: number;
    results: {
      pricePerLinearFoot: number;
      totalPrice: number;
      linearFoot: number;
      totalPriceRounded: number;
      total: number;
      totalLinearFeetNeeded: number;
      coil: number;
    };
  };

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const percentage = 5;

  const [results, setResults] = useState<{
    pricePerLinearFoot: number;
    totalPrice: number;
    linearFoot: number;
    totalPriceRounded: number;
    total: number;
    totalLinearFeetNeeded: number;
    coil: number;
  }>({
    pricePerLinearFoot: 0,
    totalPrice: 0,
    linearFoot: 0,
    totalPriceRounded: 0,
    total: 0,
    totalLinearFeetNeeded: 0,
    coil: 0,
  });

  const filteredComponents = components.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (gaugeFilter === "ALL" || comp.gauge === gaugeFilter)
  );

  const feetAndInchesToDecimal = (feet: number, inches: number) => {
    return feet + inches / 12;
  };
  const clearHistory = () => {
    setHistory([]);
  };

  const calculate = () => {
    if (quantity === 0 && feet === 0 && inches === 0) {
      return;
    }
    const selectedComp = components.find(
      (comp) => comp.name === selectedComponent
    );
    const selectedComponentPrice = selectedComp?.price || "0";
    const amountPerCoil = selectedComp?.amountPerCoil || 1; // Defaulting to 1 if not available

    const pricePerLinearFoot = parseFloat(selectedComponentPrice) * percentage;
    const linearFeet = feetAndInchesToDecimal(feet, inches);
    const totalLinearFeetNeeded = linearFeet * quantity;
    const totalPrice = totalLinearFeetNeeded * pricePerLinearFoot;
    const totalPriceRounded = Math.round(totalPrice * 100) / 100; // round to 2 decimal places
    const total = (linearFeet * quantity) / amountPerCoil; // Use amountPerCoil here
    const coil = totalLinearFeetNeeded / selectedComp?.amountPerCoil!;

    setResults({
      pricePerLinearFoot,
      totalPrice,
      linearFoot: linearFeet,
      totalPriceRounded,
      total,
      totalLinearFeetNeeded,
      coil,
    });

    setHistory((prevHistory) => [
      ...prevHistory,
      {
        date: new Date(),
        component: selectedComponent,
        quantity,
        feet,
        inches,
        results: {
          pricePerLinearFoot,
          totalPrice,
          linearFoot: linearFeet,
          totalPriceRounded,
          total,
          totalLinearFeetNeeded,
          coil,
        },
      },
    ]);
  };

  const reset = () => {
    setQuantity(0);
    setSelectedComponent("");
    setSearchTerm("");
    setFeet(0);
    setInches(0);
    setResults({
      pricePerLinearFoot: 0,
      totalPrice: 0,
      linearFoot: 0,
      totalPriceRounded: 0,
      total: 0,
      totalLinearFeetNeeded: 0,
      coil: 0,
    });
  };

  const handleComponentChange = (e: CustomEvent) => {
    const selectedCompName = e.detail.value;
    setSelectedComponent(selectedCompName);
    const comp = components.find((comp) => comp.name === selectedCompName);
    if (comp) {
      const pricePerLinearFoot = parseFloat(comp.price);
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
            <IonLabel>Gauge Filter</IonLabel>
            <IonSelect
              value={gaugeFilter}
              placeholder="Select Gauge"
              onIonChange={(e) => setGaugeFilter(e.detail.value)}
            >
              <IonSelectOption value="ALL">ALL</IonSelectOption>
              <IonSelectOption value="24">24 Gauge</IonSelectOption>
              <IonSelectOption value="26">26 Gauge</IonSelectOption>
            </IonSelect>
          </IonItem>
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
                <h2>LF Decimal</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                {results.linearFoot.toFixed(2)}'
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol>
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <strong>
                <h2>Total Linear Feet</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                {results.totalLinearFeetNeeded.toFixed(2)}'
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol>
          <IonCard style={{ textAlign: "center" }}>
            <IonCardContent>
              <strong>
                <h2>Coil Needed</h2>
              </strong>
              <strong style={{ fontSize: "2rem" }}>
                {results.coil.toFixed(2)}'
              </strong>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardContent>
              <IonList>
                <div>
                  <h2>Calculation History</h2>
                  <IonButton
                    expand="full"
                    color="warning"
                    onClick={clearHistory}
                  >
                    Clear History
                  </IonButton>
                </div>
                {history.map((item: any, index: number) => (
                  <IonItem>
                    <IonGrid key={index}>
                      <IonRow>
                        <IonCol>
                          <strong>Component:</strong> {item.component}
                        </IonCol>
                        <IonCol>
                          <strong>Quantity:</strong> {item.quantity}
                        </IonCol>
                        <IonCol>
                          <strong>Length:</strong> {item.feet}'{item.inches}"
                        </IonCol>
                        <IonCol>
                          <strong>Total Price:</strong> $
                          {item.results.totalPriceRounded.toFixed(2)}
                        </IonCol>
                        <IonCol>
                          <strong>Total Linear Feet:</strong>
                          {item.results.totalLinearFeetNeeded.toFixed(2)}'
                        </IonCol>
                        <IonCol>
                          <strong>Coil Needed:</strong>{" "}
                          {item.results.coil.toFixed(2)}'
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TrimCalculator;
