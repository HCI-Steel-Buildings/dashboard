import React, { useState } from "react";
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import {
  AggregatedBreakdownDetail,
  AggregatedDetails,
  BreakdownDetail,
  ColorHexCodesType,
} from "./types";

import { BASE_UNIT_COSTS } from "./PricingData";
import { documentsOutline, downloadOutline } from "ionicons/icons";
import Excel from "exceljs";
import desiredOrder from "./desiredOrder";
import itemToGroupMap from "./itemToGroupMap";
import { PDFDocument } from "pdf-lib";

const Quotes = () => {
  const FOUNDATION = {
    ASPHALT: "Asphalt",
    GRAVEL: "Gravel",
    CONCRETE: "Concrete",
    DIRT: "Dirt",
  };
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedColorType, setSelectedColorType] = useState(null);
  const [width, setWidth] = useState("0");
  const [buildingLength, setBuildingLength] = useState("0");
  const [height, setHeight] = useState("0");
  const [foundation, setFoundation] = useState(FOUNDATION.ASPHALT);
  const [windowQuantity, setWindowQuantity] = useState(0);
  const [doorQuantity, setDoorQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownDetail[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [trimColor, setTrimColor] = useState("");
  const [wallSheathingColor, setWallSheathingColor] = useState("");
  const [roofSheathingColor, setRoofSheathingColor] = useState("");
  const [guttersLeft, setGuttersLeft] = useState(false);
  const [guttersRight, setGuttersRight] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [address, setAddress] = useState("");
  const [dripStop, setDripStop] = useState(false);
  const [eaveExtension, setEaveExtension] = useState(0);
  const [hasPermit, setHasPermit] = useState(false);
  // Explicitly declare WALL_OPTIONS with its type
  const WALL_OPTIONS = {
    ZERO: 0,
    THREE_FEET: "3'",
    SIX_FEET: "6'",
    NINE_FEET: "9'",
    FULLY_ENCLOSED: "Fully Enclosed",
  };

  const EAVE_EXTENSION = {
    ZERO: 0,
    SIX: '6"',
    NINE: '9"',
    TEWELVE: '12"',
    EIGHTEEN: '18"',
    TWENTY_FOUR: '24"',
  };
  // Convert eave extension from inches (string) to decimal feet
  const eaveExtensionInInches = parseInt(
    eaveExtension.toString().replace('"', "")
  );
  const eaveExtensionInFeet = eaveExtensionInInches / 12;

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
    switch (foundation) {
      case FOUNDATION.ASPHALT:
        anchorType = '30" Rebar Anchor ';
        anchorCostPerUnit = BASE_UNIT_COSTS["RebarAnchor"];
        break;
      case FOUNDATION.GRAVEL:
        // Define anchor type and cost for Gravel
        anchorType = '30" Rebar Anchor ';
        anchorCostPerUnit = BASE_UNIT_COSTS["RebarAnchor"];
        break;
      case FOUNDATION.CONCRETE:
        anchorType = "Concrete Anchor";
        anchorCostPerUnit = BASE_UNIT_COSTS["ConcreteAnchor"];
        break;
      case FOUNDATION.DIRT:
        // Define anchor type and cost for Dirt
        anchorType = '30" Rebar Anchor ';

        anchorCostPerUnit = BASE_UNIT_COSTS["RebarAnchor"];
        break;
      default:
        // Fallback logic or default case
        break;
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
          color: trimColor,
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
    const totalStructuralScrews = Math.ceil(
      (structuralScrewQuantityForHatChannel + structuralScrewQuantityForLegs) *
        1.15
    ); // Add 15% for waste
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
      linearFeet: `${r1Length}'`,
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
    const adjustedWidthForR2 = numWidth / 2 + eaveExtensionInFeet; // Add eave extension to half of the width
    const r2HypotenuseLength = calculateTriangleDimensions(
      adjustedWidthForR2,
      PITCH_RISE,
      PITCH_RUN
    ).hypotenuse;
    const r2LengthPerPiece = Math.max(r2HypotenuseLength - 24 / 12, 0); // Subtract 24 inches, converted to feet for the R1
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
    const roofSheetWidth = 3; // Width of each roof sheet

    // Add 3 inches to the roof panel length if either left or right gutters are selected
    const extraLengthForGutters = 0.25; // 3 inches in feet

    const roofSheetLengthInDecimalFeet = Math.min(
      r2LengthPerPiece + 2 + extraLengthForGutters + eaveExtensionInFeet,
      21
    ); // Max length of roof sheet is 21 feet
    const roofSheetLengthInFeetInches = decimalFeetToFeetInches(
      roofSheetLengthInDecimalFeet
    );

    const totalRoofSheets = Math.ceil(numLength / roofSheetWidth) * 2; // Total number of roof sheets for both sides
    const roofSheetCostPerSheet =
      roofSheetLengthInDecimalFeet * BASE_UNIT_COSTS["RoofSheet"];
    const totalRoofSheetCost = totalRoofSheets * roofSheetCostPerSheet; // Total cost for all roof sheets
    // Dripstop logic
    const dripStopNote = dripStop ? "W/ DRIPSTOP" : "";
    // Add Roof Sheathing to breakdown details
    breakdownDetails.push({
      item: "26ga HHR ROOF SHEETS",
      quantity: totalRoofSheets,
      unitPrice: roofSheetCostPerSheet,
      total: totalRoofSheetCost,
      linearFeet: roofSheetLengthInFeetInches, // Length of each roof sheet in feet and inches
      color: roofSheathingColor,
      notes: dripStopNote,
    });

    // Calcualte stich screws
    const stitchScrewCostPerUnit = BASE_UNIT_COSTS["StitchScrew"];

    // Calculate the number of stitch screws needed
    const totalStitchScrews = Math.ceil(
      ((totalRoofSheets * roofSheetLengthInDecimalFeet) / 2) * 1.15 // Add 10% for waste
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
      linearFeet: `3'`,
    });

    // Calculate Straight Clips for each King Pin
    let straightClipQuantity = gridLines * 4; // 4 Straight Clips per King Pin
    straightClipQuantity += totalLegs * 2; // 2 Straight Clips per leg
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
        color: wallSheathingColor,
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
        color: wallSheathingColor,
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
        color: wallSheathingColor,
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
        color: wallSheathingColor,
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
      color: trimColor,
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
      quantity: eaveTrimPieces * 2,
      unitPrice: eaveTrimCostPerUnit,
      total: eaveTrimCost,
      linearFeet: decimalFeetToFeetInches(eaveTrimLengthPerPiece),
      color: trimColor,
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
      color: trimColor,
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

    // Function to calculate gutter cost and add breakdown details
    const calculateGutterCost = (buildingLength: any, sideSelected: any) => {
      if (!sideSelected) return {};

      const MAX_GUTTER_LENGTH = 14.5; // 14'6" in decimal feet
      const gutterItems: any = {};

      if (buildingLength > 0) {
        let numberOfPieces = Math.ceil(buildingLength / MAX_GUTTER_LENGTH);
        let gutterPieceLength = buildingLength / numberOfPieces;
        gutterPieceLength = Math.floor(gutterPieceLength * 10) / 10; // Round down to the nearest tenth
        gutterPieceLength += 0.5;

        // Ensure that gutterPieceLength does not exceed MAX_GUTTER_LENGTH
        if (gutterPieceLength > MAX_GUTTER_LENGTH) {
          gutterPieceLength = MAX_GUTTER_LENGTH;
          numberOfPieces = Math.ceil(buildingLength / gutterPieceLength);
        }

        // Assigning gutter components based on the calculated number of pieces
        gutterItems["K5 Gutter"] = numberOfPieces;
        gutterItems["K5 Downspout"] = numberOfPieces;
        gutterItems["K5 EndCap"] = numberOfPieces * 2;
        gutterItems["K5 DownspoutStrap"] = numberOfPieces;
        gutterItems["K5 Clip"] =
          numberOfPieces * Math.ceil(gutterPieceLength / 1.5);
        gutterItems["K5 ElbowA"] = numberOfPieces;
        gutterItems["K5 ElbowB"] = numberOfPieces;
        gutterItems["K5 Gutter Screw"] = buildingLength;
        gutterItems["NovaFlex"] = numberOfPieces;
      }

      return gutterItems;
    };

    // Calculate Gutter Costs
    const gutterCosts = (gutterItems: any) => {
      let totalCost = 0;
      let linearFeetString = "";
      let downspoutLengthString = "10'"; // Length for each downspout

      for (const item in gutterItems) {
        const quantity = gutterItems[item];
        const unitCost = BASE_UNIT_COSTS[item.replace(/\s/g, "")];
        const total = quantity * unitCost;
        totalCost += total;

        if (item === "K5 Gutter") {
          // Convert the linear feet for gutters to feet and inches format
          linearFeetString = decimalFeetToFeetInches(
            gutterItems["GutterPieceLength"]
          );
        }

        breakdownDetails.push({
          item: item,
          quantity: quantity,
          unitPrice: unitCost,
          total: total,
          linearFeet:
            item === "K5 Gutter"
              ? linearFeetString
              : item === "K5 Downspout"
              ? downspoutLengthString
              : undefined, // Add LF for K5 Gutter and K5 Downspout
        });
      }
      return totalCost;
    };

    // Calculate costs for left and right gutters
    const gutterCostLeft = gutterCosts(
      calculateGutterCost(buildingLength, guttersLeft)
    );
    const gutterCostRight = gutterCosts(
      calculateGutterCost(buildingLength, guttersRight)
    );

    // Add Butyl Tape to the breakdown
    const butylTapeCost = BASE_UNIT_COSTS["ButylTape"];
    breakdownDetails.push({
      item: "Butyl Tape",
      quantity: 1,
      // linearFeet: length * 2,
      unitPrice: butylTapeCost,
      total: butylTapeCost,
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
      totalRoofSheetCost +
      totalStructuralScrewsCost +
      totalStitchScrewCost +
      totalM29TrimCost +
      m29GableTrimCost +
      eaveTrimCost +
      ridgeCapCost +
      gutterCostLeft +
      gutterCostRight +
      butylTapeCost;

    setTotalCost(calculatedTotalCost);
    setBreakdown(breakdownDetails);
    console.log(breakdownDetails);
  };

  const resetCalculator = () => {
    setWidth("");
    setBuildingLength("");
    setHeight("");
    setFoundation(FOUNDATION.ASPHALT);
    setWindowQuantity(0);
    setDoorQuantity(0);
    setTotalCost(0);
    setLeftWall(0);
    setRightWall(0);
    setFrontWall(0);
    setRearWall(0);
    setBreakdown([]);
    setRoofSheathingColor("");
    setWallSheathingColor("");
    setTrimColor("");
    setGuttersLeft(false);
    setGuttersRight(false);
    setDripStop(false);
    setEaveExtension(EAVE_EXTENSION.ZERO);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setHasPermit(false);
  };

  // Helper function to get the index of an item in the desired order
  function getDesiredOrderIndex(item: any) {
    const index = desiredOrder.indexOf(item);
    return index === -1 ? Infinity : index; // Items not in the list will be placed at the end
  }
  const getAggregatedBreakdown = (): AggregatedBreakdownDetail[] => {
    const aggregatedDetails: AggregatedDetails = {};

    breakdown.forEach((detail) => {
      // Include linearFeet in the key
      const key = `${detail.item}_${detail.linearFeet}_${
        detail.color || "No Color"
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

  const exportToExcel = async () => {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("Breakdown");

      // Define columns
      worksheet.columns = [
        { header: "Color", key: "color", width: 15 },
        { header: "Item", key: "item", width: 30 },
        {
          header: "Quantity",
          key: "quantity",
          width: 10,
          style: { alignment: { horizontal: "center" } },
        },
        {
          header: "Linear Feet",
          key: "linearFeet",
          width: 15,
          style: { alignment: { horizontal: "center" } },
        },
        { header: "Unit Price", key: "unitPrice", width: 10 },
        { header: "Total", key: "total", width: 10 },
        { header: "Received", key: "received", width: 10 },
        { header: "Notes", key: "notes", width: 30 },
      ];

      // Style the headers
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

      // Apply borders to header
      worksheet.getRow(1).eachCell((cell: any) => {
        cell.border = borderStyle;
      });
      // Import the itemToGroupMap from a separate file if needed
      const groupHeaders: any = {
        SHEETS: "SHEETS",
        TRIM: "TRIM",
        FRAMING: "FRAMING",
        "K5 GUTTER SYSTEM": "K5 GUTTER SYSTEM",
        HARDWARE: "HARDWARE/MISC",
      };
      groupHeaders.font = { bold: true, size: 14 };
      // Define two different fill styles for alternating rows
      const fillStyle1 = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF0F0F0" }, // Light gray for even rows
      };

      const fillStyle2 = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" }, // A different color (e.g., light blue) for odd rows
      };

      let rowNum = 2; // Start with the second row, since the first row is for headers

      let currentGroup = "";
      const aggregatedBreakdown = getAggregatedBreakdown();
      aggregatedBreakdown.forEach((item) => {
        // Determine the group of the current item
        const itemGroup = itemToGroupMap[item.item];

        // Check if we've encountered a new group
        if (itemGroup && itemGroup !== currentGroup) {
          // Insert a group header row
          const headerRow = worksheet.addRow({
            item: groupHeaders[itemGroup] || itemGroup,
          });
          headerRow.font = {
            bold: true,
            color: { argb: "FF000000" },
            size: 14,
          };

          // Apply the fill style only up to the last defined column
          for (let i = 1; i <= worksheet.columns.length; i++) {
            headerRow.getCell(i).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFCCCCCC" },
            };
          }

          currentGroup = itemGroup; // Update the current group
        }

        // Add a normal item row
        const row = worksheet.addRow({
          color: item.color || "",
          item: item.item,
          quantity: item.quantity,
          linearFeet: item.linearFeet || "",
          unitPrice: item.unitPrice,
          total: item.total.toFixed(2),
          received: "",
          notes: item.notes || "",
        });

        // Style the item row with alternating colors
        const fillStyle = rowNum % 2 === 0 ? fillStyle1 : fillStyle2;
        row.eachCell((cell: any) => {
          cell.border = borderStyle;
          cell.fill = fillStyle;
        });

        rowNum++; // Increment the row number
      });

      // After adding all item rows, add a final row for total cost
      const totalCostRow = worksheet.addRow({
        color: "",
        item: "TOTAL COST",
        quantity: "",
        linearFeet: "",
        unitPrice: "",
        total: totalCost.toFixed(2), // Assuming totalCost holds the calculated total cost and is a number
      });
      // For example, to merge from column 'D' to 'E' for the label
      worksheet.mergeCells(`D${totalCostRow.number}:E${totalCostRow.number}`);
      totalCostRow.font = { bold: true, color: { argb: "FF000000" }, size: 14 };
      totalCostRow.eachCell((cell: any) => {
        cell.border = borderStyle;
      });
      totalCostRow.getCell(6).numFmt = '"$"#,##0.00'; // Assuming that the 'total' is the 6th column

      // Write the workbook to a buffer
      const buffer = await workbook.xlsx.writeBuffer();

      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Trigger the file download
      triggerDownload(blob);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("An error occurred while exporting to Excel.");
    }
  };

  const triggerDownload = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Breakdown.xlsx";
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  };

  const colorOptions = [
    "Malibu White",
    "Winter White",
    "Beige",
    "Roman Bronze",
    "Brick Red",
    "Tahoe Blue",
    "Forest Green",
    "Old Towne Gray",
    "Dark Gray",
    "Black",
  ];
  const colorHexCodes: ColorHexCodesType = {
    Black: "#252323",
    "Tahoe Blue": "#7da5ba",
    "Forest Green": "#335629",
    Galvalume: "#b3b2b2",
    "Old Town Gray": "#9e9e9e",
    "Brick Red": "#75110f",
    "Roman Bronze": "#7f6011",
    "Dark Gray": "#666666",
    "Winter White": "#ffffff",
    "Malibu White": "#eeeeee",
    Beige: "#bf901f",
  };
  interface ColorSelectorProps {
    colorOptions: string[];
    colorHexCodes: { [key: string]: string };
    onSelect: (color: string) => void;
  }
  const ColorSelector: React.FC<ColorSelectorProps> = ({
    colorOptions,
    colorHexCodes,
    onSelect,
  }) => {
    return (
      <IonList>
        {colorOptions.map((color) => {
          const hexCode = colorHexCodes[color] || "#000000"; // Default to black if hex code not found
          return (
            <IonItem key={color} button onClick={() => onSelect(color)}>
              <div
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  backgroundColor: hexCode,
                  marginRight: "5px",
                  verticalAlign: "middle",
                }}
              ></div>
              <IonLabel>{color}</IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    );
  };

  const openColorSelector = (type: any) => {
    setSelectedColorType(type); // Set which type of color is being selected
    setShowColorSelector(true); // Open the modal
  };

  const handleColorSelect = (color: any) => {
    if (selectedColorType === "trim") {
      setTrimColor(color);
    } else if (selectedColorType === "roof") {
      setRoofSheathingColor(color);
    } else if (selectedColorType === "wall") {
      setWallSheathingColor(color);
    }
    setShowColorSelector(false);
  };
  // Function to convert color names to CSS class compatible names
  const toCssClassName = (colorName: string) => {
    return colorName.toLowerCase().replace(/\s+/g, "-");
  };

  async function modifyAndDownloadPdf(totalPrice: any) {
    try {
      // Fetch the PDF file over HTTP
      const response = await fetch("./form.pdf");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pdfBuffer = await response.arrayBuffer();

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Get the form within the document
      const form = pdfDoc.getForm();

      // Get the field where you want to insert the total price
      const totalPriceField = form.getTextField("Total");
      const laborField = form.getTextField("Labor");
      const taxField = form.getTextField("Tax");
      const grandTotalField = form.getTextField("GrandTotal");
      const subTotalField = form.getTextField("Subtotal");
      const deliveryField = form.getTextField("Delivery");
      const buildingSizeField = form.getTextField("Building Size");
      const firstNameField = form.getTextField("firstName");
      const lastNameField = form.getTextField("lastName");
      const emailField = form.getTextField("email");
      const phoneField = form.getTextField("phone");
      // const addressField = form.getTextField("address");
      const quoteNumberField = form.getTextField("quoteNumber");

      // Fill the field with the total price
      totalPriceField.setText(totalPrice.toString());
      // Calculate delivery cost
      const delivery = 500;
      deliveryField.setText(delivery.toString());
      // Calculate labor cost
      const laborCost = (totalPrice * 0.45).toFixed(2);
      laborField.setText(laborCost.toString());
      // Calculate tax
      const tax = (totalPrice * 0.07).toFixed(2);
      taxField.setText(tax.toString());

      // Calculate subtotal
      const subTotal = totalPrice + laborCost + delivery;
      subTotalField.setText(subTotal.toString());

      // Calculate grand total
      const grandTotal = subTotal + tax;
      grandTotalField.setText(grandTotal.toString());

      // Calculate building size
      const buildingSize = `${width}' x ${buildingLength}' x ${height}'`;
      buildingSizeField.setText(buildingSize.toString());

      // Calculate quote number
      const quoteNumber = Math.floor(Math.random() * 1000000);
      quoteNumberField.setText(quoteNumber.toString());

      // Fill out client information
      firstNameField.setText(firstName.toString());
      lastNameField.setText(lastName.toString());
      emailField.setText(email.toString());
      phoneField.setText(phone.toString());

      // Flatten the form to prevent further editing of filled fields
      form.flatten();

      // Save the modified PDF as a new document
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      downloadPdf(pdfBytes, "ModifiedForm.pdf");
    } catch (error) {
      console.error("Error modifying PDF:", error);
    }
  }

  // Function to trigger the download of a PDF file (this needs to be adapted for Node.js environment)
  function downloadPdf(pdfBytes: any, filename: any) {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Call this function on your button click event
  const handleExportToPdfClick = () => {
    modifyAndDownloadPdf(totalCost.toFixed(2)); // Assuming 'totalCost' is your total price state
  };

  return (
    <IonPage>
      <IonContent>
        {/* HEADER ROW */}
        <IonRow>
          {/* Color Modal */}
          <IonModal
            isOpen={showColorSelector}
            onDidDismiss={() => setShowColorSelector(false)}
          >
            <ColorSelector
              colorOptions={colorOptions}
              colorHexCodes={colorHexCodes}
              onSelect={handleColorSelect}
            />
          </IonModal>
          {/* APP HEADER */}
          <IonHeader>
            <IonCardHeader>
              <IonCardTitle>
                <strong>Quotes Calculator 🧮</strong>
              </IonCardTitle>
            </IonCardHeader>
          </IonHeader>
        </IonRow>
        {/* First Row */}
        <IonRow>
          {/* Client info */}
          <IonCol size="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Client Information</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel position="stacked">First Name:</IonLabel>
                <IonInput
                  type="text"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Last Name:</IonLabel>
                <IonInput
                  type="text"
                  value={lastName}
                  onIonChange={(e) => setLastName(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Email:</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Phone:</IonLabel>
                <IonInput
                  type="tel"
                  value={phone}
                  onIonChange={(e) => setPhone(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCard>
          </IonCol>
          {/* Site info */}
          <IonCol size="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Site Information</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel position="stacked">Address:</IonLabel>
                <IonInput
                  type="text"
                  value={address}
                  onIonChange={(e) => setAddress(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">City:</IonLabel>
                <IonInput
                  type="text"
                  value={city}
                  onIonChange={(e) => setCity(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">State:</IonLabel>
                <IonInput
                  type="text"
                  value={state}
                  onIonChange={(e) => setState(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Zip:</IonLabel>
                <IonInput
                  type="text"
                  value={zipCode}
                  onIonChange={(e) => setZipCode(e.detail.value ?? "")}
                />
              </IonItem>
            </IonCard>
          </IonCol>
        </IonRow>
        {/* Second Row (Building size, Wall Options */}
        <IonRow>
          {/* Building Size */}
          <IonCol size="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Building Size</strong>{" "}
                </IonCardTitle>
              </IonCardHeader>
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
            </IonCard>
          </IonCol>
          {/* Wall Options */}
          <IonCol size="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Wall Options</strong>
                </IonCardTitle>
              </IonCardHeader>
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
            </IonCard>
          </IonCol>
        </IonRow>
        {/* Third Row ( Gutter Options, Ground Type, Colors, Door and Windows) */}
        <IonRow>
          {/* Gutter Options */}
          <IonCol size="3">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Gutter Options</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel>Gutters Left Side:</IonLabel>
                    <IonCheckbox
                      checked={guttersLeft}
                      onIonChange={(e) => setGuttersLeft(e.detail.checked)}
                    />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel>Gutters Right Side:</IonLabel>
                    <IonCheckbox
                      checked={guttersRight}
                      onIonChange={(e) => setGuttersRight(e.detail.checked)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonCard>
          </IonCol>
          {/* Ground Type*/}
          <IonCol size="3">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Ground Type</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel position="stacked">Ground Type:</IonLabel>
                <IonSelect
                  value={foundation}
                  onIonChange={(e) => setFoundation(e.detail.value as string)}
                >
                  {Object.values(FOUNDATION).map((foundationType) => (
                    <IonSelectOption
                      key={foundationType}
                      value={foundationType}
                    >
                      {foundationType}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCard>
          </IonCol>
          {/* Colors */}
          <IonCol size="3">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Colors</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonRow>
                <IonCol>
                  <IonLabel position="stacked">Trim Color:</IonLabel>
                  <IonButton
                    color={trimColor ? toCssClassName(trimColor) : "primary"}
                    expand="block"
                    onClick={() => openColorSelector("trim")}
                  >
                    {trimColor || "Select Trim Color"}
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonLabel>Roof Color:</IonLabel>
                  <IonButton
                    color={
                      roofSheathingColor
                        ? toCssClassName(roofSheathingColor)
                        : "primary"
                    }
                    expand="block"
                    onClick={() => openColorSelector("roof")}
                  >
                    {roofSheathingColor || "Select Roof Color"}
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonLabel>Wall Color:</IonLabel>
                  <IonButton
                    color={
                      wallSheathingColor
                        ? toCssClassName(wallSheathingColor)
                        : "primary"
                    }
                    expand="block"
                    onClick={() => openColorSelector("wall")}
                  >
                    {wallSheathingColor || "Select Wall Color"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCard>
          </IonCol>
          {/* Window Options */}
          <IonCol size="3">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Door and Window Options</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonItem>
                <IonLabel>
                  <strong>Window Quantity:</strong>
                </IonLabel>
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
                <IonLabel>
                  <strong>ManDoor Quantity:</strong>
                </IonLabel>
                <IonInput
                  type="number"
                  value={doorQuantity}
                  onIonChange={(e) =>
                    setDoorQuantity(parseInt(e.detail.value ?? "0"))
                  }
                />
              </IonItem>
            </IonCard>
          </IonCol>
        </IonRow>
        {/* Fourth Row */}
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <strong>Misc Options</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonRow>
                <IonCol size="4">
                  <IonCard>
                    <IonItem>
                      <IonLabel>Dripstop?:</IonLabel>
                      <IonCheckbox
                        checked={dripStop}
                        onIonChange={(e) => setDripStop(e.detail.checked)}
                      />
                    </IonItem>
                  </IonCard>
                </IonCol>
                <IonCol size="4">
                  <IonCard>
                    <IonItem>
                      <IonLabel position="stacked">Eave Extension:</IonLabel>
                      <IonSelect
                        value={eaveExtension}
                        onIonChange={(e) => setEaveExtension(e.detail.value)}
                        defaultValue={EAVE_EXTENSION.ZERO}
                      >
                        {Object.values(EAVE_EXTENSION).map((extension) => (
                          <IonSelectOption key={extension} value={extension}>
                            {extension}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCard>
                </IonCol>
                <IonCol size="4">
                  <IonCard>
                    <IonItem>
                      <IonLabel>Has Permit</IonLabel>
                      <IonCheckbox
                        checked={hasPermit}
                        onIonChange={(e) => setHasPermit(e.detail.checked)}
                      />
                    </IonItem>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonCard>
          </IonCol>
        </IonRow>
        {/* Fifth Row (Calculate Buttons) */}
        <IonRow>
          <IonCol>
            <IonButton
              color="primary"
              expand="full"
              onClick={calculateTotalCost}
            >
              <strong>Calcualte Total</strong>
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              color="secondary"
              expand="full"
              onClick={resetCalculator}
            >
              <strong>RESET</strong>
            </IonButton>
          </IonCol>
        </IonRow>
        {/* COST BREAKDOWN */}
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Cost Breakdown</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {aggregatedBreakdown.map((detail, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      <p>
                        <strong>{detail.item} | </strong>
                        {detail.color && <strong> Color:</strong>}{" "}
                        {detail.color}
                        <strong> Quantity:</strong> {detail.quantity},
                        {detail.linearFeet && (
                          <>
                            <strong> LF:</strong> {detail.linearFeet},{" "}
                          </>
                        )}
                        <strong> Unit Price:</strong> $
                        {detail.unitPrice
                          ? detail.unitPrice.toFixed(2)
                          : "0.00"}
                        ,<strong> Total:</strong> $
                        {detail.total ? detail.total.toFixed(2) : "0.00"}
                      </p>
                    </IonLabel>
                  </IonItem>
                ))}

                <IonText style={{ fontSize: "1.25rem", color: "black" }}>
                  <strong>Total Cost: ${totalCost.toFixed(2)}</strong>
                </IonText>
                <IonCol>
                  <IonButton expand="full" onClick={exportToExcel}>
                    Export To Excel
                    <IonIcon icon={downloadOutline} />
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="full" onClick={handleExportToPdfClick}>
                    Export to PDF
                    <IonIcon icon={documentsOutline} />
                  </IonButton>
                </IonCol>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        {/* ALERT */}
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
