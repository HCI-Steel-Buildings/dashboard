import React, { useState } from "react";
import {
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
  const [buildingLength, setBuildingLength] = useState("0");
  const [height, setHeight] = useState("0");
  const [groundType, setGroundType] = useState(GROUND_TYPE.REGULAR);
  const [windowQuantity, setWindowQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownDetail[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const WALL_OPTIONS = {
    NONE: "0'",
    THREE_FEET: "3'",
    SIX_FEET: "6'",
    NINE_FEET: "9'",
    FULLY_ENCLOSED: "Fully Enclosed",
  };

  const [leftWall, setLeftWall] = useState(WALL_OPTIONS.NONE);
  const [rightWall, setRightWall] = useState(WALL_OPTIONS.NONE);
  const [frontWall, setFrontWall] = useState(WALL_OPTIONS.NONE);
  const [rearWall, setRearWall] = useState(WALL_OPTIONS.NONE);

  const calculateTotalCost = () => {
    const numWidth = parseInt(width);
    const numLength = parseInt(buildingLength);
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
    let hatChannelQuantity = 0;
    if (numWidth < 16) {
      hatChannelQuantity = 6;
    } else if (numWidth <= 24) {
      hatChannelQuantity = 8;
    } else {
      hatChannelQuantity = 12;
    }

    for (let i = 0; i < hatChannelQuantity; i++) {
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
    const totalLegLF = totalLegs * numHeight; // Total linear feet for all legs
    const totalLegCost = totalLegLF * legCostPerUnit; // Total cost for legs

    // Add legs to breakdown details
    breakdownDetails.push({
      item: "Leg",
      quantity: totalLegs,
      unitPrice: legCostPerUnit,
      total: totalLegCost,
      linearFeet: numHeight, // Individual leg height
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
    const r1Quantity = gridLines;
    breakdownDetails.push({
      item: "R1 Peak",
      quantity: gridLines,
      unitPrice: BASE_UNIT_COSTS["R1Peak"],
      total: r1Cost,
      linearFeet: r1Length,
    });

    // Calculate number of roof braces.
    // Ensure that roofBraceQuantity does not go below 0
    const roofBraceQuantity = r1Quantity; // One roof brace per R1
    const roofBraceLength = 3; // Each roof brace is 3 feet long
    const totalRoofBraceLF = roofBraceQuantity * roofBraceLength;
    const roofBraceCost = totalRoofBraceLF * BASE_UNIT_COSTS["RoofBrace"];

    // Add roof braces to breakdown details
    if (roofBraceQuantity > 0) {
      breakdownDetails.push({
        item: "Roof Brace",
        quantity: roofBraceQuantity,
        unitPrice: BASE_UNIT_COSTS["RoofBrace"],
        total: roofBraceCost,
        linearFeet: roofBraceLength,
      });
    }

    // Calculate R2
    const PITCH_RISE = 3;
    const PITCH_RUN = 12;

    const calculateTriangleDimensions = (
      bottomSide: number,
      pitchRise: number,
      pitchRun: number
    ) => {
      const theta = Math.atan(pitchRise / pitchRun);
      const height = bottomSide * Math.tan(theta);
      const hypotenuse = bottomSide / Math.cos(theta);

      return { height, hypotenuse };
    };
    const decimalFeetToFeetInches = (decimalFeet: any) => {
      const totalInches = decimalFeet * 12;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}' ${inches}"`;
    };
    // Inside calculateTotalCost function, after calculating other costs
    const r2HypotenuseLength = calculateTriangleDimensions(
      numWidth / 2,
      PITCH_RISE,
      PITCH_RUN
    ).hypotenuse;
    const r2LengthPerPiece = Math.max(r2HypotenuseLength - 24 / 12, 0); // Subtract 24inches, converted to feet
    const r2Quantity = gridLines * 2; // Twice the quantity of R1
    const totalR2LF = r2Quantity * r2LengthPerPiece;
    const r2Cost = totalR2LF * BASE_UNIT_COSTS["R2"]; // Calculate cost based on per foot price

    const r2LengthPerPieceInFeetInches =
      decimalFeetToFeetInches(r2LengthPerPiece);
    breakdownDetails.push({
      item: "R2",
      quantity: r2Quantity,
      unitPrice: BASE_UNIT_COSTS["R2"],
      total: r2Cost,
      linearFeet: r2LengthPerPieceInFeetInches, // Display as feet and inches
    });
    // Calculate Roof Sheathing
    const roofSheetWidth = 2.5; // Width of each roof sheet
    const totalRoofSheets = Math.ceil(numLength / roofSheetWidth) * 2; // Total number of roof sheets for both sides
    const roofSheetLengthInDecimalFeet = Math.min(r2LengthPerPiece + 2, 21); // Max length of roof sheet is 21 feet
    const roofSheetLengthInFeetInches = decimalFeetToFeetInches(
      roofSheetLengthInDecimalFeet
    );

    const roofSheetCostPerSheet =
      roofSheetLengthInDecimalFeet * BASE_UNIT_COSTS["RoofSheet"];
    const totalRoofSheetCost = totalRoofSheets * roofSheetCostPerSheet; // Total cost for all roof sheets

    // Add Roof Sheathing to breakdown details
    breakdownDetails.push({
      item: "Roof Sheathing",
      quantity: totalRoofSheets,
      unitPrice: roofSheetCostPerSheet,
      total: totalRoofSheetCost,
      linearFeet: roofSheetLengthInFeetInches, // Length of each roof sheet in feet and inches
    });

    // Calculate KneeBrace for each R2
    const kneeBraceQuantity = r2Quantity; // One KneeBrace per R2
    const kneeBraceCost = kneeBraceQuantity * BASE_UNIT_COSTS["KneeBrace"];

    // Add KneeBrace cost to the total cost
    calculatedTotalCost += kneeBraceCost;

    // Add KneeBrace to breakdown details
    breakdownDetails.push({
      item: "KneeBrace",
      quantity: kneeBraceQuantity,
      unitPrice: BASE_UNIT_COSTS["KneeBrace"],
      total: kneeBraceCost,
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

    let leftWallCost = 0;
    let rightWallCost = 0;
    const calculateSidewallSheets = (
      wallSelection: any,
      buildingLength: any
    ) => {
      let wallHeightFeet = 0;
      switch (wallSelection) {
        case WALL_OPTIONS.THREE_FEET:
          wallHeightFeet = 3;
          break;
        case WALL_OPTIONS.SIX_FEET:
          wallHeightFeet = 6;
          break;
        case WALL_OPTIONS.NINE_FEET:
          wallHeightFeet = 9;
          break;
        case WALL_OPTIONS.FULLY_ENCLOSED:
          wallHeightFeet = numHeight; // Assuming fully enclosed means up to the building height
          break;
        default:
          wallHeightFeet = 0;
      }

      const panelsPerSection = Math.ceil(wallHeightFeet / 3); // 3' width per panel
      const sections = Math.ceil(buildingLength / 21); // Max length per panel is 21'
      const totalPanels = panelsPerSection * sections;

      const sheets = [];
      let remainingLength = buildingLength;

      for (let i = 0; i < totalPanels; i++) {
        let sheetLength = Math.min(21, remainingLength);
        sheets.push({
          height: wallHeightFeet,
          length: sheetLength,
        });
        remainingLength -= sheetLength;
      }

      return sheets;
    };
    const calculateFrontRearWallCost = (
      wallSelection: any,
      buildingWidth: any
    ) => {
      let wallCost = 0;
      let totalWallLF = 0;
      const wallSheets = calculateSidewallSheets(wallSelection, buildingWidth);
      wallSheets.forEach((sheet) => {
        totalWallLF += sheet.length;
      });
      wallCost =
        totalWallLF * wallSheets.length * BASE_UNIT_COSTS["SidewallSheet"];

      return {
        cost: wallCost,
        linearFeet: wallSheets.length > 0 ? `${wallSheets[0].length}'` : "0'",
        quantity: wallSheets.length,
      };
    };

    // Inside calculateTotalCost function
    // Left Wall Sheets
    let totalLeftWallLF = 0;
    const leftWallSheets = calculateSidewallSheets(leftWall, numLength);
    leftWallSheets.forEach((sheet) => {
      totalLeftWallLF += sheet.length;
    });
    leftWallCost =
      totalLeftWallLF *
      leftWallSheets.length *
      BASE_UNIT_COSTS["SidewallSheet"];

    if (leftWallSheets.length > 0) {
      breakdownDetails.push({
        item: `Left Wall Sidewall Sheets`,
        quantity: leftWallSheets.length,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: leftWallCost,
        linearFeet: `${leftWallSheets[0].length}`, // Display LF of each sheet
      });
    }

    // Right Wall Sheets
    let totalRightWallLF = 0;
    const rightWallSheets = calculateSidewallSheets(rightWall, numLength);
    rightWallSheets.forEach((sheet) => {
      totalRightWallLF += sheet.length;
    });
    rightWallCost =
      totalRightWallLF *
      rightWallSheets.length *
      BASE_UNIT_COSTS["SidewallSheet"];

    if (rightWallSheets.length > 0) {
      breakdownDetails.push({
        item: `Right Wall Sidewall Sheets`,
        quantity: rightWallSheets.length,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: rightWallCost,
        linearFeet: `${rightWallSheets[0].length}`, // Display LF of each sheet
      });
    }
    // Calculate costs for front and rear walls
    const frontWallData = calculateFrontRearWallCost(frontWall, numWidth);
    if (frontWallData.quantity > 0) {
      breakdownDetails.push({
        item: `Front Wall Sheets`,
        quantity: frontWallData.quantity,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: frontWallData.cost,
        linearFeet: frontWallData.linearFeet,
      });
    }

    const rearWallData = calculateFrontRearWallCost(rearWall, numWidth);
    if (rearWallData.quantity > 0) {
      breakdownDetails.push({
        item: `Rear Wall Sheets`,
        quantity: rearWallData.quantity,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: rearWallData.cost,
        linearFeet: rearWallData.linearFeet,
      });
    }
    // Inside calculateTotalCost function, after existing calculations
    // Calculate Tek Screws
    const tekScrewCostPerUnit = BASE_UNIT_COSTS["TekScrew"];
    let totalTekScrews = 0;
    let tekScrewCost = 0;

    // Tek Screws for AngleClips
    const tekScrewsForAngleClips = angleClipQuantity * 4;
    totalTekScrews += tekScrewsForAngleClips;

    // Tek Screws for Straight Clips
    const tekScrewsForStraightClips = straightClipQuantity * 4;
    totalTekScrews += tekScrewsForStraightClips;

    // Tek Screws for R1s
    const tekScrewsForR2s = gridLines * 32; // Assuming one R1 per grid line
    totalTekScrews += tekScrewsForR2s;

    // Tek Screws for Roof Braces
    const tekScrewsForRoofBraces = roofBraceQuantity * 8; // 8 Tek Screws per Roof Brace
    totalTekScrews += tekScrewsForRoofBraces;

    tekScrewCost = totalTekScrews * tekScrewCostPerUnit;

    // Add Tek Screws to breakdown details
    breakdownDetails.push({
      item: "Tek Screw",
      quantity: totalTekScrews,
      unitPrice: tekScrewCostPerUnit,
      total: tekScrewCost,
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
      straightClipCost +
      r2Cost +
      kneeBraceCost +
      rightWallCost +
      leftWallCost +
      tekScrewCost +
      frontWallData.cost +
      rearWallData.cost +
      roofBraceCost +
      totalRoofSheetCost;
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

  // Repeat for rightWall, frontWall, and rearWall

  const resetCalculator = () => {
    setWidth("");
    setBuildingLength("");
    setHeight("");
    setGroundType(GROUND_TYPE.REGULAR);
    setWindowQuantity(0);
    setTotalCost(0);
    setLeftWall(WALL_OPTIONS.NONE);
    setRightWall(WALL_OPTIONS.NONE);
    setFrontWall(WALL_OPTIONS.NONE);
    setRearWall(WALL_OPTIONS.NONE);
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
              value={buildingLength}
              onIonChange={(e) => setBuildingLength(e.detail.value ?? "")}
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
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Left Wall:</IonLabel>
                <IonSelect
                  value={leftWall}
                  onIonChange={(e) => setLeftWall(e.detail.value)}
                >
                  {Object.values(WALL_OPTIONS).map((option) => (
                    <IonSelectOption key={`left-${option}`} value={option}>
                      {option}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Right Wall:</IonLabel>
                <IonSelect
                  value={rightWall}
                  onIonChange={(e) => setRightWall(e.detail.value)}
                >
                  {Object.values(WALL_OPTIONS).map((option) => (
                    <IonSelectOption key={`right-${option}`} value={option}>
                      {option}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Front Wall:</IonLabel>
                <IonSelect
                  value={frontWall}
                  onIonChange={(e) => setFrontWall(e.detail.value)}
                >
                  {Object.values(WALL_OPTIONS).map((option) => (
                    <IonSelectOption key={`front-${option}`} value={option}>
                      {option}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked">Rear Wall:</IonLabel>
                <IonSelect
                  value={rearWall}
                  onIonChange={(e) => setRearWall(e.detail.value)}
                >
                  {Object.values(WALL_OPTIONS).map((option) => (
                    <IonSelectOption key={`rear-${option}`} value={option}>
                      {option}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>

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
