import {
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
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";

function Minis() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [summary, setSummary] = useState([]);

  const handleFileChange = (event: any) => {
    console.log("File selected:", event.target.files[0]); // Log the selected file
    setUploadedFile(event.target.files[0]);
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
            summaryData.push({
              description: description.trim(),
              weight: parseFloat(weight.replace(/,/g, "")),
              cost: parseFloat(cost.replace(/,/g, "")),
            });
          }
        }
      });

      console.log("Summary data extracted:", summaryData);
      setSummary(summaryData);
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Submit button clicked, file to be processed:", uploadedFile); // Log on submit
    if (uploadedFile) {
      extractSummary(uploadedFile);
    } else {
      console.log("No file uploaded"); // Log if no file is selected when submit is clicked
    }
  };

  const createPandaDocDocument = async (summaryData: any) => {
    const apiUrl = "https://api.pandadoc.com/public/v1/documents";
    const apiKey = "fabb6d54d41349127dbf917150ef5db9bb937fac"; // Securely store and use your API key
    const templateId = "ouoLePZqYqtdmopQfnwPim"; // The ID of the template you're using
    const tableId = "Pricing Table 1"; // The ID of the pricing table within your template

    // Prepare the table rows from your summary data
    const tableRows = summaryData.map((item: any) => ({
      description: item.description,
      quantity: 1,
      price: item.cost,
      options: {
        unit_cost: item.cost,
        quantity: 1,
      },
    }));

    const requestBody = {
      name: "New Document from React App",
      template_uuid: templateId,
      tokens: [
        // You can add any tokens you need to replace in your template here
      ],
      pricing_tables: [
        {
          id: tableId,
          rows: tableRows,
        },
      ],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("PandaDoc document created:", responseData);
      // Handle successful document creation (e.g., display a success message)
    } catch (error) {
      console.error("Failed to create PandaDoc document:", error);
      // Handle errors (e.g., display an error message)
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Upload File Here</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              <IonItem lines="none" className="tight-spacing">
                <input type="file" onChange={handleFileChange} />
              </IonItem>
              <IonButton expand="block" type="submit" color="tertiary">
                Upload and Extract
              </IonButton>
              <IonButton expand="block" onClick={createPandaDocDocument}>
                Create PandaDoc Document
              </IonButton>
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
                    Cost: ${item.cost}
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Minis;
