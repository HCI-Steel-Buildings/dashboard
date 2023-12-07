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
  endWallSheets: number;
  endWallAnchors: number;
  endWallRunners: number;
  endWallTekScrews: number;
  endWallStitchScrews: number;
  endWallStructuralScrews: number;
  endWallClips: number;
  clips: number;
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 95.58,
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
      Sheet: 95.58,
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
      Sheet: 95.58,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
      Sheet: 106.2,
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
  const [totalWindows, setTotalWindows] = useState(0);
  const [totalLegs, setTotalLegs] = useState(0);
  const [totalAnchors, setTotalAnchors] = useState(0);
  const [totalAnchorsConcrete, setTotalAnchorsConcrete] = useState(0);
  const [totalStitchScrews, setTotalStitchScrews] = useState(0);
  const [totalStructuralScrews, setTotalStructuralScrews] = useState(0);
  const [totalTekScrews, setTotalTekScrews] = useState(0);
  const [totalRunners, setTotalRunners] = useState(0);
  const [totalElbowBraces, setTotalElbowBraces] = useState(0);
  const [totalRafters, setTotalRafters] = useState(0);
  const [totalClips, setTotalClips] = useState(0);
  const [totalSheets, setTotalSheets] = useState(0);

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
    let clipsQuantity = 0;
    let rafterQuantity = 5;
    let runnersQuantity = 2;
    let tekScrewsQuantity = 0;
    let elbowBraceQuantity = 0;
    let sheetsQuantity = 0;
    if (selectedHeight === "Height A (8')") {
      stitchScrewsQuantity = 20; // 20 stitch screws for 8' height
      structuralScrewsQuantity = 80; // 80 structural screws for 8' height
      sheetsQuantity = 4;
    } else if (selectedHeight === "Height B (10')") {
      stitchScrewsQuantity = 30; // 30 stitch screws for 10' height
      structuralScrewsQuantity = 90; // 90 structural screws for 10' height
      sheetsQuantity = 5;
    } else if (selectedHeight === "Height C (12')") {
      stitchScrewsQuantity = 30; // 30 stitch screws for 12' height
      structuralScrewsQuantity = 100; // 100 structural screws for 12' height
      sheetsQuantity = 6;
    }

    if (selectedSize === "12x20") {
      tekScrewsQuantity = 72; // 72
      elbowBraceQuantity = 6; // 6 elbow braces
      // add additional strucutral screws for roof sheathing
      structuralScrewsQuantity += 160;
      // add additional stitch screws for roof sheathing
      stitchScrewsQuantity += 60;
    } else if (selectedSize === "18x20") {
      tekScrewsQuantity = 72; // 72
      elbowBraceQuantity = 10; // 10 elbow braces
      structuralScrewsQuantity += 160;
      stitchScrewsQuantity += 60;
    } else if (selectedSize === "20x20") {
      tekScrewsQuantity = 100; // 100
      elbowBraceQuantity = 10; // 10 elbow braces
      structuralScrewsQuantity += 200;
      stitchScrewsQuantity += 60;
    } else if (selectedSize === "24x20") {
      tekScrewsQuantity = 100; // 100
      elbowBraceQuantity = 6; // 6 elbow braces
      structuralScrewsQuantity += 240;
      stitchScrewsQuantity += 60;
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
    // Update the quantities
    setTotalWindows(windowQuantity);
    setTotalLegs(baseLegs + additionalLegs);
    setTotalAnchors(totalAnchors);
    setTotalAnchorsConcrete(
      groundType === GROUND_TYPE.CONCRETE ? totalAnchors : 0
    );
    setTotalStitchScrews(stitchScrewsQuantity);
    setTotalStructuralScrews(structuralScrewsQuantity);
    setTotalTekScrews(tekScrewsQuantity);
    setTotalElbowBraces(elbowBraceQuantity);
    setTotalRafters(rafterQuantity);
    setTotalRunners(runnersQuantity);
    setTotalClips(clipsQuantity);
    setTotalSheets(sheetsQuantity);

    let additionalAnchors = 0;
    let additionalRunners = 0;
    let additionalTekScrews = 0;
    let additionalStitchScrews = 0;
    let additionalStructuralScrews = 0;
    let additionalClips = 0;
    let additionalSheets = 0;

    switch (selectedSize) {
      case "12x20":
        switch (selectedHeight) {
          case "Height A (8')":
            additionalAnchors = 2 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 24 * endWallQuantity;
            additionalStitchScrews = 18 * endWallQuantity;
            additionalStructuralScrews = 65 * endWallQuantity;
            additionalClips = 4 * endWallQuantity;
            additionalSheets = 4 * endWallQuantity;
            break;
          case "Height B (10')":
            additionalAnchors = 2 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 24 * endWallQuantity;
            additionalStitchScrews = 24 * endWallQuantity;
            additionalStructuralScrews = 65 * endWallQuantity;
            additionalClips = 4 * endWallQuantity;
            additionalSheets = 5 * endWallQuantity;
            break;
          case "Height C (12')":
            additionalAnchors = 2 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 24 * endWallQuantity;
            additionalStitchScrews = 30 * endWallQuantity;
            additionalStructuralScrews = 65 * endWallQuantity;
            additionalClips = 4 * endWallQuantity;
            additionalSheets = 6 * endWallQuantity;
            break;
        }
        break;
      case "18x20":
        switch (selectedHeight) {
          case "Height A (8')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 27 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 4 * endWallQuantity;
            break;
          case "Height B (10')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 36 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 5 * endWallQuantity;
            break;
          case "Height C (12')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 45 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 6 * endWallQuantity;
            break;
        }
        break;
      case "20x20":
        switch (selectedHeight) {
          case "Height A (8')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 30 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 4 * endWallQuantity;
            break;
          case "Height B (10')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 40 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 5 * endWallQuantity;
            break;
          case "Height C (12')":
            additionalAnchors = 3 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 36 * endWallQuantity;
            additionalStitchScrews = 50 * endWallQuantity;
            additionalStructuralScrews = 90 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 6 * endWallQuantity;
            break;
        }
        break;
      case "24x20":
        switch (selectedHeight) {
          case "Height A (8')":
            additionalAnchors = 4 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 40 * endWallQuantity;
            additionalStitchScrews = 36 * endWallQuantity;
            additionalStructuralScrews = 116 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 4 * endWallQuantity;
            break;
          case "Height B (10')":
            additionalAnchors = 4 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 40 * endWallQuantity;
            additionalStitchScrews = 48 * endWallQuantity;
            additionalStructuralScrews = 116 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 5 * endWallQuantity;
            break;
          case "Height C (12')":
            additionalAnchors = 4 * endWallQuantity;
            additionalRunners = 1 * endWallQuantity;
            additionalTekScrews = 40 * endWallQuantity;
            additionalStitchScrews = 60 * endWallQuantity;
            additionalStructuralScrews = 116 * endWallQuantity;
            additionalClips = 6 * endWallQuantity;
            additionalSheets = 6 * endWallQuantity;
            break;
        }
        break;
    }

    // Update the totals with the additional quantities
    setTotalAnchors(totalAnchors + additionalAnchors);
    setTotalRunners(totalRunners + additionalRunners);
    setTotalTekScrews(totalTekScrews + additionalTekScrews);
    setTotalStitchScrews(totalStitchScrews + additionalStitchScrews);
    setTotalStructuralScrews(
      totalStructuralScrews + additionalStructuralScrews
    );
    setTotalClips(totalClips + additionalClips);

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
      endWallSheets: endWallQuantity,
      endWallAnchors: endWallQuantity,
      endWallRunners: endWallQuantity,
      endWallTekScrews: endWallQuantity,
      endWallStitchScrews: endWallQuantity,
      endWallStructuralScrews: endWallQuantity,
      endWallClips: endWallQuantity,
      clips: clipsQuantity,
      total: total,
    });
  };
  const renderEndWallDetails = () => {
    if (endWallQuantity > 0) {
      switch (selectedSize) {
        case "12x20":
          switch (selectedHeight) {
            case "Height A (8')":
              return (
                <>
                  <p>Sheets (4 @ $68.00 each): $272.00</p>
                  <p>Anchors (2 @ $45.00 each): $90.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (24 @ $0.25 each): $6.00</p>
                  <p>Stitch Screws (18 @ $0.2 each): $3.60</p>
                  <p>Structural Screws (65 @ $0.2 each): $13.00</p>
                  <p>Clips (4 @ $15 each): $60.00</p>
                  <p>Total Cost: $714.26</p>
                </>
              );
            case "Height B (10')":
              return (
                <>
                  <p>Sheets (5 @ $68.00 each): $340.00</p>
                  <p>Anchors (2 @ $45.00 each): $90.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (24 @ $0.25 each): $6.00</p>
                  <p>Stitch Screws (24 @ $0.2 each): $4.80</p>
                  <p>Structural Screws (65 @ $0.2 each): $13.00</p>
                  <p>Clips (4 @ $15 each): $60.00</p>
                  <p>Total Cost: $783.46</p>
                </>
              );
            case "Height C (12')":
              return (
                <>
                  <p>Sheets (6 @ $68.00 each): $408.00</p>
                  <p>Anchors (2 @ $45.00 each): $90.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (24 @ $0.25 each): $6.00</p>
                  <p>Stitch Screws (30 @ $0.2 each): $6.00</p>
                  <p>Structural Screws (65 @ $0.2 each): $13.00</p>
                  <p>Clips (4 @ $15 each): $60.00</p>
                  <p>Total Cost: $852.66</p>
                </>
              );
            default:
              return null;
          }
        case "18x20":
          switch (selectedHeight) {
            case "Height A (8')":
              return (
                <>
                  <p>Sheets (4 @ $95.58 each): $382.32</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (27 @ $0.2 each): $5.40</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $909.38</p>
                </>
              );
            case "Height B (10')":
              return (
                <>
                  <p>Sheets (5 @ $95.58 each): $477.90</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (36 @ $0.2 each): $7.20</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1006.76</p>
                </>
              );
            case "Height C (12')":
              return (
                <>
                  <p>Sheets (6 @ $95.58 each): $573.48</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (45 @ $0.2 each): $9.00</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1104.14</p>
                </>
              );
            default:
              return null;
          }
        case "20x20":
          switch (selectedHeight) {
            case "Height A (8')":
              return (
                <>
                  <p>Sheets (4 @ $106.2 each): $424.80</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (30 @ $0.2 each): $6.00</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $952.46</p>
                </>
              );
            case "Height B (10')":
              return (
                <>
                  <p>Sheets (5 @ $106.2 each): $531.00</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (40 @ $0.2 each): $8.00</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1060.66</p>
                </>
              );
            case "Height C (12')":
              return (
                <>
                  <p>Sheets (6 @ $106.2 each): $637.20</p>
                  <p>Anchors (3 @ $45.00 each): $135.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (36 @ $0.25 each): $9.00</p>
                  <p>Stitch Screws (50 @ $0.2 each): $10.00</p>
                  <p>Structural Screws (90 @ $0.2 each): $18.00</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1168.86</p>
                </>
              );
            default:
              return null;
          }
        case "24x20":
          switch (selectedHeight) {
            case "Height A (8')":
              return (
                <>
                  <p>Sheets (4 @ $106.2 each): $424.80</p>
                  <p>Anchors (4 @ $45.00 each): $180.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (40 @ $0.25 each): $10.00</p>
                  <p>Stitch Screws (36 @ $0.2 each): $7.20</p>
                  <p>Structural Screws (116 @ $0.2 each): $23.20</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1004.86</p>
                </>
              );
            case "Height B (10')":
              return (
                <>
                  <p>Sheets (5 @ $106.2 each): $531.00</p>
                  <p>Anchors (4 @ $45.00 each): $180.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (40 @ $0.25 each): $10.00</p>
                  <p>Stitch Screws (48 @ $0.2 each): $9.60</p>
                  <p>Structural Screws (116 @ $0.2 each): $23.20</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1113.46</p>
                </>
              );
            case "Height C (12')":
              return (
                <>
                  <p>Sheets (6 @ $106.2 each): $637.20</p>
                  <p>Anchors (4 @ $45.00 each): $180.00</p>
                  <p>1 Runner: $269.66</p>
                  <p>Tek Screws (40 @ $0.25 each): $10.00</p>
                  <p>Stitch Screws (60 @ $0.2 each): $12.00</p>
                  <p>Structural Screws (116 @ $0.2 each): $23.20</p>
                  <p>Clips (6 @ $15 each): $90.00</p>
                  <p>Total Cost: $1222.06</p>
                </>
              );

            default:
              return null;
          }
      }
    }
  };
  const resetStates = () => {
    setSelectedSize(SIZES[0]);
    setSelectedHeight(HEIGHTS[0]);
    setWindowQuantity(0);
    setSideWallQuantity(0);
    setEndWallQuantity(0);
    setGroundType(GROUND_TYPE.REGULAR);
    setCalculationDetails(null);
    setTotalWindows(0);
    setTotalLegs(0);
    setTotalAnchors(0);
    setTotalAnchorsConcrete(0);
    setTotalStitchScrews(0);
    setTotalStructuralScrews(0);
    setTotalTekScrews(0);
    setTotalRunners(0);
    setTotalElbowBraces(0);
    setTotalRafters(0);
    setTotalClips(0);
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
        <IonCol>
          <IonButton expand="full" onClick={resetStates} color="medium">
            Reset
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

                  <p>Ground Type: {groundType}</p>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardContent>
                  <h2>End Wall Breakdown:</h2>
                  {renderEndWallDetails()}
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
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <h2>Parts List:</h2>
                  <p>Total Windows: {totalWindows}</p>
                  <p>Total Legs: {totalLegs}</p>
                  <p>Total Anchors: {totalAnchors}</p>
                  <p>Total Anchors with Concrete: {totalAnchorsConcrete}</p>
                  <p>Total Stitch Screws: {totalStitchScrews}</p>
                  <p>Total Structural Screws: {totalStructuralScrews}</p>
                  <p>Total Tek Screws: {totalTekScrews}</p>
                  <p>Total Elbow Braces: {totalElbowBraces}</p>
                  <p>Total Rafters: {totalRafters}</p>
                  <p>Total Runners: {totalRunners}</p>
                  <p>Total Clips: {totalClips}</p>
                  <p>Total Sheets: {totalSheets}</p>
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
