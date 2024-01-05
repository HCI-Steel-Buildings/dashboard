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

const Purchasing: React.FC = () => {
  const { data } = useCommonContext();
  const items: Item[] = data?.items || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Item | null>(null);

  const getDaysUntilDelivery = (deliveryDateStr: string): number => {
    const deliveryDate = new Date(deliveryDateStr);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const filterItemsWithin60Days = (items: Item[]): Item[] => {
    return items.filter((item: Item) => {
      const targetDelivery = item["Target Delivery"];
      if (!targetDelivery) {
        return false;
      }
      const daysUntilDelivery = getDaysUntilDelivery(targetDelivery);
      return daysUntilDelivery <= 60;
    });
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

  const displayItemsWithin60Days = () => {
    const filteredItems = filterItemsWithin60Days(items);

    return (
      <IonGrid>
        {filteredItems.map((item, index) => (
          <IonRow key={index}>
            <IonCol>
              <IonCard>
                <IonCardContent>
                  <h2>Item Details</h2>
                  {Object.keys(item).map((key) => (
                    <p key={key}>
                      <strong>{key}:</strong> {item[key]}
                    </p>
                  ))}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        ))}
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
          <IonCardContent>{displayItemsWithin60Days()}</IonCardContent>
        </IonCard>
      </IonContent>
      <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
        {renderModalContent()}
      </IonModal>
    </IonPage>
  );
};

export default Purchasing;
