import React, { useState } from "react";
import {
  InputChangeEventDetail,
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import {
  AggregatedBreakdownDetail,
  AggregatedDetails,
  BreakdownDetail,
} from "./types";

import { BASE_UNIT_COSTS, BASE_SIZE } from "./PricingData";
import * as XLSX from "xlsx";

const Quotes = () => {
  const GROUND_TYPE = { REGULAR: "Regular", CONCRETE: "Concrete" };

  const [width, setWidth] = useState("0");
  const [length, setLength] = useState("0");
  const [height, setHeight] = useState("0");
  const [groundType, setGroundType] = useState(GROUND_TYPE.REGULAR);
  const [windowQuantity, setWindowQuantity] = useState(0);
  const [sideWallQuantity, setSideWallQuantity] = useState(0);
  const [endWallQuantity, setEndWallQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownDetail[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const calculateTotalCost = () => {
    const numWidth = parseInt(width);
    const numLength = parseInt(length);
    const numHeight = parseInt(height);
    // Calculate the number of grid lines
    const gridLines = Math.ceil(numLength / 5);
    let calculatedTotalCost = 0;
    let breakdownDetails = [];
    const legsPerRunner = Math.ceil(numLength / 5);

    if (numWidth < 10 || numWidth > 30 || isNaN(numWidth)) {
      setAlertMessage("Width must be between 10' and 30'.");
      setShowAlert(true);
      return;
    }
    if (numLength < 10 || numLength > 100 || isNaN(numLength)) {
      setAlertMessage("Length must be between 10' and 100'.");
      setShowAlert(true);
      return;
    }
    if (numHeight < 6 || numHeight > 12 || isNaN(numHeight)) {
      setAlertMessage("Height must be between 6' and 12'.");
      setShowAlert(true);
      return;
    }

    // Runner calculations
    const totalRunnerLF = numLength * 2; // Two runners per building
    const runnerPieces = Math.ceil(totalRunnerLF / 20); // Each piece up to 20'
    let runnerCost = 0;

    // Adding runner breakdown details
    for (let i = 0; i < runnerPieces; i++) {
      const runnerLF = i === runnerPieces - 1 ? totalRunnerLF - 20 * i : 20;
      const runnerCostPerPiece = runnerLF * BASE_UNIT_COSTS["Runner"];
      runnerCost += runnerCostPerPiece;

      breakdownDetails.push({
        item: "Runner",
        quantity: 1,
        unitPrice: BASE_UNIT_COSTS["Runner"],
        total: runnerCostPerPiece,
        linearFeet: runnerLF,
      });
    }

    // Hat channel calculations
    const hatChannelSpacing = 3; // Every 3 feet
    const maxHatChannelLength = 21; // Maximum length of a hat channel piece
    const numberOfHatChannels = Math.ceil(numWidth / hatChannelSpacing);
    let hatChannelCost = 0;

    for (let i = 0; i < numberOfHatChannels; i++) {
      const channelLength = Math.min(numLength, maxHatChannelLength);
      hatChannelCost += channelLength * BASE_UNIT_COSTS["HatChannel"];

      breakdownDetails.push({
        item: "Hat Channel",
        quantity: 1,
        unitPrice: BASE_UNIT_COSTS["HatChannel"],
        total: channelLength * BASE_UNIT_COSTS["HatChannel"],
        linearFeet: channelLength,
      });
    }

    // Calculate total number of legs (5' increments)
    const totalLegs = Math.ceil(totalRunnerLF / 5);

    // Determine anchor type and cost
    let anchorType = "";
    let anchorCostPerUnit = 0;
    if (groundType === GROUND_TYPE.REGULAR) {
      anchorType = '30" Rebar Anchor';
      anchorCostPerUnit = BASE_UNIT_COSTS["RebarAnchor"];
    } else if (groundType === GROUND_TYPE.CONCRETE) {
      anchorType = "Concrete Anchor";
      anchorCostPerUnit = BASE_UNIT_COSTS["ConcreteAnchor"];
    }
    const totalAnchorCost = totalLegs * anchorCostPerUnit;

    // Add anchors to breakdown details
    breakdownDetails.push({
      item: anchorType,
      quantity: totalLegs,
      unitPrice: anchorCostPerUnit,
      total: totalAnchorCost,
    });

    // Determine cost per leg
    const legCostPerUnit = BASE_UNIT_COSTS["Leg"];
    const totalLegCost = totalLegs * legCostPerUnit;

    // Add legs to breakdown details
    breakdownDetails.push({
      item: "Leg",
      quantity: totalLegs,
      unitPrice: legCostPerUnit,
      total: totalLegCost,
      linearFeet: numHeight,
    });
    // Calculate AngleClips required for each leg
    const angleClipQuantity = totalLegs * 4; // 4 AngleClips per leg
    const angleClipCost = angleClipQuantity * BASE_UNIT_COSTS["AngleClip"];
    breakdownDetails.push({
      item: "AngleClip",
      quantity: angleClipQuantity,
      unitPrice: BASE_UNIT_COSTS["AngleClip"],
      total: angleClipCost,
    });

    // Calculate TubeCaps required for each runner
    const tubeCapQuantity = runnerPieces * 2; // 2 TubeCaps per runner
    const tubeCapCost = tubeCapQuantity * BASE_UNIT_COSTS["TubeCap"];
    breakdownDetails.push({
      item: "TubeCap",
      quantity: tubeCapQuantity,
      unitPrice: BASE_UNIT_COSTS["TubeCap"],
      total: tubeCapCost,
    });

    // Calculate King Pins
    const kingPinLength = 3; // Default value of 3 feet
    const totalKingPinLF = gridLines * kingPinLength;
    const kingPinCost = totalKingPinLF * BASE_UNIT_COSTS["KingPin"];
    breakdownDetails.push({
      item: "King Pin",
      quantity: gridLines,
      unitPrice: BASE_UNIT_COSTS["KingPin"],
      total: kingPinCost,
      linearFeet: kingPinLength,
    });

    // Calculate R1s
    const r1Length = 4; // Default value of 4 feet
    const totalR1LF = gridLines * r1Length;
    const r1Cost = totalR1LF * BASE_UNIT_COSTS["R1Peak"];
    breakdownDetails.push({
      item: "R1 Peak",
      quantity: gridLines,
      unitPrice: BASE_UNIT_COSTS["R1Peak"],
      total: r1Cost,
      linearFeet: r1Length,
    });

    // Calculate Straight Clips for each King Pin
    const straightClipQuantity = gridLines * 4; // 4 Straight Clips per King Pin
    const straightClipCost =
      straightClipQuantity * BASE_UNIT_COSTS["StraightClip"];
    breakdownDetails.push({
      item: "Straight Clip",
      quantity: straightClipQuantity,
      unitPrice: BASE_UNIT_COSTS["StraightClip"],
      total: straightClipCost,
    });

    //! Update total cost
    calculatedTotalCost +=
      runnerCost +
      hatChannelCost +
      totalAnchorCost +
      totalLegCost +
      angleClipCost +
      tubeCapCost +
      kingPinCost +
      r1Cost +
      straightClipCost;

    // Add window to breakdown
    if (windowQuantity > 0) {
      const windowTotalCost = windowQuantity * BASE_UNIT_COSTS["Window"];
      breakdownDetails.push({
        item: "Window",
        quantity: windowQuantity,
        unitPrice: BASE_UNIT_COSTS["Window"],
        total: windowTotalCost,
      });
      calculatedTotalCost += windowTotalCost;
    }

    setTotalCost(calculatedTotalCost);
    setBreakdown(breakdownDetails);
  };

  const resetCalculator = () => {
    setWidth("");
    setLength("");
    setHeight("");
    setGroundType(GROUND_TYPE.REGULAR);
    setWindowQuantity(0);
    setSideWallQuantity(0);
    setEndWallQuantity(0);
    setTotalCost(0);
    setBreakdown([]);
  };
  const getAggregatedBreakdown = (): AggregatedBreakdownDetail[] => {
    const aggregatedDetails: AggregatedDetails = {};

    breakdown.forEach((detail) => {
      const key = `${detail.item}${
        detail.linearFeet ? `_${detail.linearFeet}` : ""
      }`;
      if (!aggregatedDetails[key]) {
        aggregatedDetails[key] = { ...detail, count: 1 };
      } else {
        aggregatedDetails[key].quantity += detail.quantity;
        aggregatedDetails[key].total += detail.total;
        aggregatedDetails[key].count += 1;
      }
    });

    return Object.values(aggregatedDetails);
  };

  const aggregatedBreakdown = getAggregatedBreakdown();

  // Function to download the file
  const downloadFile = (workbook: any, filename: any) => {
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">Width (Min: 10', Max: 30'):</IonLabel>
            <IonInput
              type="number"
              value={width}
              onIonChange={(e) => setWidth(e.detail.value ?? "")}
              min={10}
              max={30}
              defaultValue={0}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              Length (Min: 10', Max: 100'):
            </IonLabel>
            <IonInput
              type="number"
              value={length}
              onIonChange={(e) => setLength(e.detail.value ?? "")}
              min={10}
              max={100}
              defaultValue={0}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Height (Min: 6', Max: 12'):</IonLabel>
            <IonInput
              type="number"
              value={height}
              onIonChange={(e) => setHeight(e.detail.value ?? "")}
              min={6}
              max={12}
              defaultValue={0}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Ground Type:</IonLabel>
            <IonSelect
              value={groundType}
              onIonChange={(e) => setGroundType(e.detail.value as string)}
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
              onIonChange={(e) =>
                setWindowQuantity(parseInt(e.detail.value ?? "0"))
              }
              min="0"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Side Wall Quantity:</IonLabel>
            <IonInput
              type="number"
              value={sideWallQuantity}
              onIonChange={(e) =>
                setSideWallQuantity(parseInt(e.detail.value ?? "0"))
              }
              min="0"
              max="2"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">End Wall Quantity:</IonLabel>
            <IonInput
              type="number"
              value={endWallQuantity}
              onIonChange={(e) =>
                setEndWallQuantity(parseInt(e.detail.value ?? "0"))
              }
              min="0"
              max="2"
            />
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonButton color="primary" expand="full" onClick={calculateTotalCost}>
            Calculate Total
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton color="secondary" expand="full" onClick={resetCalculator}>
            Reset
          </IonButton>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Cost Breakdown</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {aggregatedBreakdown.map((detail, index) => (
                <div key={index}>
                  <p>
                    {detail.item}: Quantity: {detail.quantity},
                    {detail.linearFeet ? ` LF: ${detail.linearFeet}', ` : ""}
                    Unit Price: ${detail.unitPrice.toFixed(2)}, Total: $
                    {detail.total.toFixed(2)}
                  </p>
                </div>
              ))}
              <p>
                <strong>Total Cost: ${totalCost.toFixed(2)}</strong>
              </p>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Alert"}
        message={alertMessage}
        buttons={["OOPS"]}
      />
    </div>
  );
};

export default Quotes;
