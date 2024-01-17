import React, { useState } from "react";
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
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
import { downloadOutline } from "ionicons/icons";
import Excel from "exceljs";
import desiredOrder from "./desiredOrder";

const Quotes = () => {
  const FOUNDATION = { REGULAR: "Regular", CONCRETE: "Concrete" };

  const [width, setWidth] = useState("0");
  const [buildingLength, setBuildingLength] = useState("0");
  const [height, setHeight] = useState("0");
  const [foundation, setFoundation] = useState(FOUNDATION.REGULAR);
  const [windowQuantity, setWindowQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownDetail[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [file, setFile] = useState(null);

  // Explicitly declare WALL_OPTIONS with its type
  const WALL_OPTIONS = {
    ZERO: 0,
    THREE_FEET: "3'",
    SIX_FEET: "6'",
    NINE_FEET: "9'",
    FULLY_ENCLOSED: "Fully Enclosed",
  };

  // Define the initial state using the keys of WALL_OPTIONS
  const [leftWall, setLeftWall] = useState(0);
  const [rightWall, setRightWall] = useState(0);
  const [frontWall, setFrontWall] = useState(0);
  const [rearWall, setRearWall] = useState(0);

  const calculateTotalCost = () => {
    const numWidth = parseInt(width);
    const numLength = parseInt(buildingLength);
    const numHeight = parseInt(height);
    // Calculate the number of grid lines
    const gridLines = Math.ceil(numLength / 5) + 1;
    let calculatedTotalCost = 0;
    let breakdownDetails = [];
    const legsPerRunner = Math.ceil(numLength / 5);

    if (numWidth < 10 || numWidth > 30 || isNaN(numWidth)) {
      setAlertMessage("Width must be between 10' and 30'.");
      setShowAlert(true);
      return;
    }
    if (numLength < 10 || numLength > 100 || isNaN(numLength)) {
      setAlertMessage("Length must be between 10' and 100'");
      setShowAlert(true);
      return;
    }
    if (numHeight < 6 || numHeight > 12 || isNaN(numHeight)) {
      setAlertMessage("Height must be between 6' and 12'.");
      setShowAlert(true);
      return;
    }

    // Runner calculations
    let runners: any = [];

    const addRunners = (length: any, quantity: any) => {
      runners.push({
        length: length,
        quantity: quantity,
        unitPrice: BASE_UNIT_COSTS["Runner"],
        total: length * BASE_UNIT_COSTS["Runner"] * quantity,
      });
    };

    // Determine runner lengths based on building length
    switch (true) {
      case numLength <= 10:
        addRunners(numLength, 2);
        break;
      case numLength <= 15:
        addRunners(15, 2);
        break;
      case numLength <= 20:
        addRunners(20, 2);
        break;
      case numLength <= 25:
        addRunners(10, 2);
        addRunners(15, 2);
        break;
      case numLength <= 30:
        addRunners(10, 2);
        addRunners(20, 2);
        break;
      // Add similar cases for other lengths if needed
      default:
        // Fallback logic for lengths not explicitly handled
        addRunners(20, Math.floor(numLength / 20) * 2);
        if (numLength % 20 !== 0) {
          addRunners(numLength % 20, 2);
        }
        break;
    }

    // Calculate total cost for runners and add to breakdown
    let runnerCost = 0;
    runners.forEach((runner: any) => {
      runnerCost += runner.total;
      breakdownDetails.push({
        item: "RUNNER",
        quantity: runner.quantity,
        unitPrice: runner.unitPrice,
        total: runner.total,
        linearFeet: `${runner.length}'`,
      });
    });

    // Hat channel calculations
    const hatChannelSpacing = 3; // Every 3 feet
    const maxHatChannelLength = 21; // Maximum length of a hat channel piece
    let hatChannelCost = 0;
    let hatChannelQuantity = 0;

    if (numWidth < 16) {
      hatChannelQuantity = 6;
    } else if (numWidth >= 16 && numWidth <= 18) {
      hatChannelQuantity = 8;
    } else if (numWidth > 18 && numWidth <= 20) {
      hatChannelQuantity = 10;
    } else {
      hatChannelQuantity = numWidth > 24 ? 12 : 10;
    }

    const distributeHatChannelLength = (
      numLength: number,
      hatChannelQuantity: number
    ) => {
      let lengths = [];
      let remainingLength = numLength;

      for (let i = 0; i < hatChannelQuantity; i++) {
        if (remainingLength <= 0) break; // Exit if no length remains

        let length =
          remainingLength >= maxHatChannelLength
            ? maxHatChannelLength
            : remainingLength;
        lengths.push(length);
        remainingLength -= length;
      }

      return lengths;
    };

    const hatChannelLengths = distributeHatChannelLength(
      numLength,
      hatChannelQuantity
    );

    hatChannelLengths.forEach((length) => {
      hatChannelCost += length * BASE_UNIT_COSTS["HatChannel"];
      breakdownDetails.push({
        item: "HAT CHANNEL",
        quantity: hatChannelQuantity, // Each entry represents one piece of hat channel
        unitPrice: BASE_UNIT_COSTS["HatChannel"],
        total: length * BASE_UNIT_COSTS["HatChannel"],
        linearFeet: `${length}'`,
      });
    });

    // Calculate total number of legs (5' increments)
    const totalRunnerLF = numLength * 2;
    const totalLegs = Math.ceil(totalRunnerLF / 5) + 2;

    // Determine anchor type and cost
    let anchorType = "";
    let anchorCostPerUnit = 0;
    if (foundation === FOUNDATION.REGULAR) {
      anchorType = '30" Rebar Anchor';
      anchorCostPerUnit = BASE_UNIT_COSTS["RebarAnchor"];
    } else if (foundation === FOUNDATION.CONCRETE) {
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
      item: "LEGS",
      quantity: totalLegs,
      unitPrice: legCostPerUnit,
      total: totalLegCost,
      linearFeet: `${numHeight}'`, // Individual leg height
    });
    // Calculate AngleClips required for each leg
    const angleClipQuantity = totalLegs * 4; // 4 AngleClips per leg
    const angleClipCost = angleClipQuantity * BASE_UNIT_COSTS["AngleClip"];
    breakdownDetails.push({
      item: "ANGLE CLIPS",
      quantity: angleClipQuantity,
      unitPrice: BASE_UNIT_COSTS["AngleClip"],
      total: angleClipCost,
    });

    let tubeCapQuantity = 4;
    const tubeCapCost = tubeCapQuantity * BASE_UNIT_COSTS["TubeCap"];
    breakdownDetails.push({
      item: "TUBECAPS",
      quantity: tubeCapQuantity,
      unitPrice: BASE_UNIT_COSTS["TubeCap"],
      total: tubeCapCost,
    });

    // Define a type for the keys of WALL_OPTIONS

    // Updated getWallHeight function with explicit parameter type
    const getWallHeight = (wallOption: any) => {
      switch (wallOption) {
        case "3'":
          return 3;
        case "6'":
          return 6;
        case "9'":
          return 9;
        case "FULLY_ENCLOSED":
          return numHeight; // Assuming fully enclosed means up to the building height
        default:
          return 0; // For '0' or unrecognized values
      }
    };

    // Calculate tallest sidewall height
    const leftWallHeight = getWallHeight(leftWall);
    const rightWallHeight = getWallHeight(rightWall);
    console.log(leftWallHeight, rightWallHeight);
    const tallestSidewallHeight = Math.max(leftWallHeight, rightWallHeight);
    console.log(tallestSidewallHeight);
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
    const calculateTrimForWall = (wallHeight: any, wallSide: string) => {
      if (wallHeight !== WALL_OPTIONS.ZERO) {
        const trimLF =
          wallHeight === WALL_OPTIONS.FULLY_ENCLOSED
            ? numHeight
            : parseInt(wallHeight);
        const trimCost = 2 * trimLF * BASE_UNIT_COSTS["M29Trim"]; // 2 pieces per wall

        breakdownDetails.push({
          item: `${wallSide} Wall M-29 Trim`,
          quantity: 2,
          unitPrice: BASE_UNIT_COSTS["M29Trim"],
          total: trimCost,
          linearFeet: `${trimLF}'`,
        });

        return trimCost;
      }
      return 0;
    };

    let totalM29TrimCost = 0;
    totalM29TrimCost += calculateTrimForWall(leftWall, "Left");
    totalM29TrimCost += calculateTrimForWall(rightWall, "Right");

    // Calculate M-29 Trim for front and rear walls if needed
    const calculateTrimFrontRear = () => {
      // Only add trim to the front/rear walls if the corresponding side wall does not have trim
      if (leftWall === WALL_OPTIONS.ZERO && rightWall === WALL_OPTIONS.ZERO) {
        let frontWallTrimCost = calculateTrimForWall(frontWall, "Front");
        let rearWallTrimCost = calculateTrimForWall(rearWall, "Rear");
        totalM29TrimCost += frontWallTrimCost + rearWallTrimCost;
      }
    };

    calculateTrimFrontRear();

    // Structural Screw Calculation
    const screwsPerLeg = 4; // Assuming 4 screws are needed per leg
    const structuralScrewQuantityForLegs =
      totalLegs * screwsPerLeg * tallestSidewallHeight;

    // Calculate total structural screws for Hat Channel
    let totalHatChannelLF = 0;
    for (let i = 0; i < hatChannelQuantity; i++) {
      const channelLength = Math.min(numLength, maxHatChannelLength);
      totalHatChannelLF += channelLength;
    }
    const structuralScrewQuantityForHatChannel = totalHatChannelLF;

    // Combine structural screws from hat channel and legs
    const totalStructuralScrews =
      structuralScrewQuantityForHatChannel + structuralScrewQuantityForLegs;
    const totalStructuralScrewsCost =
      totalStructuralScrews * BASE_UNIT_COSTS["StructuralScrew"];

    // Ensure to add structural screw cost to breakdown details and total cost
    breakdownDetails.push({
      item: "STRUCTURAL SCREWS",
      quantity: totalStructuralScrews,
      unitPrice: BASE_UNIT_COSTS["StructuralScrew"],
      total: totalStructuralScrewsCost,
    });

    // Calculate King Pins
    const kingPinLength = 3; // Default value of 3 feet

    // Check if width is greater than 24 feet
    const totalKingPinLF = gridLines * kingPinLength;
    const kingPinCost = totalKingPinLF * BASE_UNIT_COSTS["KingPin"];

    if (numWidth > 24) {
      breakdownDetails.push({
        item: "KINGPIN",
        quantity: gridLines,
        unitPrice: BASE_UNIT_COSTS["KingPin"],
        total: kingPinCost,
        linearFeet: kingPinLength,
      });
    }

    // Calculate R1s
    const r1Length = 4; // Default value of 4 feet
    const totalR1LF = gridLines * r1Length;
    const r1Cost = totalR1LF * BASE_UNIT_COSTS["R1Peak"];
    const r1Quantity = gridLines;
    breakdownDetails.push({
      item: "R1 PEAK",
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
        item: "ROOF BRACE",
        quantity: roofBraceQuantity,
        unitPrice: BASE_UNIT_COSTS["RoofBrace"],
        total: roofBraceCost,
        linearFeet: `${roofBraceLength}'`,
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
      const totalInches = Math.round(decimalFeet * 12); // Round to nearest inch
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;

      if (inches === 0) {
        return `${feet}'`; // Return only feet if inches are 0
      } else {
        return `${feet}' ${inches}"`; // Return feet and inches otherwise
      }
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
      item: "26ga HHR ROOF SHEETS",
      quantity: totalRoofSheets,
      unitPrice: roofSheetCostPerSheet,
      total: totalRoofSheetCost,
      linearFeet: roofSheetLengthInFeetInches, // Length of each roof sheet in feet and inches
    });

    // Calcualte stich screws
    const stitchScrewCostPerUnit = BASE_UNIT_COSTS["StitchScrew"];

    // Calculate the number of stitch screws needed
    const totalStitchScrews = Math.ceil(
      ((totalRoofSheets * roofSheetLengthInDecimalFeet) / 2) * 1.1
    );

    // Calculate the total cost for stitch screws
    const totalStitchScrewCost = totalStitchScrews * stitchScrewCostPerUnit;

    // Add stitch screws to breakdown details
    breakdownDetails.push({
      item: "STITCH SCREWS",
      quantity: totalStitchScrews,
      unitPrice: stitchScrewCostPerUnit,
      total: totalStitchScrewCost,
    });
    // Calculate KneeBrace for each R2
    const kneeBraceQuantity = r2Quantity; // One KneeBrace per R2
    const kneeBraceCost = kneeBraceQuantity * BASE_UNIT_COSTS["KneeBrace"];

    // Add KneeBrace cost to the total cost
    calculatedTotalCost += kneeBraceCost;

    // Add KneeBrace to breakdown details
    breakdownDetails.push({
      item: "KNEE BRACE",
      quantity: kneeBraceQuantity,
      unitPrice: BASE_UNIT_COSTS["KneeBrace"],
      total: kneeBraceCost,
    });

    // Calculate Straight Clips for each King Pin
    const straightClipQuantity = gridLines * 4; // 4 Straight Clips per King Pin
    const straightClipCost =
      straightClipQuantity * BASE_UNIT_COSTS["StraightClip"];
    breakdownDetails.push({
      item: "STRAIGHT CLIPS",
      quantity: straightClipQuantity,
      unitPrice: BASE_UNIT_COSTS["StraightClip"],
      total: straightClipCost,
    });

    let leftWallCost = 0;
    let rightWallCost = 0;

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
        item: `26ga Left Wall Sidewall Sheets`,
        quantity: leftWallSheets.length,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: leftWallCost,
        linearFeet: `${leftWallSheets[0].length}'`, // Display LF of each sheet
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
        item: `26ga Right Wall Sidewall Sheets`,
        quantity: rightWallSheets.length,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: rightWallCost,
        linearFeet: `${rightWallSheets[0].length}'`, // Display LF of each sheet
      });
    }
    // Calculate costs for front and rear walls
    const frontWallData = calculateFrontRearWallCost(frontWall, numWidth);
    if (frontWallData.quantity > 0) {
      breakdownDetails.push({
        item: `26ga HHR FRONT GABLE END`,
        quantity: frontWallData.quantity,
        unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
        total: frontWallData.cost,
        linearFeet: frontWallData.linearFeet,
      });
    }

    const rearWallData = calculateFrontRearWallCost(rearWall, numWidth);
    if (rearWallData.quantity > 0) {
      breakdownDetails.push({
        item: `26ga HHR REAR GABLE END`,
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
      item: "TEK-3 SCREWS",
      quantity: totalTekScrews,
      unitPrice: tekScrewCostPerUnit,
      total: tekScrewCost,
    });

    // Calculate M29GableTrim
    let m29GableTrimLength = r2HypotenuseLength; // Same length as the R2 hypotenuse
    let m29GableTrimCost = m29GableTrimLength * BASE_UNIT_COSTS["M29GableTrim"];

    // M29GableTrim calculations with overlap
    m29GableTrimLength += 0.5; // Add 6 inches for overlap
    m29GableTrimCost = m29GableTrimLength * BASE_UNIT_COSTS["M29GableTrim"];

    // Add updated M29GableTrim details to the breakdown
    breakdownDetails.push({
      item: "M-29 OUTSIDE GABLE TRIM 5X5",
      quantity: 4,
      unitPrice: BASE_UNIT_COSTS["M29GableTrim"],
      total: m29GableTrimCost,
      linearFeet: decimalFeetToFeetInches(m29GableTrimLength),
    });
    // Eave Trim calculations
    const maxEaveTrimLength = 14.5; // Max length for an individual eave trim piece in feet
    const buildingLengthInFeet = numLength; // Assuming 'numLength' is the length of the building in feet
    let totalEaveTrimLength = buildingLengthInFeet;
    let eaveTrimPieces = 1;
    let eaveTrimLengthPerPiece = buildingLengthInFeet;

    // Splitting into even lengths if the total length exceeds the max length of an eave trim piece
    if (totalEaveTrimLength > maxEaveTrimLength) {
      eaveTrimPieces = Math.ceil(totalEaveTrimLength / maxEaveTrimLength);
      eaveTrimLengthPerPiece = totalEaveTrimLength / eaveTrimPieces;
      // Adjust to ensure even distribution without exceeding max length
      eaveTrimLengthPerPiece = Math.floor(eaveTrimLengthPerPiece * 10) / 10; // Round down to nearest tenth
    }

    // Calculate the cost of eave trim
    let eaveTrimCostPerUnit = BASE_UNIT_COSTS["EaveTrim"]; // Ensure this is defined in your BASE_UNIT_COSTS
    let eaveTrimCost =
      eaveTrimPieces * eaveTrimLengthPerPiece * eaveTrimCostPerUnit;
    // Eave Trim calculations with overlap
    eaveTrimLengthPerPiece += 0.5; // Add 6 inches for overlap
    eaveTrimCost =
      eaveTrimPieces * eaveTrimLengthPerPiece * eaveTrimCostPerUnit;

    // Add updated Eave Trim details to the breakdown
    breakdownDetails.push({
      item: "M-31 EAVE CLOSURE TRIM",
      quantity: eaveTrimPieces,
      unitPrice: eaveTrimCostPerUnit,
      total: eaveTrimCost,
      linearFeet: decimalFeetToFeetInches(eaveTrimLengthPerPiece),
    });

    // Ridge Cap calculations
    const maxRidgeCapLength = 14.5; // Max length for an individual eave trim piece in feet
    let totalRidgeCapLength = numLength;
    let ridgeCapPieces = 1;
    let ridgeCapLengthPerPiece = buildingLengthInFeet;

    // Splitting into even lengths if the total length exceeds the max length of an eave trim piece
    if (totalRidgeCapLength > maxRidgeCapLength) {
      ridgeCapPieces = Math.ceil(totalEaveTrimLength / maxRidgeCapLength);
      ridgeCapLengthPerPiece = totalEaveTrimLength / ridgeCapPieces;
      // Adjust to ensure even distribution without exceeding max length
      ridgeCapLengthPerPiece = Math.floor(ridgeCapLengthPerPiece * 10) / 10; // Round down to nearest tenth
    }

    // Calculate the cost of eave trim
    let ridgeCapCostPerUnit = BASE_UNIT_COSTS["RidgeCap"]; // Ensure this is defined in your BASE_UNIT_COSTS
    let ridgeCapCost =
      ridgeCapPieces * ridgeCapLengthPerPiece * ridgeCapCostPerUnit;

    // Ridge Cap calculations with overlap
    ridgeCapLengthPerPiece += 0.5; // Add 6 inches for overlap
    ridgeCapCost =
      ridgeCapPieces * ridgeCapLengthPerPiece * ridgeCapCostPerUnit;

    // Add updated Ridge Cap details to the breakdown
    breakdownDetails.push({
      item: "M-33 RIDGE CAP",
      quantity: ridgeCapPieces,
      unitPrice: ridgeCapCostPerUnit,
      total: ridgeCapCost,
      linearFeet: decimalFeetToFeetInches(ridgeCapLengthPerPiece),
    });

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
      totalRoofSheetCost +
      totalStructuralScrewsCost +
      totalStitchScrewCost +
      totalM29TrimCost +
      m29GableTrimCost +
      eaveTrimCost +
      ridgeCapCost;

    setTotalCost(calculatedTotalCost);
    setBreakdown(breakdownDetails);
  };

  // Repeat for rightWall, frontWall, and rearWall

  const resetCalculator = () => {
    setWidth("");
    setBuildingLength("");
    setHeight("");
    setFoundation(FOUNDATION.REGULAR);
    setWindowQuantity(0);
    setTotalCost(0);
    setLeftWall(0);
    setRightWall(0);
    setFrontWall(0);
    setRearWall(0);
    setBreakdown([]);
  };

  // Helper function to get the index of an item in the desired order
  function getDesiredOrderIndex(item: any) {
    const index = desiredOrder.indexOf(item);
    return index === -1 ? Infinity : index; // Items not in the list will be placed at the end
  }
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

    return Object.values(aggregatedDetails).sort(
      (a, b) => getDesiredOrderIndex(a.item) - getDesiredOrderIndex(b.item)
    );
  };

  const aggregatedBreakdown = getAggregatedBreakdown();
  // Define the desired order of items

  const exportToExcel = async () => {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Breakdown");

      // Reorder columns as per the new requirement
      worksheet.columns = [
        { header: "Item", key: "item", width: 30 },
        { header: "Quantity", key: "quantity", width: 10 },
        { header: "Linear Feet", key: "linearFeet", width: 15 },
        { header: "Unit Price", key: "unitPrice", width: 10 },
        { header: "Total", key: "total", width: 10 },
      ];

      // Apply bold style to headers and set header background
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFFFF" },
        bgColor: { argb: "FF0000FF" },
      };
      const borderStyle = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      // Add data rows
      const aggregatedBreakdown = getAggregatedBreakdown();
      aggregatedBreakdown.forEach((item, index) => {
        const row = worksheet.addRow({
          item: item.item,
          quantity: item.quantity,
          linearFeet: item.linearFeet || "",
          unitPrice: item.unitPrice,
          total: item.total,
        });

        // Apply alternating fills to rows and border style to each cell
        row.eachCell({ includeEmpty: true }, (cell: any, colNumber) => {
          cell.border = borderStyle;
          cell.fill =
            index % 2 === 0
              ? {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFF0F0F0" },
                }
              : {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
        });
      });
      // Apply borders to header after defining all cells to avoid overwriting
      worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell: any) => {
        cell.border = borderStyle;
      });

      // Write the workbook to a buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Use the triggerDownload function to initiate the download
      triggerDownload(blob);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("An error occurred while exporting to Excel.");
    }
  };

  const triggerDownload = (blob: any) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "updatedQuoteOrder.xlsx";
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);

    // Debugging: Log to confirm download was triggered
    console.log("Download triggered");
  };

  return (
    <IonPage>
      <IonContent>
        <IonRow>
          <IonHeader>
            <IonCardHeader>
              <IonCardTitle>
                <strong>Quotes Calculator 🧮</strong>
              </IonCardTitle>
            </IonCardHeader>
          </IonHeader>
          <IonCol>
            <IonItem>
              <IonLabel position="stacked">
                Width (Min: 10', Max: 30'):
              </IonLabel>
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
              <IonLabel position="stacked">
                Height (Min: 6', Max: 12'):
              </IonLabel>
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
                value={foundation}
                onIonChange={(e) => setFoundation(e.detail.value as string)}
              >
                <IonSelectOption value={FOUNDATION.REGULAR}>
                  {FOUNDATION.REGULAR}
                </IonSelectOption>
                <IonSelectOption value={FOUNDATION.CONCRETE}>
                  {FOUNDATION.CONCRETE}
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
            <IonButton
              color="primary"
              expand="full"
              onClick={calculateTotalCost}
            >
              Calculate Total
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              color="secondary"
              expand="full"
              onClick={resetCalculator}
            >
              Reset
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton expand="full" onClick={exportToExcel}>
              Export To Excel
              <IonIcon icon={downloadOutline} />
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
                      {detail.linearFeet ? ` LF: ${detail.linearFeet}, ` : ""}
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
      </IonContent>
    </IonPage>
  );
};

export default Quotes;
