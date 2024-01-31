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
import {
  add,
  addOutline,
  documentsOutline,
  downloadOutline,
  removeOutline,
} from "ionicons/icons";
import Excel from "exceljs";
import desiredOrder from "./desiredOrder";
import itemToGroupMap from "./itemToGroupMap";
import { PDFDocument, StandardFonts } from "pdf-lib";

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
  const [includeLaborCost, setIncludeLaborCost] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState("");
  const [phoneValidationMessage, setPhoneValidationMessage] = useState("");
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false); // New state variable
  const [widthAlertMessage, setWidthAlertMessage] = useState("");
  const [showWidthAlert, setShowWidthAlert] = useState(false);
  const [gutterColor, setGutterColor] = useState("");

  // Toggle function
  const toggleBreakdownVisibility = () => {
    setIsBreakdownVisible(!isBreakdownVisible);
  };
  // Explicitly declare WALL_OPTIONS with its type
  const WALL_OPTIONS: { [key: string]: string | number } = {
    ZERO: 0,
    THREE_FEET: "3'",
    SIX_FEET: "6'",
    NINE_FEET: "9'",
    FULLY_ENCLOSED: "Fully Enclosed",
  };
  const FRONT_REAR_WALL_OPTIONS = {
    ...WALL_OPTIONS,
    PEAK_ONLY: "Peak Only",
  };

  const EAVE_EXTENSION = {
    ZERO: 0,
    SIX: '6"',
    NINE: '9"',
    TEWELVE: '12"',
    EIGHTEEN: '18"',
    TWENTY_FOUR: '24"',
  };
  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation function
  const validatePhoneNumber = (phone: any) => {
    return phone.length === 10; // Assuming US phone numbers without country code
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
  // Update handle change functions
  const handleEmailChange = (e: any) => {
    const newEmail = e.detail.value ?? "";
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailValidationMessage("Please enter a valid email address.");
    } else {
      setEmailValidationMessage("");
    }
  };

  const handlePhoneChange = (e: any) => {
    const newPhone = e.detail.value ?? "";
    setPhone(newPhone);
    if (!validatePhoneNumber(newPhone)) {
      setPhoneValidationMessage("Phone number must be 10 digits.");
    } else {
      setPhoneValidationMessage("");
    }
  };
  const handleWidthChange = (e: any) => {
    const newWidth = parseInt(e.detail.value ?? "0");
    if (newWidth % 2 === 0) {
      setWidth(newWidth.toString());
    } else {
      setWidthAlertMessage("Width must be in 2' increments");
      setShowWidthAlert(true);
    }
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

  // Initialize frontWallData and rearWallData
  let frontWallData = { cost: 0, quantity: 0, linearFeet: "0'" };
  let rearWallData = { cost: 0, quantity: 0, linearFeet: "0'" };

  const calculateTotalCost = () => {
    const numWidth = parseInt(width);
    const numLength = parseInt(buildingLength);
    const numHeight = parseInt(height);
    // Calculate the number of grid lines
    const gridLines = Math.ceil(numLength / 5) + 1;
    let calculatedTotalCost = 0;
    let breakdownDetails: any = [];
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

    // Updated distributeHatChannelLength function
    const distributeHatChannelLength = (
      numLength: any,
      hatChannelQuantity: number
    ) => {
      let lengths = [];
      let remainingLength = numLength;

      while (remainingLength > 0 && hatChannelQuantity > 0) {
        let length;
        if (remainingLength >= 20) {
          length = 20;
        } else if (remainingLength >= 15) {
          length = 15;
        } else if (remainingLength >= 10) {
          length = 10;
        } else {
          length = remainingLength; // Use the remaining length if it's less than 10
        }

        lengths.push(length); // Add 6 inches to each length
        remainingLength -= length;
        hatChannelQuantity--;
      }

      return lengths;
    };

    const hatChannelLengths = distributeHatChannelLength(
      numLength,
      hatChannelQuantity
    );

    hatChannelLengths.forEach((length) => {
      let individualHatChannelCost = length * BASE_UNIT_COSTS["HatChannel"];
      hatChannelCost += individualHatChannelCost * hatChannelQuantity; // Update total hat channel cost

      breakdownDetails.push({
        item: "HAT CHANNEL",
        quantity: hatChannelQuantity, // Updated to use hatChannelQuantity
        unitPrice: BASE_UNIT_COSTS["HatChannel"],
        total: individualHatChannelCost * hatChannelQuantity, // Multiply individual cost by quantity
        linearFeet: `${decimalFeetToFeetInches(length + 0.5)}`, // Add 6 inches to each length
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
    // let angleClipQuantity = totalLegs * 2; // 4 AngleClips per leg
    let angleClipQuantity = 0;
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
      let wallHeightMultiplier = 0;
      switch (wallSelection) {
        case WALL_OPTIONS.THREE_FEET:
          wallHeightMultiplier = 1;
          break;
        case WALL_OPTIONS.SIX_FEET:
          wallHeightMultiplier = 2;
          break;
        case WALL_OPTIONS.NINE_FEET:
          wallHeightMultiplier = 3;
          break;
        case WALL_OPTIONS.FULLY_ENCLOSED:
          wallHeightMultiplier = 4; // Send 4 sheets for fully enclosed
          break;
        default:
          wallHeightMultiplier = 0;
      }

      const sheetLengthsMap: any = {
        15: [15],
        20: [20],
        25: [15, 10],
        30: [15, 15],
        35: [20, 15],
        40: [20, 20],
        45: [20, 10, 15],
        50: [20, 20, 10],
        55: [20, 20, 15],
        60: [20, 20, 20],
        65: [20, 20, 15, 10],
      };

      let sheetLengths = sheetLengthsMap[buildingLength] || [buildingLength]; // Default to building length if not in map

      const sheets: any[] = [];
      sheetLengths.forEach((baseLength: any) => {
        let sheetLength = baseLength;
        // Add 6 inches to each sheet length if the building length is more than 20 feet
        if (buildingLength > 20) {
          sheetLength += 0.5; // 0.5 feet is 6 inches
        }
        // Here, we simply use the wallHeightMultiplier as the quantity
        sheets.push({
          length: sheetLength,
          quantity: wallHeightMultiplier,
        });
      });

      return sheets;
    };

    // Calculate M29 Trim for each wall
    const MAX_TRIM_LENGTH = 10.25; // 10'3" in decimal feet

    const calculateTrimForWall = (
      wallHeight: any,
      wallSide: any,
      buildingLength: any
    ) => {
      if (wallHeight !== WALL_OPTIONS.ZERO) {
        const trimLF =
          wallHeight === WALL_OPTIONS.FULLY_ENCLOSED
            ? numHeight
            : parseInt(wallHeight);
        const numberOfTrimPieces = Math.ceil(buildingLength / MAX_TRIM_LENGTH);

        const totalTrimCost = [];

        for (let i = 0; i < numberOfTrimPieces; i++) {
          totalTrimCost.push({
            item: `${wallSide} Wall M-29 J Trim`,
            quantity: 1,
            unitPrice: BASE_UNIT_COSTS["M29Trim"],
            total: MAX_TRIM_LENGTH * BASE_UNIT_COSTS["M29Trim"],
            linearFeet: `${decimalFeetToFeetInches(MAX_TRIM_LENGTH)}`, // Fixed length for each piece
            color: trimColor,
          });
        }

        return totalTrimCost;
      }
      return [];
    };

    // Replace the existing calls to calculateTrimForWall with the updated function
    let totalM29TrimCost = 0;
    const leftWallTrim = calculateTrimForWall(leftWall, "Left", numLength);
    const rightWallTrim = calculateTrimForWall(rightWall, "Right", numLength);

    // Calculate the total cost and add to breakdown details
    leftWallTrim.concat(rightWallTrim).forEach((trim) => {
      totalM29TrimCost += trim.total;
      breakdownDetails.push(trim);
    });

    const calculateTrimFrontRear = () => {
      // Only add trim to the front/rear walls if the corresponding side wall does not have trim
      if (leftWall === WALL_OPTIONS.ZERO && rightWall === WALL_OPTIONS.ZERO) {
        const frontWallTrims = calculateTrimForWall(
          frontWall,
          "Front",
          numWidth
        ); // Assuming numWidth is the width of the building
        const rearWallTrims = calculateTrimForWall(rearWall, "Rear", numWidth); // Assuming numWidth is the width of the building

        // Iterate over the front wall trims and add them to the breakdown details
        frontWallTrims.forEach((trimPiece) => {
          totalM29TrimCost += trimPiece.total;
          breakdownDetails.push(trimPiece);
        });

        // Iterate over the rear wall trims and add them to the breakdown details
        rearWallTrims.forEach((trimPiece) => {
          totalM29TrimCost += trimPiece.total;
          breakdownDetails.push(trimPiece);
        });
      }
    };

    calculateTrimFrontRear();

    // Structural Screw Calculation
    const screwsPerLeg = 4; // Assuming 4 screws are needed per leg
    const structuralScrewQuantityForLegs =
      totalLegs * screwsPerLeg * tallestSidewallHeight;

    let totalHatChannelLF = 0;
    hatChannelLengths.forEach((length) => {
      totalHatChannelLF += length; // Summing up the lengths of all hat channel pieces
    });
    console.log(totalHatChannelLF);
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
      color: roofSheathingColor,
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
    const r1Quantity = gridLines; // Number of R1s needed
    const r1UnitCost = BASE_UNIT_COSTS["R1Peak"]; // Unit cost for one R1
    const r1Cost = r1Quantity * r1UnitCost; // Total cost for R1s
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

    // Inside calculateTotalCost function, after calculating other costs
    const adjustedWidthForR2 = numWidth / 2 + eaveExtensionInFeet; // Add eave extension to half of the width
    const hypotenuseLength = calculateTriangleDimensions(
      adjustedWidthForR2,
      PITCH_RISE,
      PITCH_RUN
    ).hypotenuse;
    console.log(hypotenuseLength);
    const r2LengthPerPiece = Math.max(hypotenuseLength - 24 / 12, 0) + 0.25; // Subtract 24 inches, converted to feet for the R1, plus 3 inches for the R2
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
    const roofSheetWidth = 3; // Width of each roof sheet in feet

    // Add 3 inches to the roof panel length if either left or right gutters are selected
    const extraLengthForGutters = 1.5 / 12;

    // Calculate the length of each roof sheet
    const roofSheetLengthInDecimalFeet = Math.min(
      r2LengthPerPiece +
        2 +
        extraLengthForGutters +
        eaveExtensionInFeet -
        2 / 12, // Subtract 2 inches for overlap
      21 // Max length of roof sheet is 21 feet
    );
    const roofSheetLengthInFeetInches = decimalFeetToFeetInches(
      roofSheetLengthInDecimalFeet
    );

    // Calculate the total number of roof sheets for both sides
    const totalRoofSheets = Math.ceil(numLength / roofSheetWidth) * 2;

    // Calculate the total linear feet for all roof sheets
    const totalRoofSheetsLF = roofSheetLengthInDecimalFeet * totalRoofSheets;

    // Calculate the cost per linear foot from your pricing data
    const roofSheetCostPerLF = BASE_UNIT_COSTS["RoofSheet"];

    // Calculate the total cost for all roof sheets
    const totalRoofSheetCost = totalRoofSheetsLF * roofSheetCostPerLF;

    // Dripstop logic
    const dripStopNote = dripStop ? "W/ DRIPSTOP" : "";

    // Add Roof Sheathing to breakdown details
    breakdownDetails.push({
      item: "26ga HHR ROOF SHEETS",
      quantity: totalRoofSheets,
      unitPrice: roofSheetCostPerLF, // Cost per linear foot
      total: totalRoofSheetCost, // Total cost for all roof sheets
      linearFeet: roofSheetLengthInFeetInches, // Length of each roof sheet in feet and inches
      color: roofSheathingColor,
      notes: dripStopNote,
    });
    // Calculate the total area of roof sheathing
    const roofSheetAreaInSqFt = roofSheetLengthInDecimalFeet * roofSheetWidth; // Area of a single roof sheet
    const totalRoofSheetArea = roofSheetAreaInSqFt * totalRoofSheets; // Total area for all roof sheets

    // Calculate Dripstop cost if selected
    let dripStopCost = 0;
    if (dripStop) {
      const dripStopCostPerSqFt = 1.4; // Cost per square foot
      dripStopCost = totalRoofSheetArea * dripStopCostPerSqFt;
      breakdownDetails.push({
        item: "DRIPSTOP",
        quantity: `${totalRoofSheetArea.toFixed()} SF`, // Total area in square feet
        unitPrice: dripStopCostPerSqFt,
        total: dripStopCost,
      });
    }

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
    // let straightClipQuantity = gridLines * 4; // 4 Straight Clips per King Pin
    // straightClipQuantity += totalLegs * 2; // 2 Straight Clips per leg
    let straightClipQuantity = 0;
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

    // Example for left wall sheets
    // Example for left wall sheets
    const leftWallSheets = calculateSidewallSheets(leftWall, numLength);
    leftWallSheets.forEach((sheet) => {
      if (sheet.quantity > 0) {
        // Add this check
        leftWallCost +=
          sheet.length * sheet.quantity * BASE_UNIT_COSTS["SidewallSheet"];

        breakdownDetails.push({
          item: `26ga Left Wall Sidewall Sheets`,
          quantity: sheet.quantity,
          unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
          total:
            sheet.length * sheet.quantity * BASE_UNIT_COSTS["SidewallSheet"],
          linearFeet: `${decimalFeetToFeetInches(sheet.length)}`,
          color: wallSheathingColor,
        });
      }
    });

    // Similar checks should be added wherever you are pushing items to the breakdownDetails

    // Right Wall Sheets
    if (rightWall !== WALL_OPTIONS.ZERO) {
      const rightWallSheets = calculateSidewallSheets(rightWall, numLength);
      let totalRightWallLF = 0;

      rightWallSheets.forEach((sheet) => {
        totalRightWallLF += sheet.length;
        rightWallCost +=
          sheet.length * sheet.quantity * BASE_UNIT_COSTS["SidewallSheet"];

        breakdownDetails.push({
          item: `26ga Right Wall Sidewall Sheets`,
          quantity: sheet.quantity,
          unitPrice: BASE_UNIT_COSTS["SidewallSheet"],
          total:
            sheet.length * sheet.quantity * BASE_UNIT_COSTS["SidewallSheet"],
          linearFeet: `${decimalFeetToFeetInches(sheet.length)}`,
          color: wallSheathingColor,
        });
      });
    }

    // Calculate costs for front and rear walls
    if (frontWall !== WALL_OPTIONS.ZERO) {
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
    }

    // Rear Wall
    if (rearWall !== WALL_OPTIONS.ZERO) {
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
    }

    // Inside calculateTotalCost function, after existing calculations
    // Calculate Tek Screws
    const tekScrewCostPerUnit = BASE_UNIT_COSTS["TekScrew"];
    let totalTekScrews = 0;
    let tekScrewCost = 0;
    const tekScrewsPerHatChannelPiece = 6; // Assuming 6 tek screws per hat channel piece
    let totalTekScrewsForHatChannels = 0;
    hatChannelLengths.forEach((length) => {
      // Assuming each length of hat channel gets 6 tek screws
      totalTekScrewsForHatChannels += tekScrewsPerHatChannelPiece;
    });
    totalTekScrews += totalTekScrewsForHatChannels; // Add tek screws for hat channels to total tek screws count

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
    let m29GableTrimLength = hypotenuseLength; // Same length as the R2 hypotenuse
    let m29GableTrimCost = m29GableTrimLength * BASE_UNIT_COSTS["M29GableTrim"];

    // M29GableTrim calculations with overlap
    m29GableTrimLength += 0.75; // Add 8 inches for overlap
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

    // Inside the calculateTotalCost function, find the section where you handle Eave Trim calculations.

    const eaveTrimLengthPerPiece = 10.25; // Length of each eave trim piece in feet (10' 3")
    const buildingLengthInFeet = parseFloat(buildingLength); // Convert the building length to a float
    const eaveTrimPieces = Math.ceil(
      buildingLengthInFeet / eaveTrimLengthPerPiece
    ); // Calculate the number of pieces, rounded up

    let eaveTrimCostPerUnit = BASE_UNIT_COSTS["EaveTrim"]; // Ensure this is defined in your BASE_UNIT_COSTS

    // Function to determine the eave trim type
    const determineEaveTrimType = (wallOption: any) => {
      return wallOption === WALL_OPTIONS.ZERO
        ? "M-30 EAVE CLOSURE TRIM"
        : "M-31 EAVE CLOSURE TRIM";
    };

    // Calculate eave trim for the left side
    const leftEaveTrimType = determineEaveTrimType(leftWall);
    const leftEaveTrimCost =
      eaveTrimPieces * eaveTrimLengthPerPiece * eaveTrimCostPerUnit;

    // Add left Eave Trim details to the breakdown
    breakdownDetails.push({
      item: leftEaveTrimType,
      quantity: eaveTrimPieces,
      unitPrice: eaveTrimCostPerUnit,
      total: leftEaveTrimCost,
      linearFeet: `${decimalFeetToFeetInches(eaveTrimLengthPerPiece)}`,
      color: trimColor,
    });

    // Calculate eave trim for the right side
    const rightEaveTrimType = determineEaveTrimType(rightWall);
    const rightEaveTrimCost =
      eaveTrimPieces * eaveTrimLengthPerPiece * eaveTrimCostPerUnit;

    // Add right Eave Trim details to the breakdown
    breakdownDetails.push({
      item: rightEaveTrimType,
      quantity: eaveTrimPieces,
      unitPrice: eaveTrimCostPerUnit,
      total: rightEaveTrimCost,
      linearFeet: `${decimalFeetToFeetInches(eaveTrimLengthPerPiece)}`,
      color: trimColor,
    });

    // Inside calculateTotalCost function, replace the existing Ridge Cap calculations with:

    // Ridge Cap calculations
    const ridgeCapLengthPerPiece = 10.25; // Length of each ridge cap piece in feet (10' 3")
    const ridgeCapPieces = Math.ceil(
      buildingLengthInFeet / ridgeCapLengthPerPiece
    ); // Calculate the number of pieces, rounded up

    // Calculate the cost of ridge cap
    let ridgeCapCostPerUnit = BASE_UNIT_COSTS["RidgeCap"]; // Ensure this is defined in your BASE_UNIT_COSTS
    let ridgeCapCost =
      ridgeCapPieces * ridgeCapLengthPerPiece * ridgeCapCostPerUnit;

    // Add updated Ridge Cap details to the breakdown
    breakdownDetails.push({
      item: "M-33 RIDGE CAP",
      quantity: ridgeCapPieces,
      unitPrice: ridgeCapCostPerUnit,
      total: ridgeCapCost,
      linearFeet: `${decimalFeetToFeetInches(ridgeCapLengthPerPiece)}`,
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
      if (!sideSelected || isNaN(buildingLength) || buildingLength <= 0)
        return {};

      const MAX_GUTTER_LENGTH = 14.5; // 14'6" in decimal feet
      let numberOfGutterPieces = Math.ceil(buildingLength / MAX_GUTTER_LENGTH);
      let gutterPieceLength = buildingLength / numberOfGutterPieces;
      gutterPieceLength = Math.round(gutterPieceLength * 10) / 10; // Round to nearest tenth

      if (gutterPieceLength + 0.5 > MAX_GUTTER_LENGTH) {
        gutterPieceLength = MAX_GUTTER_LENGTH;
        numberOfGutterPieces = Math.ceil(buildingLength / gutterPieceLength);
      } else {
        gutterPieceLength += 0.5; // Add 6 inches for overlap
      }

      let numberOfDownspouts = buildingLength >= 40 ? 2 : 1;

      let gutterItems = {
        "K5 Gutter": numberOfGutterPieces,
        "K5 Downspout": numberOfDownspouts,
        "K5 EndCap": 2,
        "K5 DownspoutStrap": numberOfDownspouts,
        "K5 Clip": numberOfGutterPieces * Math.ceil(gutterPieceLength / 1.5),
        "K5 ElbowA": numberOfDownspouts,
        "K5 ElbowB": numberOfDownspouts,
        "K5 Gutter Screw": Math.ceil(buildingLength), // Assuming 1 screw per foot
        NovaFlex: 1,
        GutterPieceLength: gutterPieceLength, // Store the gutter piece length
      };

      return gutterItems;
    };

    // Calculate Gutter Costs
    const gutterCosts = (gutterItems: any) => {
      let totalCost = 0;
      let linearFeetString = "";

      for (const item in gutterItems) {
        if (item === "GutterPieceLength") continue; // Skip this item

        const quantity = gutterItems[item];
        const unitCost = BASE_UNIT_COSTS[item.replace(/\s/g, "")];

        let total = 0;
        if (item === "K5 Gutter") {
          const linearFeet = quantity * gutterItems["GutterPieceLength"];
          total = linearFeet * unitCost;
          linearFeetString = decimalFeetToFeetInches(
            gutterItems["GutterPieceLength"]
          );
        } else {
          total = quantity * unitCost;
        }

        totalCost += total;

        breakdownDetails.push({
          item: item,
          quantity: quantity,
          unitPrice: unitCost,
          total: total,
          linearFeet: item === "K5 Gutter" ? linearFeetString : undefined,
          color: gutterColor,
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

    // // Add Butyl Tape to the breakdown
    // const butylTapeCost = BASE_UNIT_COSTS["ButylTape"];
    // breakdownDetails.push({
    //   item: "Butyl Tape",
    //   quantity: 1,
    //   // linearFeet: length * 2,
    //   unitPrice: butylTapeCost,
    //   total: butylTapeCost,
    // });

    // Declare additionalLegCost at the start of calculateTotalCost function
    let additionalLegCost = 0;
    const runnerLength = parseFloat(width) - 5 / 12; // Convert 5 inches to feet and subtract from width

    // Define unit price for a runner
    const runnerUnitPrice = BASE_UNIT_COSTS["Runner"];

    // Calculate total cost for front and rear runners
    const frontRunnerTotalCost = runnerLength * runnerUnitPrice;
    const rearRunnerTotalCost = runnerLength * runnerUnitPrice;
    // Existing logic for checking frontWall and rearWall
    if (
      frontWall === WALL_OPTIONS.SIX_FEET ||
      frontWall === WALL_OPTIONS.NINE_FEET ||
      frontWall === WALL_OPTIONS.FULLY_ENCLOSED
    ) {
      // Calculate the number of additional legs needed for front wall
      const additionalLegs = Math.floor(parseInt(width) / 5) - 1;
      additionalLegCost += additionalLegs * legCostPerUnit; // Add to additionalLegCost
      straightClipQuantity += additionalLegs * 2; // Add 2 Straight Clips per additional leg
      angleClipQuantity += additionalLegs * 2; // Add 2 Angle Clips per additional leg
      const runnerLength = parseFloat(width) - 5 / 12; // Convert 5 inches to feet and subtract from width

      breakdownDetails.push({
        item: "FRONT RUNNER",
        quantity: 1,
        unitPrice: runnerUnitPrice,
        total: frontRunnerTotalCost,
        linearFeet: `${decimalFeetToFeetInches(runnerLength.toFixed(2))}'`,
      });

      // Add the additional legs to the breakdown details
      breakdownDetails.push({
        item: "FRONT LEGS",
        quantity: additionalLegs,
        unitPrice: legCostPerUnit,
        total: additionalLegCost,
        linearFeet: `${numHeight}'`, // Height of each additional leg
      });
    }
    if (
      rearWall === WALL_OPTIONS.SIX_FEET ||
      rearWall === WALL_OPTIONS.NINE_FEET ||
      rearWall === WALL_OPTIONS.FULLY_ENCLOSED
    ) {
      // Calculate the number of additional legs needed for rear wall
      const additionalLegs = Math.floor(parseInt(width) / 5) - 1;
      additionalLegCost += additionalLegs * legCostPerUnit; // Add to additionalLegCost
      straightClipQuantity += additionalLegs * 2; // Add 2 Straight Clips per additional leg
      angleClipQuantity += additionalLegs * 2; // Add 2 Angle Clips per additional leg

      // Add the additional legs to the breakdown details
      breakdownDetails.push({
        item: "REAR LEGS",
        quantity: additionalLegs,
        unitPrice: legCostPerUnit,
        total: additionalLegCost,
        linearFeet: `${numHeight}'`, // Height of each additional leg
      });
      breakdownDetails.push({
        item: "REAR RUNNER",
        quantity: 1,
        unitPrice: runnerUnitPrice,
        total: rearRunnerTotalCost,
        linearFeet: `${decimalFeetToFeetInches(runnerLength.toFixed(2))}'`,
      });
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
      leftEaveTrimCost +
      rightEaveTrimCost +
      ridgeCapCost +
      gutterCostLeft +
      gutterCostRight +
      // butylTapeCost +
      additionalLegCost +
      dripStopCost;

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
      totalCostRow.font = {
        bold: true,
        color: { argb: "FF000000" },
        size: 14,
      };
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
    } else if (selectedColorType === "gutter") {
      setGutterColor(color);
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
      const response = await fetch("./quoteForm.pdf");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const pdfBuffer = await response.arrayBuffer();

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Get the form within the document
      const form = pdfDoc.getForm();
      const helveticaFont = await pdfDoc.embedStandardFont(
        StandardFonts.Helvetica
      );

      // Get the fields
      const firstNameField = form.getTextField("firstName");
      const lastNameField = form.getTextField("lastName");
      const quoteNumberField = form.getTextField("quoteNumber");
      const emailField = form.getTextField("email");
      const totalPriceField = form.getTextField("Total");
      const laborField = form.getTextField("Labor");
      const deliveryField = form.getTextField("Delivery");
      const taxField = form.getTextField("Tax");
      const grandTotalField = form.getTextField("GrandTotal");
      const subTotalField = form.getTextField("Subtotal");
      const phoneField = form.getTextField("phone");
      const billToNameField = form.getTextField("billToName");
      const contactNameField = form.getTextField("contactName");
      const projectNameField = form.getTextField("buildingSize");
      const siteAddressField = form.getTextField("siteAddress");
      const billingAddressField = form.getTextField("billingAddress");
      // Get the Dripstop field
      const dripStopField = form.getTextField("Dripstop");
      const wallColorField = form.getTextField("wallColor");
      const trimColorField = form.getTextField("trimColor");
      const roofColorField = form.getTextField("roofColor");

      // Set the text for the color fields
      wallColorField.setText(wallSheathingColor);
      trimColorField.setText(trimColor);
      roofColorField.setText(roofSheathingColor);

      // Ensure totalPrice is a number
      totalPrice = parseFloat(totalPrice);

      // Set the total price
      totalPriceField.setText(`$${totalPrice.toString()}`);

      // Calculate and set delivery cost
      const delivery = 500; // Assuming this is a fixed number
      deliveryField.setText(`$${delivery.toString()}`);

      // Calculate and set labor cost
      const laborCost = includeLaborCost
        ? parseFloat((totalPrice * 0.45).toFixed(2))
        : 0;
      laborField.setText(`$${laborCost.toString()}`);

      // Calculate and set tax
      const tax = parseFloat((totalPrice * 0.07).toFixed(2));
      taxField.setText(`$${tax.toString()}`);

      // Calculate and set subtotal
      const subTotal = totalPrice + laborCost + delivery;
      subTotalField.setText(`$${subTotal.toFixed(2)}`);

      // Calculate and set grand total
      const grandTotal = subTotal + tax;
      grandTotalField.setText(`$${grandTotal.toFixed(2)}`);

      // Calculate and set quote number
      const quoteNumber = `M${phone.slice(-7)}`;
      quoteNumberField.setText(quoteNumber);

      // Fill out and set client information
      firstNameField.setText(firstName);
      lastNameField.setText(lastName);
      emailField.setText(email);
      phoneField.setText(
        `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
      );

      // Set the Dripstop text based on the dripStop state
      const dripStopText = dripStop ? "Yes" : "No";
      dripStopField.setText(dripStopText);

      // Fill out and set billing information
      billToNameField.setText(`${firstName} ${lastName}`);
      contactNameField.setText(`${firstName} ${lastName}`);
      projectNameField.setText(`${width}' x ${buildingLength}' x ${height}'`);
      siteAddressField.setText(`${address}, ${city}, ${state} ${zipCode}`);
      billingAddressField.setText(`${address}, ${city}, ${state} ${zipCode}`);

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
                <strong>A-Frame Vertical Quotes Calculator 🧮</strong>
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
                <IonLabel position="stacked">
                  <strong>First Name:</strong>
                </IonLabel>
                <IonInput
                  type="text"
                  value={firstName}
                  onIonChange={(e) => setFirstName(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  <strong>Last Name:</strong>
                </IonLabel>
                <IonInput
                  type="text"
                  value={lastName}
                  onIonChange={(e) => setLastName(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  <strong>Email:</strong>
                </IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={handleEmailChange}
                />
                {emailValidationMessage && (
                  <IonText color="danger">{emailValidationMessage}</IonText>
                )}
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  <strong>Phone:</strong>
                </IonLabel>
                <IonInput
                  type="tel"
                  value={phone}
                  onIonChange={handlePhoneChange}
                />
                {phoneValidationMessage && (
                  <IonText color="danger">{phoneValidationMessage}</IonText>
                )}
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
                <IonLabel position="stacked">
                  <strong>City:</strong>
                </IonLabel>
                <IonInput
                  type="text"
                  value={city}
                  onIonChange={(e) => setCity(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  <strong>State:</strong>
                </IonLabel>
                <IonInput
                  type="text"
                  value={state}
                  onIonChange={(e) => setState(e.detail.value ?? "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  <strong>ZipCode:</strong>
                </IonLabel>
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
                  Width (Min: 10', Max: 30', Even Numbers Only):
                </IonLabel>
                <IonInput
                  type="number"
                  value={width}
                  onIonChange={handleWidthChange}
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
              <IonAlert
                isOpen={showWidthAlert}
                onDidDismiss={() => setShowWidthAlert(false)}
                header={"Invalid Width"}
                message={widthAlertMessage}
                buttons={["OK"]}
              />
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
                    <IonLabel position="stacked">
                      <strong>Left Wall:</strong>
                    </IonLabel>
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
                    <IonLabel position="stacked">
                      <strong>Right Wall:</strong>
                    </IonLabel>
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
                    <IonLabel position="stacked">
                      <strong>Front Wall:</strong>
                    </IonLabel>
                    <IonSelect
                      value={frontWall}
                      onIonChange={(e) => setFrontWall(e.detail.value)}
                    >
                      {Object.values(FRONT_REAR_WALL_OPTIONS).map((option) => (
                        <IonSelectOption key={`front-${option}`} value={option}>
                          {option}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="stacked">
                      <strong>Rear Wall:</strong>
                    </IonLabel>
                    <IonSelect
                      value={rearWall}
                      onIonChange={(e) => setRearWall(e.detail.value)}
                    >
                      {Object.values(FRONT_REAR_WALL_OPTIONS).map((option) => (
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
                <IonCol>
                  <IonLabel>Gutter Color:</IonLabel>
                  <IonButton
                    color={
                      gutterColor ? toCssClassName(gutterColor) : "primary"
                    }
                    expand="block"
                    onClick={() => openColorSelector("gutter")}
                  >
                    {gutterColor || "Select Gutter Color"}
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
                <IonCol size="3">
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
                <IonCol size="3">
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
                <IonCol size="3">
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
                <IonCol size="3">
                  <IonCard>
                    <IonItem>
                      <IonLabel>Include Labor Cost:</IonLabel>
                      <IonCheckbox
                        checked={includeLaborCost}
                        onIonChange={(e) =>
                          setIncludeLaborCost(e.detail.checked)
                        }
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
                <IonRow>
                  <IonCol size="9">
                    <IonCardTitle>Cost Breakdown</IonCardTitle>
                  </IonCol>
                  <IonCol size="3">
                    {/* Toggle Breakdown Button */}
                    <IonButton
                      expand="full"
                      onClick={toggleBreakdownVisibility}
                      style={{ float: "right" }}
                    >
                      {isBreakdownVisible ? (
                        <>
                          Hide Breakdown <IonIcon icon={removeOutline} />
                        </>
                      ) : (
                        <>
                          Show Breakdown <IonIcon icon={addOutline} />
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardHeader>
              <IonCardContent>
                {isBreakdownVisible ? (
                  <>
                    {aggregatedBreakdown.map((detail, index) => {
                      if (detail.quantity === 0) {
                        return null;
                      }
                      return (
                        <IonItem key={index}>
                          <IonLabel>
                            <p>
                              <strong>{detail.item} | </strong>
                              {detail.color && <strong>Color:</strong>}{" "}
                              {detail.color}
                              <strong> Quantity:</strong> {detail.quantity},
                              {detail.linearFeet && (
                                <>
                                  <strong> LF:</strong> {detail.linearFeet},
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
                      );
                    })}
                  </>
                ) : null}

                <IonText style={{ fontSize: "1.25rem" }}>
                  <strong>Total Cost: ${totalCost.toFixed(2)}</strong>
                </IonText>
                <IonRow>
                  <IonCol>
                    <IonButton expand="full" onClick={exportToExcel}>
                      Export To Excel
                      <IonIcon icon={downloadOutline} />
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      color={"danger"}
                      expand="full"
                      onClick={handleExportToPdfClick}
                    >
                      Export to PDF
                      <IonIcon icon={documentsOutline} />
                    </IonButton>
                  </IonCol>
                </IonRow>
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
