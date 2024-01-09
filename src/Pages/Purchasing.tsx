import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCommonContext } from "../Context/CommonContext";

// Define interfaces for your data structure
interface Item {
  [key: string]: any; // Adjust this based on your actual data structure
}

interface ColorAggregate {
  totalLF: number;
  jobNumbers: Set<string>;
}

const Purchasing: React.FC = () => {
  const { data } = useCommonContext();
  const items: Item[] = data?.items || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Item | null>(null);

  // Function to aggregate LF by color and collect job numbers
  const aggregateLFByColor = (): Record<string, ColorAggregate> => {
    const colorAggregates: Record<string, ColorAggregate> = {};

    items.forEach((item: Item) => {
      const jobNumber = item["Job Number"];
      let includeItem = true;

      // Check if any of the material statuses are 'Ordered'
      const parts = ["Trim", "Roof", "Wall"];
      parts.forEach((part) => {
        const status = item[`${part} Material Status`];
        if (status === "Ordered") {
          includeItem = false;
        }
      });

      if (includeItem) {
        parts.forEach((part) => {
          const color = item[`${part} Color`];
          const lf = Number(item[`${part} LF`]) || 0;

          if (color) {
            if (!colorAggregates[color]) {
              colorAggregates[color] = {
                totalLF: 0,
                jobNumbers: new Set<string>(),
              };
            }
            colorAggregates[color].totalLF += lf;
            if (jobNumber) {
              colorAggregates[color].jobNumbers.add(jobNumber);
            }
          }
        });
      }
    });

    return colorAggregates;
  };

  const handleJobNumberClick = (jobNumber: string) => {
    const job = items.find((item) => item["Job Number"] === jobNumber);
    if (job) {
      setSelectedJob(job);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const renderModalContent = () => {
    if (!selectedJob) return null;

    return (
      <div>
        <h2>Job Details</h2>
        <p>
          <strong>Job Number:</strong> {selectedJob["Job Number"]}
        </p>
        <p>
          <strong>Color:</strong> {selectedJob["Color"]}
        </p>
        <p>
          <strong>LF Needed:</strong> {selectedJob["LF"]}
        </p>
        <button onClick={closeModal}>Close</button>
      </div>
    );
  };

  const displayColorsWithLF = () => {
    const colorData = aggregateLFByColor();

    return (
      <IonGrid>
        <IonRow>
          {Object.entries(colorData).map(([color, data]) => (
            <IonCol key={color} size="4">
              <IonCard>
                <IonCardContent>
                  <h2>{color}</h2>
                  <p>Total LF: {data.totalLF}</p>
                  <p>Jobs: {Array.from(data.jobNumbers).join(", ")}</p>
                  <p>Total Jobs: {data.jobNumbers.size}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Center</IonTitle>
          <IonCardSubtitle>
            Please note that all weight includes 10% overage.
          </IonCardSubtitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardContent>{displayColorsWithLF()}</IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
        {renderModalContent()}
      </IonModal>
    </IonPage>
  );
};

export default Purchasing;
