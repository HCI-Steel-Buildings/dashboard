import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { documentTextOutline, linkOutline } from "ionicons/icons";
import { log } from "console";
import Header from "../Components/Header/Header";

function MBS() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [documentLink, setDocumentLink] = useState("");
  const [statusCheckUrl, setStatusCheckUrl] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [showLoading, setShowLoading] = useState(false);
  const [firstName, lastName]: any = user?.name?.split(" ");
  const [width, setWidth]: any = useState();
  const [length, setLength]: any = useState();

  // Engineering State
  const [buildingCost, setBuildingCost] = React.useState();
  const [results, setResults] = useState<{
    engineeringCost: number;
    structuralCost: number;
    foundationCost: number;
    totalCost: number;
  } | null>(null);
  useEffect(() => {
    // Ensure all required data is present before calculating
    if (width && length && buildingCost) {
      calculate();
    }
  }, [width, length, buildingCost]); // Depend on width, length, and buildingCost
  const handleFileChange = (event: any) => {
    console.log("File selected:", event.target.files[0]); // Log the selected file
    setUploadedFile(event.target.files[0]);
    if (event.target.files[0]) {
      setFileUploaded(true); // Indicate that a file has been uploaded
    } else {
      setFileUploaded(false); // Reset if no file is selected
    }
  };

  const extractSummary = async (file: any) => {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      const summaryData: any = [];
      // Regular expression pattern to match the format "Width (ft)= [value] Length (ft)= [value]"
      const layoutPattern =
        /Width\s+\(ft\)=\s+([\d.]+)\s+Length\s+\(ft\)=\s+([\d.]+)/;

      // Attempt to extract width and length from the complete text
      const layoutMatch = layoutPattern.exec(text);
      if (layoutMatch) {
        const [_, extractedWidth, extractedLength] = layoutMatch;
        setWidth(parseFloat(extractedWidth)); // Update state with extracted width
        setLength(parseFloat(extractedLength)); // Update state with extracted length
      }

      let capture = false;

      lines.forEach((line: any) => {
        // Start capturing after the "BUILDING WEIGHT & PRICE SUMMARY" title is found
        if (line.includes("BUILDING WEIGHT & PRICE SUMMARY")) {
          capture = true; // Enable data capturing
          return;
        }

        // Optional: Stop capturing after the "-----" line that indicates the end of the summary section
        if (line.trim().startsWith("-----") && capture) {
          capture = false;
          return;
        }

        if (capture) {
          // Adjusted regex pattern to specifically match the lines within the summary
          // Assumes a consistent format: "Description    Weight(lb)    Price"
          const pattern = /^(\D.*?)\s+(\d[\d.,]*)\s+(\d[\d.,]+)$/;
          const match = line.match(pattern);
          if (match && match.length === 4) {
            const [_, description, weight, cost] = match;
            // Check if the description is not "Accessories" before adding to the summary
            if (description.trim() !== "Accessories") {
              summaryData.push({
                description: description.trim(),
                weight: parseFloat(weight.replace(/,/g, "")),
                cost: parseFloat(cost.replace(/,/g, "")),
              });
            }
          }
        }
      });

      // Updating the component state with the extracted summary data
      setSummary(summaryData);
      setExtractionDone(true);
      // Calculate buildingCost here based on the newly set summary
      const calculatedTotalCost = summaryData
        .reduce((acc: any, curr: any) => acc + curr.cost, 0)
        .toFixed(2);

      // Set buildingCost state
      setBuildingCost(calculatedTotalCost);

      // Ensure calculate is called after buildingCost is set
      calculate(); // Pass calculatedTotalCost if needed as an argument
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    // Initiating the text extraction process from the uploaded file
    reader.readAsText(file);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Submit button clicked, file to be processed:", uploadedFile); // Log on submit

    if (!uploadedFile) {
      console.log("No file uploaded"); // Log if no file is selected when submit is clicked
      return;
    }

    setShowLoading(true); // Show loading spinner

    setTimeout(() => {
      extractSummary(uploadedFile); // Proceed with the file extraction

      setShowLoading(false); // Hide loading spinner after 3 seconds
    }, 3000);
  };

  const createPandaDocDocument = async () => {
    const apiUrl = "https://api.pandadoc.com/public/v1/documents";
    const apiKey = "API-Key fabb6d54d41349127dbf917150ef5db9bb937fac"; // Ensure this is securely managed

    const userEmail = user?.email;
    // Find the line item with the name "Rigid Frames & Endwall Frames"
    const rigidFramesItem: any = summary.find(
      (item: any) => item.description === "Rigid Frames & Endwall Frames"
    );

    // Calculate the cost of Hot Dip Galvanize based on the weight of "Rigid Frames & Endwall Frames" * 1.5
    const hotDipGalvanizeCost = rigidFramesItem
      ? rigidFramesItem.weight * 1.5
      : 0;

    const hardcodedItems = [
      {
        name: "Stamped Structural Engineering",
        cost: results?.structuralCost.toFixed(2) || 0, // Use structuralCost from the results
        qty: 1,
        weight: 0,
      },
      {
        name: "Stamped Foundation Engineering",
        cost: results?.foundationCost.toFixed(2) || 0, // Use foundationCost from the results
        qty: 1,
        weight: 0,
      },
      {
        name: "Hot Dip Galvanize",
        cost: hotDipGalvanizeCost.toFixed(2),
        qty: 1,
        weight: 0,
      },
      {
        name: "Roof Insulation (Simple Saver R38)",
        cost: 0,
        qty: 1,
        weight: 0,
      },
      {
        name: "Wall Insulation (Simple Saver R25)",
        cost: 0,
        qty: 1,
        weight: 0,
      },
      {
        name: "Man Door (3070 Metal Door w/Frame)",
        cost: 0,
        qty: 1,
        weight: 0,
      },
      {
        name: "Shipping & Crating*",
        cost: 0,
        qty: 1,
        weight: 0,
      },
      {
        name: "Erection Costs of Building Kit & HCI Accessories**",
        cost: 0,
        qty: 1,
        weight: 0,
      },
    ];

    // Merge summary and hardcoded items with correct 'qty' field
    const pricingTableRows = [
      ...summary.map((item: any) => ({
        options: {
          multichoice_selected: false,
        },
        data: {
          name: item.description,
          price: item.cost,
          qty: 1, // Ensure this is a valid number
        },
      })),
      ...hardcodedItems.map((item) => ({
        options: {
          optional: true,
        },
        data: {
          name: item.name,
          price: item.cost,
          qty: 1, // Corrected to valid number
        },
      })),
    ];

    const requestBody = {
      name: "Pre-Eng Quote",
      template_uuid: "ouoLePZqYqtdmopQfnwPim",
      owner: {
        email: `${userEmail}`,
        first_name: `${firstName}`,
        last_name: `${lastName}`,
      },
      recipients: [
        {
          email: "",
          role: "Client",
        },
      ],
      pricing_tables: [
        {
          name: "Pricing Table 1",
          sections: [
            {
              title: "Building Breakdown",
              default: false,
              multichoice_enabled: false,
              rows: pricingTableRows,
            },
            // Additional sections as needed
          ],
        },
      ],
      // Additional tokens, metadata, etc., as needed
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Error: ${response.statusText} Body: ${errorBody}`);
      }

      const responseData = await response.json();
      console.log("PandaDoc document created:", responseData);

      setShowModal(true); // Show the modal on success

      // Optionally, inform the user that the document is being prepared
      // and provide the link for status checking if necessary
      // Note: Adjust based on your application's needs
      if (responseData && responseData.links && responseData.links.length > 0) {
        // Assuming the first link is for status checking and relevant for your needs
        const statusUrl = responseData.links[0].href;
        setStatusCheckUrl(statusUrl); // Save this URL for displaying in the modal
        setShowModal(true); // Indicate that document creation has started and show the modal
      }
    } catch (error) {
      console.error("Failed to create PandaDoc document:", error);
    }
  };
  const totalCost = summary
    .reduce((acc: any, curr: any) => acc + curr.cost, 0)
    .toFixed(2);

  const categories = {
    "Anything under 1,000 sq ft": 6000,
    "Between 1,001 - 2,400 sq ft": 6500,
    "Between 2,401 - 6,000 sq ft": 7000,
    "Between 6,001 - 10,000 sq ft": 7500,
    "Between 10,001 - 20,000 sq ft": 8000,
    "Between 20,001 - 30,000 sq ft": 8500,
    "Between 30,001 - 40,000 sq ft": 9000,
    "Between 40,001 - 50,000 sq ft": 9500,
    "Between 50,001 - 60,000 sq ft": 10000,
    "Between 60,001 - 70,000 sq ft": 10500,
    "Between 70,001 - 80,000 sq ft": 11000,
    "Between 80,001 - 90,000 sq ft": 11500,
  };

  const determineEngineeringCost = (
    squareFootage: number,
    buildingCost: number
  ) => {
    for (const [category, baseCost] of Object.entries(categories)) {
      if (category.includes("under") && squareFootage <= 1000) {
        return baseCost + 0.015 * buildingCost;
      } else if (category.includes("-")) {
        const bounds = category.split("-");
        const lowerBound = parseInt(bounds[0].replace(/[^\d]/g, ""), 10);
        const upperBound = parseInt(bounds[1].replace(/[^\d]/g, ""), 10);
        if (lowerBound <= squareFootage && squareFootage <= upperBound) {
          return baseCost + 0.015 * buildingCost;
        }
      }
    }
    return 11500 + 0.015 * buildingCost; // Default to the highest category
  };
  const calculate = () => {
    const numericBuildingCost = parseFloat(buildingCost || "0");
    if (width && length && numericBuildingCost) {
      const squareFootage = width * length;
      const engineeringCost = determineEngineeringCost(
        squareFootage,
        numericBuildingCost
      );
      const structuralCost = 0.85 * engineeringCost;
      const foundationCost = 0.15 * engineeringCost;
      const totalCost =
        numericBuildingCost + engineeringCost + structuralCost + foundationCost;

      setResults({
        engineeringCost: engineeringCost,
        structuralCost: structuralCost,
        foundationCost: foundationCost,
        totalCost: totalCost,
      });
    }
  };

  const displayNames: any = {
    engineeringCost: "Engineering Cost",
    structuralCost: "Structural Cost",
    foundationCost: "Foundation Cost",
    totalCost: "Total Cost",
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <IonLoading
          isOpen={showLoading}
          message={"Please wait..."}
          duration={0}
        />

        <IonModal isOpen={showModal} className="custom-modal">
          <IonContent className="ion-padding custom-modal-content">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Document Creation Status</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModal(false)}>
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={documentTextOutline} slot="start" />
                <IonLabel>
                  Your document has been successfully submitted for creation.
                </IonLabel>
              </IonItem>
              {statusCheckUrl && (
                <IonItem>
                  <IonIcon icon={linkOutline} slot="start" />
                  <IonLabel>
                    <a
                      href={statusCheckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Check document status
                    </a>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </IonContent>
        </IonModal>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Upload File Here</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              <IonItem lines="none" className="tight-spacing">
                <input type="file" onChange={handleFileChange} />
              </IonItem>
              <IonButton
                expand="block"
                type="submit"
                color="tertiary"
                disabled={!fileUploaded}
              >
                Upload and Extract
              </IonButton>

              {extractionDone && (
                <IonButton
                  expand="block"
                  onClick={() => createPandaDocDocument()}
                  color="primary"
                >
                  Create PandaDoc Document
                </IonButton>
              )}
            </form>
          </IonCardContent>
        </IonCard>

        <IonList>
          {summary.map((item: any, index: number) => (
            <IonItem key={index} className="tight-spacing">
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonLabel>
                      <strong>{item.description}</strong>
                    </IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6" className="tight-text">
                    Weight: {item.weight} lbs
                  </IonCol>
                  <IonCol size="6" className="cost-text">
                    Cost: ${item.cost.toFixed(2)}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
          {/* Display totals */}
          <IonItem className="tight-spacing">
            <IonGrid>
              <IonRow>
                <IonCol size="6" className="tight-text">
                  <strong>Total Weight:</strong>{" "}
                  {summary
                    .reduce((acc: any, curr: any) => acc + curr.weight, 0)
                    .toFixed(2)}{" "}
                  lbs
                </IonCol>
                <IonCol size="6" className="cost-text">
                  <strong>Total Cost:</strong> ${buildingCost}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>

          <IonRow>
            {results &&
              Object.entries(results).map(([key, value]) => (
                <IonCol key={key}>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>
                        {displayNames[key] || key}: ${value.toFixed(2)}
                      </IonCardTitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              ))}
          </IonRow>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default MBS;
