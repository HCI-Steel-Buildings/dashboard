import React, { useState } from "react";
import {
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

interface BreakdownDetail {
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SideWallPackage {
  Sheathing: number;
  "Structural Screws": number;
  "Stitch Screws": number;
}

const EcoBuildingCalculator = () => {
  const SIZES = ["12x20", "18x20", "20x20", "24x20"];
  const HEIGHTS = ["8' Height", "10' Height", "12' Height"];
  const GROUND_TYPE = { REGULAR: "Regular", CONCRETE: "Concrete" };

  const [selectedSize, setSelectedSize] = useState("12x20");
  const [selectedHeight, setSelectedHeight] = useState("8' Height");
  const [groundType, setGroundType] = useState(GROUND_TYPE.REGULAR);
  const [windowQuantity, setWindowQuantity] = useState(0);
  const [sideWallQuantity, setSideWallQuantity] = useState(0);
  const [endWallQuantity, setEndWallQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownDetail[]>([]);
  const [sidewallPackageEnabled, setSidewallPackageEnabled] = useState(false);

  const BASE_PACKAGES: any = {
    "12x20": {
      "8' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 5,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 170,
        "Stitch Screws": 40,
        Rafter: 5,
        "Elbow Brace": 6,
        // "Hat Channel": 4,
      },
      "10' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 5,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 180,
        "Stitch Screws": 50,
        Rafter: 5,
        "Elbow Brace": 10,
        "Corner Brace": 4,
        "Hat Channel": 4,
      },
      "12' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 5,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 190,
        "Stitch Screws": 60,
        Rafter: 5,
        "Elbow Brace": 6,
        "Corner Brace": 4,
        "Hat Channel": 4,
      },
    },
    "18x20": {
      "8' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 6,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 180,
        "Stitch Screws": 60,
        Rafter: 5,
        "Elbow Brace": 6,
      },
      "10' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 7,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 190,
        "Stitch Screws": 70,
        Rafter: 5,
        "Elbow Brace": 6,
      },
      "12' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 8,
        Anchor: 10,
        Clips: 35,
        "Tek Screws": 72,
        "Structural Screws": 200,
        "Stitch Screws": 80,
        "Elbow Brace": 6,
        Rafter: 5,
      },
    },
    "20x20": {
      "8' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 7,
        Anchor: 10,
        Clips: 32,
        "Tek Screws": 36,
        "Structural Screws": 190,
        "Stitch Screws": 80,
        "Elbow Brace": 10,
        Rafter: 5,
      },
      "10' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 8,
        Anchor: 10,
        Clips: 32,
        "Tek Screws": 36,
        "Structural Screws": 200,
        "Stitch Screws": 90,
        "Elbow Brace": 10,
        Rafter: 5,
      },
      "12' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 9,
        Anchor: 10,
        Clips: 32,
        "Tek Screws": 36,
        "Structural Screws": 210,
        "Stitch Screws": 100,
        "Elbow Brace": 10,
        Rafter: 5,
      },
    },
    "24x20": {
      "8' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 8,
        Anchor: 10,
        Clips: 6,
        "Tek Screws": 40,
        "Structural Screws": 190,
        "Stitch Screws": 90,
        "Elbow Brace": 6,
        Rafter: 5,
      },
      "10' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 9,
        Anchor: 10,
        Clips: 6,
        "Tek Screws": 40,
        "Structural Screws": 200,
        "Stitch Screws": 100,
        "Elbow Brace": 6,
        Rafter: 5,
      },
      "12' Height": {
        Posts: 10,
        Runners: 2,
        RoofSheet: 10,
        Anchor: 10,
        Clips: 6,
        "Tek Screws": 40,
        "Structural Screws": 210,
        "Stitch Screws": 110,
        "Elbow Brace": 6,
        Rafter: 5,
      },
    },
  };
  const PRICING_DATA: any = {
    "12x20": {
      "8' Height": {
        Window: 385.0,
        Posts: 46.32,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 445.0,
        "Stitch Screws": 0.2, //20 screws
        "Structural Screws": 0.2, //80 screws
        "End Wall": 714.26,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
        "Hat Channel": 60, //20ft
        "Corner Brace": 24, //per brace
      },
      "10' Height": {
        Window: 385.0,
        Posts: 57.9,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 583.0,
        "Stitch Screws": 0.6, //30 screws
        "Structural Screws": 0.2, //90 screws
        "End Wall": 783.46,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
      "12' Height": {
        Window: 385.0,
        Posts: 69.48,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 715.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //100 screws
        "End Wall": 852.66,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
    },
    "18x20": {
      "8' Height": {
        Window: 385.0,
        Posts: 47.1,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10, // 1 anchor per leg
        "Side Wall": 445.0,
        "Stitch Screws": 0.2, //20 screws
        "Structural Screws": 0.2, //80 screws
        "End Wall": 909.38,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 95.58,
        Clips: 15,
      },
      "10' Height": {
        Window: 385.0,
        Posts: 58.9,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 583.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //90 screws
        "End Wall": 1006.76,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 95.58,
        Clips: 15,
      },
      "12' Height": {
        Windows: 385.0,
        Posts: 70.68, // set of 10
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 715.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //100 screws
        "End Wall": 1104.14,
        "Tek Screws": 0.25, //72 screws (Elbow brace and posts)
        Rafter: 118.7, //5 rafters
        "Elbow Brace": 27, //6 braces
        Runners: 269.66,
        RoofSheet: 95.58,
        Clips: 15,
      },
    },
    "20x20": {
      "8' Height": {
        Window: 385.0,
        Posts: 47.1,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 445.0,
        "Stitch Screws": 0.2, //20 screws
        "Structural Screws": 0.2, //80 screws
        "End Wall": 952.46,
        "Tek Screws": 0.25, // 100 screws
        Rafter: 271.06, //5 rafters
        "Elbow Brace": 27, //10 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
      "10' Height": {
        Window: 385.0,
        Posts: 58.9,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 583.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //90 screws
        "End Wall": 1060.66,
        "Tek Screws": 0.25, //100 screws
        Rafter: 271.06, //5 rafters
        "Elbow Brace": 27, //10 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
      "12' Height": {
        Window: 385.0,
        Posts: 70.68,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 715.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //100 screws
        "End Wall": 1168.86,
        "Tek Screws": 0.25, //100 screws
        Rafter: 271.06, //5 rafters
        "Elbow Brace": 27, //10 braces
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
    },
    "24x20": {
      "8' Height": {
        Window: 385.0,
        Posts: 47.1,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 445.0,
        "Stitch Screws": 0.2, //20 screws
        "Structural Screws": 0.2, //80 screws
        "End Wall": 1004.86,
        "Tek Screws": 0.25, //100 screws
        "Elbow Brace": 36, //10 braces
        Rafter: 300.06, //5 rafters
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
      "10' Height": {
        Window: 385.0,
        Posts: 58.9,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 583.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //90 screws
        "End Wall": 1113.46,
        "Tek Screws": 0.25, //100 screws
        "Elbow Brace": 36, //10 braces
        Rafter: 300.06, //5 rafters
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
      "12' Height": {
        Window: 385.0,
        Posts: 70.68,
        Anchor: 45.0,
        "Anchors w/ Concrete": 10,
        "Side Wall": 715.0,
        "Stitch Screws": 0.2, //30 screws
        "Structural Screws": 0.2, //100 screws
        "End Wall": 1222.06,
        "Tek Screws": 0.25, //100 screws
        "Elbow Brace": 36, //10 braces
        Rafter: 300.06, //5 rafters
        Runners: 269.66,
        RoofSheet: 106.2,
        Clips: 15,
      },
    },
  };
  const SIDEWALL_PACKAGE: any = {
    Sheathing: 3,
    "Structural Screws": 80,
    "Stitch Screws": 30,
  };

  const calculateTotalCost = () => {
    // Debugging: Log the current selections
    console.log(
      "Selected Size:",
      selectedSize,
      "Selected Height:",
      selectedHeight
    );

    // Check if the selected size and height are valid and exist in BASE_PACKAGES
    if (
      !selectedSize ||
      !selectedHeight ||
      !BASE_PACKAGES[selectedSize] ||
      !BASE_PACKAGES[selectedSize][selectedHeight]
    ) {
      alert("Please select a valid size and height.");
      return;
    }

    const basePackage = BASE_PACKAGES[selectedSize][selectedHeight];

    // Adjusting the key generation to match PRICING_DATA keys
    // The key should be exactly like the ones in PRICING_DATA, e.g., "8' Height"
    const pricingKey = selectedHeight;

    console.log("Pricing Key:", pricingKey);

    const pricing = PRICING_DATA[selectedSize][pricingKey];

    // Debugging: Log the retrieved package and pricing data
    console.log("Base Package:", basePackage, "Pricing Data:", pricing);

    if (!pricing) {
      alert(`Pricing data not found for ${selectedSize} ${selectedHeight}`);
      return;
    }

    let calculatedTotalCost = 0;
    let breakdownDetails: BreakdownDetail[] = [];

    // Calculate cost for base package
    for (const item in basePackage) {
      const quantity = basePackage[item];

      // Debugging log to check each item
      console.log(`Processing item: ${item}, Quantity: ${quantity}`);

      // Check if the pricing data exists for the item
      if (!pricing[item]) {
        console.error(`Pricing data missing for item: ${item}`);
        continue; // Skip this item if pricing data is not found
      }

      const itemCost = pricing[item] * quantity;
      calculatedTotalCost += itemCost;
      breakdownDetails.push({
        item,
        quantity,
        unitPrice: pricing[item],
        total: itemCost,
      });
    }

    // Add costs for additional items
    calculatedTotalCost += pricing["Window"] * windowQuantity;
    calculatedTotalCost += pricing["Side Wall"] * sideWallQuantity;
    calculatedTotalCost += pricing["End Wall"] * endWallQuantity;

    // Add Sidewall package cost if enabled
    // Add Sidewall package cost based on quantity
    if (sideWallQuantity > 0) {
      for (const item in SIDEWALL_PACKAGE) {
        const quantity = SIDEWALL_PACKAGE[item] * sideWallQuantity;
        const itemCost = pricing[item] ? pricing[item] * quantity : 0;
        calculatedTotalCost += itemCost;
        breakdownDetails.push({
          item,
          quantity,
          unitPrice: pricing[item] || 0,
          total: itemCost,
        });
      }
    }

    setTotalCost(calculatedTotalCost);
    setBreakdown(breakdownDetails);
  };

  const resetCalculator = () => {
    setSelectedSize("");
    setSelectedHeight("");
    setGroundType(GROUND_TYPE.REGULAR);
    setWindowQuantity(0);
    setSideWallQuantity(0);
    setEndWallQuantity(0);
    setTotalCost(0);
    setBreakdown([]);
  };

  return (
    <div>
      <IonRow>
        <IonCol>
          <IonItem>
            <IonLabel position="stacked">Select Size:</IonLabel>
            <IonSelect
              //label="Select Size"
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
              //label="Select Height"
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
              //label="Window Quantity"
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
              //label="Side Wall Quantity"
              type="number"
              value={sideWallQuantity}
              onIonChange={(e: any) =>
                setSideWallQuantity(parseInt(e.detail.value))
              }
              min="0"
              max="2"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">End Wall Quantity:</IonLabel>
            <IonInput
              //label="End Wall Quantity"
              type="number"
              value={endWallQuantity}
              onIonChange={(e: any) =>
                setEndWallQuantity(parseInt(e.detail.value))
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
              {breakdown.map((detail, index) => (
                <div key={index}>
                  <p>
                    {detail.item}: Quantity {detail.quantity}, Unit Price: $
                    {detail.unitPrice.toFixed(2)}, Total: $
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
    </div>
  );
};

export default EcoBuildingCalculator;
