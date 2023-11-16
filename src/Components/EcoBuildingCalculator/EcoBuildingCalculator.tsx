import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";

interface CalculationDetails {
  size: string;
  height: string;
  basePrice: number;
  windowPrice: number;
  windows: number;
  windowsCost: number;
  sideWallPrice: number;
  sideWall: number;
  sideWallCost: number;
  endWallPrice: number;
  endWall: number;
  endWallCost: number;
  legsPricePerSet: number;
  legs: number;
  legsCost: number;
  anchorsPriceEach: number;
  anchors: number;
  anchorsCost: number;
  total: number;
  baseLegs: number;
  baseLegsCost: number;
  additionalLegs: number;
  additionalLegsCost: number;
  stitchScrewsPriceEach: number;
  stitchScrews: number;
  stitchScrewsCost: number;
  structuralScrewsPriceEach: number;
  structuralScrews: number;
  structuralScrewsCost: number;
  tekScrewsPriceEach: number;
  tekScrews: number;
  tekScrewsCost: number;
  elbowBracePriceEach: number;
  elbowBrace: number;
  elbowBraceCost: number;
  rafterPriceEach: number;
  rafters: number;
  raftersCost: number;
  runners: number;
  runnersCost: number;
  runnersPriceEach: number;
}

// Eco building pricing data.
export const PRICING_DATA: any = {
  "12x20": {
    "Height A (8')": {
      "Base Price": 2495.0,
      Window: 385.0,
      Legs: 46.32,
      Anchor: 45.0, // 1 anchor per leg
      "Anchors w/ Concrete": 10, // 1 anchor per leg
      "Side Wall": 445.0,
      "Stitch Screws": 0.2, //20 screws
      "Strucutral Screws": 0.2, //80 screws
      "End Wall": 714.26,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
    "Height B (10')": {
      "Base Price": 2495.0,
      Window: 385.0,
      Legs: 57.9,
      Anchor: 45.0, // 1 anchor per leg
      "Anchors w/ Concrete": 10, // 1 anchor per leg
      "Side Wall": 583.0,
      "Stitch Screws": 0.6, //30 screws
      "Strucutral Screws": 0.2, //90 screws
      "End Wall": 783.46,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
    "Height C (12')": {
      "Base Price": 2495.0,
      Window: 385.0,
      Legs: 69.48,
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 715.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //100 screws
      "End Wall": 852.66,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
  },
  "18x20": {
    "Height A (8')": {
      "Base Price": 2695.0,
      Window: 385.0,
      Legs: 47.1, // set of 10
      Anchor: 45.0, // 1 anchor per leg
      "Anchors w/ Concrete": 10, // 1 anchor per leg
      "Side Wall": 445.0,
      "Stitch Screws": 0.2, //20 screws
      "Strucutral Screws": 0.2, //80 screws
      "End Wall": 909.38,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
    "Height B (10')": {
      "Base Price": 2695.0,
      Window: 385.0,
      Legs: 58.9, // set of 10
      Anchor: 45.0, // 1 anchor per leg
      "Anchors w/ Concrete": 10, // 1 anchor per leg
      "Side Wall": 583.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //90 screws
      "End Wall": 1006.76,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
    "Height C (12')": {
      "Base Price": 2695.0,
      Windows: 385.0,
      Legs: 70.68, // set of 10
      Anchor: 45.0, // 1 anchor per leg
      "Anchors w/ Concrete": 10,
      "Side Wall": 715.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //100 screws
      "End Wall": 1104.14,
      "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
      Rafter: 118.7, //5 rafters
      "Elbow Brace": 27, //6 braces
      Runners: 269.66,
    },
  },
  "20x20": {
    "Height A (8')": {
      "Base Price": 3095.0,
      Windows: 385.0,
      Legs: 47.1, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 445.0,
      "Stitch Screws": 0.2, //20 screws
      "Strucutral Screws": 0.2, //80 screws
      "End Wall": 952.46,
      "Tek Screws": 0.25, // 100 screws
      Rafter: 271.06, //5 rafters
      "Elbow Brace": 27, //10 braces
      Runners: 269.66,
    },
    "Height B (10')": {
      "Base Price": 3095.0,
      Windows: 385.0,
      Legs: 58.9, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 583.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //90 screws
      "End Wall": 1060.66,
      "Tek Screws": 0.25, //100 screws
      Rafter: 271.06, //5 rafters
      "Elbow Brace": 27, //10 braces
      Runners: 269.66,
    },
    "Height C (12')": {
      "Base Price": 3095.0,
      Windows: 385.0,
      Legs: 70.68, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 715.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //100 screws
      "End Wall": 1168.86,
      "Tek Screws": 0.25, //100 screws
      Rafter: 271.06, //5 rafters
      "Elbow Brace": 27, //10 braces
      Runners: 269.66,
    },
  },
  "24x20": {
    "Height A (8')": {
      "Base Price": 3795.0,
      Windows: 385.0,
      Legs: 47.1, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 445.0,
      "Stitch Screws": 0.2, //20 screws
      "Strucutral Screws": 0.2, //80 screws
      "End Wall": 1004.86,
      "Tek Screws": 0.25, //100 screws
      "Elbow Brace": 36, //6 braces
      Rafter: 300.06, //5 rafters
      Runners: 269.66,
    },
    "Height B (10')": {
      "Base Price": 3795.0,
      Windows: 385.0,
      Legs: 58.9, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 583.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //90 screws
      "End Wall": 1113.46,
      "Tek Screws": 0.25, //100 screws
      "Elbow Brace": 36, //6 braces
      Rafter: 300.06, //5 rafters
      Runners: 269.66,
    },
    "Height C (12')": {
      "Base Price": 3795.0,
      Windows: 385.0,
      Legs: 70.68, // set of 10
      Anchor: 45.0,
      "Anchors w/ Concrete": 10,
      "Side Wall": 715.0,
      "Stitch Screws": 0.2, //30 screws
      "Strucutral Screws": 0.2, //100 screws
      "End Wall": 1222.06,
      "Tek Screws": 0.25, //100 screws
      "Elbow Brace": 36, //6 braces
      Rafter: 300.06, //5 rafters
      Runners: 269.66,
    },
  },
};

const SIZES = ["12x20", "18x20", "20x20", "24x20"];
const HEIGHTS = ["Height A (8')", "Height B (10')", "Height C (12')"];
const GROUND_TYPE = {
  REGULAR: "Regular Ground",
  CONCRETE: "Concrete",
};

const EcoBuildingCalculator: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string>(SIZES[0]);
  const [selectedHeight, setSelectedHeight] = useState<string>(HEIGHTS[0]);
  const [windowQuantity, setWindowQuantity] = useState<number>(0);
  const [sideWallQuantity, setSideWallQuantity] = useState<number>(0);
  const [endWallQuantity, setEndWallQuantity] = useState<number>(0);
  const [groundType, setGroundType] = useState<string>(GROUND_TYPE.REGULAR);
  const [calculationDetails, setCalculationDetails] =
    useState<CalculationDetails | null>(null);
  const calculateTotalPrice = () => {
    const sizeData = PRICING_DATA[selectedSize];
    const heightData = sizeData[selectedHeight];
    const windowPrice = heightData.Window || heightData.Windows || 0;
    const windowsCost = windowPrice * windowQuantity;
    const sideWallCost = heightData["Side Wall"] * sideWallQuantity;
    const endWallCost = heightData["End Wall"] * endWallQuantity;

    // Determine the quantity of stitch screws and structural screws based on height
    let stitchScrewsQuantity = 0;
    let structuralScrewsQuantity = 0;
    let rafterQuantity = 5;
    let runnersQuantity = 2;
    let tekScrewsQuantity = 0;
    let elbowBraceQuantity = 0;
    if (selectedHeight === "Height A (8')") {
      stitchScrewsQuantity = 20; // 20 stitch screws for 8' height
      structuralScrewsQuantity = 80; // 80 structural screws for 8' height
    } else if (selectedHeight === "Height B (10')") {
      stitchScrewsQuantity = 30; // 30 stitch screws for 10' height
      structuralScrewsQuantity = 90; // 90 structural screws for 10' height
    } else if (selectedHeight === "Height C (12')") {
      stitchScrewsQuantity = 30; // 30 stitch screws for 12' height
      structuralScrewsQuantity = 100; // 100 structural screws for 12' height
    }

    if (selectedSize === "12x20") {
      tekScrewsQuantity = 72; // 72
      elbowBraceQuantity = 6; // 6 elbow braces
    } else if (selectedSize === "18x20") {
      tekScrewsQuantity = 72; // 72
      elbowBraceQuantity = 10; // 10 elbow braces
    } else if (selectedSize === "20x20") {
      tekScrewsQuantity = 100; // 100
      elbowBraceQuantity = 10; // 10 elbow braces
    } else if (selectedSize === "24x20") {
      tekScrewsQuantity = 100; // 100
      elbowBraceQuantity = 6; // 6 elbow braces
    }

    // Calculate costs for Tek Screws, Elbow Braces, and Rafters
    const tekScrewsPrice = heightData["Tek Screws"];
    const tekScrewsCost = tekScrewsPrice * tekScrewsQuantity; // Replace quantityNeeded with actual calculation
    const elbowBracePrice = heightData["Elbow Brace"];
    const elbowBraceCost = elbowBracePrice * elbowBraceQuantity; // Replace quantityNeeded with actual calculation
    const rafterPrice = heightData.Rafter;
    const raftersCost = rafterPrice * rafterQuantity; // Replace quantityNeeded with actual calculation

    //Calculate costs for runners
    const runnersPrice = heightData.Runners * runnersQuantity;

    // Calculate costs for stitch screws and structural screws
    const stitchScrewsPrice = heightData["Stitch Screws"];
    const stitchScrewsCost = stitchScrewsPrice * stitchScrewsQuantity;
    const structuralScrewsPrice = heightData["Strucutral Screws"];
    const structuralScrewsCost =
      structuralScrewsPrice * structuralScrewsQuantity;

    // Base 10 legs are included in every building package
    const baseLegs = 10;
    const baseLegsCost = heightData.Legs * baseLegs;

    // Additional legs cost if end walls are added
    const additionalLegs = 2 * endWallQuantity;
    const additionalLegsCost = heightData.Legs * additionalLegs;

    // Determine anchor price based on ground type
    const anchorPrice =
      groundType === GROUND_TYPE.CONCRETE
        ? heightData["Anchors w/ Concrete"]
        : heightData.Anchor;

    // Including the base 10 anchors, plus 2 anchors per end wall
    const totalAnchors = baseLegs + additionalLegs;
    const anchorsCost = anchorPrice * totalAnchors; // Cost for all anchors including the base 10

    // Calculate the total price
    const total =
      //! heightData["Base Price"] +
      windowsCost +
      sideWallCost +
      endWallCost +
      baseLegsCost +
      additionalLegsCost +
      anchorsCost +
      stitchScrewsCost +
      structuralScrewsCost +
      tekScrewsCost +
      elbowBraceCost +
      raftersCost +
      runnersPrice;

    // Set the calculation details
    setCalculationDetails({
      size: selectedSize,
      height: selectedHeight,
      basePrice: heightData["Base Price"],
      windowPrice: windowPrice,
      windows: windowQuantity,
      windowsCost: windowsCost,
      sideWallPrice: heightData["Side Wall"],
      sideWall: sideWallQuantity,
      sideWallCost: sideWallCost,
      endWallPrice: heightData["End Wall"],
      endWall: endWallQuantity,
      endWallCost: endWallCost,
      legsPricePerSet: heightData.Legs,
      legs: totalAnchors, // Updated to include the additional legs for end walls
      legsCost: baseLegsCost + additionalLegsCost,
      anchorsPriceEach: anchorPrice,
      anchors: totalAnchors, // Updated to reflect the total number of anchors
      anchorsCost: anchorsCost,
      baseLegs: baseLegs,
      baseLegsCost: heightData.Legs * 10,
      additionalLegs: additionalLegs,
      additionalLegsCost: additionalLegsCost,
      stitchScrewsPriceEach: stitchScrewsPrice,
      stitchScrews: stitchScrewsQuantity, // Replace with actual quantity
      stitchScrewsCost: stitchScrewsCost,
      structuralScrewsPriceEach: structuralScrewsPrice,
      structuralScrews: structuralScrewsQuantity, // Replace with actual quantity
      structuralScrewsCost: structuralScrewsCost,
      tekScrewsPriceEach: tekScrewsPrice,
      tekScrews: tekScrewsQuantity, // Replace with actual quantity
      tekScrewsCost: tekScrewsCost,
      elbowBracePriceEach: elbowBracePrice,
      elbowBrace: elbowBraceQuantity, // Replace with actual quantity
      elbowBraceCost: elbowBraceCost,
      rafterPriceEach: rafterPrice,
      rafters: rafterQuantity, // Replace with actual quantity
      raftersCost: raftersCost,
      runners: runnersQuantity,
      runnersCost: runnersPrice,
      runnersPriceEach: heightData.Runners,
      total: total,
    });
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">Select Size:</IonLabel>
            <IonSelect
              value={selectedSize}
              onIonChange={(e) => setSelectedSize(e.detail.value)}
            >
              {SIZES.map((size) => (
                <IonSelectOption key={size} value={size}>
                  {size}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Select Height:</IonLabel>
            <IonSelect
              value={selectedHeight}
              onIonChange={(e) => setSelectedHeight(e.detail.value)}
            >
              {HEIGHTS.map((height) => (
                <IonSelectOption key={height} value={height}>
                  {height}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Ground Type:</IonLabel>
            <IonSelect
              value={groundType}
              onIonChange={(e) => setGroundType(e.detail.value)}
            >
              <IonSelectOption value={GROUND_TYPE.REGULAR}>
                {GROUND_TYPE.REGULAR}
              </IonSelectOption>
              <IonSelectOption value={GROUND_TYPE.CONCRETE}>
                {GROUND_TYPE.CONCRETE}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Window Quantity:</IonLabel>
            <IonInput
              type="number"
              value={windowQuantity}
              onIonChange={(e: any) =>
                setWindowQuantity(parseInt(e.detail.value))
              }
              min="0"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Side Wall Quantity:</IonLabel>
            <IonInput
              type="number"
              value={sideWallQuantity}
              onIonChange={(e: any) =>
                setSideWallQuantity(parseInt(e.detail.value))
              }
              min="0"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">End Wall Quantity:</IonLabel>
            <IonInput
              type="number"
              value={endWallQuantity}
              onIonChange={(e: any) =>
                setEndWallQuantity(parseInt(e.detail.value))
              }
              min="0"
            />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonButton expand="full" onClick={calculateTotalPrice}>
            Calculate
          </IonButton>
        </IonCol>
      </IonRow>
      {calculationDetails && (
        <>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <h2>Building Details:</h2>
                  <p>Size: {calculationDetails.size}</p>
                  <p>Height: {calculationDetails.height}</p>
                  <p>
                    Base Price: ${calculationDetails.basePrice.toFixed(2)}{" "}
                    (Currently not included)
                  </p>
                  <p>
                    Base Legs (10 included): $
                    {calculationDetails.baseLegsCost.toFixed(2)}
                  </p>
                  <p>
                    Base Anchors (10 included): $
                    {calculationDetails.anchorsCost.toFixed(2)}
                  </p>
                  <p>
                    Stitch Screws (each): $
                    {calculationDetails.stitchScrewsPriceEach.toFixed(2)}x{" "}
                    {calculationDetails.stitchScrews} (Total: $
                    {calculationDetails.stitchScrewsCost.toFixed(2)})
                  </p>
                  <p>
                    Structural Screws (each): $
                    {calculationDetails.structuralScrewsPriceEach.toFixed(2)}x{" "}
                    {calculationDetails.structuralScrews} (Total: $
                    {calculationDetails.structuralScrewsCost.toFixed(2)})
                  </p>
                  <p>
                    Tek Screws (each): $
                    {calculationDetails.tekScrewsPriceEach.toFixed(2)}x{" "}
                    {calculationDetails.tekScrews} (Total: $
                    {calculationDetails.tekScrewsCost.toFixed(2)})
                  </p>
                  <p>
                    Elbow Braces (each): $
                    {calculationDetails.elbowBracePriceEach.toFixed(2)}x{" "}
                    {calculationDetails.elbowBrace} (Total: $
                    {calculationDetails.elbowBraceCost.toFixed(2)})
                  </p>
                  <p>
                    Rafters (each): $
                    {calculationDetails.rafterPriceEach.toFixed(2)}x{" "}
                    {calculationDetails.rafters} (Total: $
                    {calculationDetails.raftersCost.toFixed(2)})
                  </p>
                  <p>
                    Runners (2 @ 20'): $
                    {calculationDetails.runnersPriceEach.toFixed(2)} x{" "}
                    {calculationDetails.runners} (Total: $
                    {calculationDetails.runnersCost.toFixed(2)})
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <h2>Added Options:</h2>
                  <p>
                    Windows (each): ${calculationDetails.windowPrice.toFixed(2)}{" "}
                    x {calculationDetails.windows} (Total: $
                    {calculationDetails.windowsCost.toFixed(2)})
                  </p>
                  <p>
                    Side Walls (each): $
                    {calculationDetails.sideWallPrice.toFixed(2)} x{" "}
                    {calculationDetails.sideWall} (Total: $
                    {calculationDetails.sideWallCost.toFixed(2)})
                  </p>
                  <p>
                    End Walls (each): $
                    {calculationDetails.endWallPrice.toFixed(2)} x{" "}
                    {calculationDetails.endWall} (Total: $
                    {calculationDetails.endWallCost.toFixed(2)})
                  </p>

                  <p>
                    Additional Anchors (for end walls): $
                    {calculationDetails.anchorsPriceEach.toFixed(2)} x{" "}
                    {calculationDetails.endWall * 2} (Total: $
                    {(
                      calculationDetails.anchorsPriceEach *
                      calculationDetails.endWall *
                      2
                    ).toFixed(2)}
                    )
                  </p>
                  <p>
                    Additional Legs (for end walls): $
                    {calculationDetails.legsPricePerSet.toFixed(2)} x{" "}
                    {calculationDetails.additionalLegs} (Total: $
                    {calculationDetails.additionalLegsCost.toFixed(2)})
                  </p>

                  <p>Ground Type: {groundType}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent style={{ textAlign: "center" }}>
                  <h2>Total Cost:</h2>
                  <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                    ${calculationDetails.total.toFixed(2)}
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </>
      )}
    </IonGrid>
  );
};

export default EcoBuildingCalculator;
