import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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

      // Adjusted regex pattern to specifically match the lines within the summary
      // Assumes a consistent format: "Description    Weight(lb)    Price"
      const pattern = /^(\D.*?)\s+(\d[\d.,]*)\s+(\d[\d.,]+)$/;

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

      console.log("Summary data extracted:", summaryData);
      setSummary(summaryData);
      setExtractionDone(true);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

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
    const userFirstName = user?.given_name || ""; // or user['https://example.com/given_name'] if you've set custom claims
    const userLastName = user?.family_name || ""; // or user['https://example.com/family_name']

    // Adjusted hardcoded items with a valid quantity (1)
    const hardcodedItems = [
      { name: "Stamped Foundation Engineering", cost: 0, qty: 1, weight: 0 },
      { name: "Hot Dip Galvanize", cost: 0, qty: 1, weight: 0 },
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
      { name: "Shipping & Crating*", cost: 0, qty: 1, weight: 0 },
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
          weight: item.weight,
        },
      })),
      ...hardcodedItems.map((item) => ({
        options: {
          multichoice_selected: false,
        },
        data: {
          name: item.name,
          price: item.cost,
          qty: 1, // Corrected to valid number
          weight: item.weight,
        },
      })),
    ];

    const requestBody = {
      name: "New Document from HCI App",
      template_uuid: "ouoLePZqYqtdmopQfnwPim",
      recipients: [
        {
          email: userEmail,
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

  return (
    <IonPage>
      <IonContent>
        <IonLoading
          isOpen={showLoading}
          message={"Please wait..."}
          duration={0} // We're manually controlling the visibility, so set duration to 0
        />

        <IonModal isOpen={showModal} className="custom-modal">
          <IonContent className="ion-padding">
            <h2>Document Has Been Created</h2>
            <p>Your document has been successfully submitted for creation.</p>
            {statusCheckUrl && (
              <p>
                Document status can be checked{" "}
                <a
                  href={statusCheckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </p>
            )}
            <IonButton expand="block" onClick={() => setShowModal(false)}>
              Close
            </IonButton>
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
                  <strong>Total Cost:</strong> $
                  {summary
                    .reduce((acc: any, curr: any) => acc + curr.cost, 0)
                    .toFixed(2)}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default MBS;