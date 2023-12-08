import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
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

interface ColorInfo {
  totalLF: number;
  totalWeight: number;
  jobNumbers: string[];
}

const Purchasing: React.FC = () => {
  const { data } = useCommonContext();
  const items: Item[] = data?.items || [];

  const getDaysUntilDelivery = (deliveryDateStr: string): number => {
    const deliveryDate = new Date(deliveryDateStr);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getColorForDays = (days: number): string => {
    return days <= 60 ? "red" : "green";
  };

  const filterItemsByUrgencyAndColor = (
    items: Item[],
    color: string
  ): Item[] => {
    return items.filter((item: Item) => {
      const targetDelivery = item["Target Delivery"];
      if (!targetDelivery) {
        return false; // Exclude items without a target delivery date
      }
      const daysUntilDelivery = getDaysUntilDelivery(targetDelivery);
      return getColorForDays(daysUntilDelivery) === color;
    });
  };

  const aggregateLFByColor = (
    filteredItems: Item[]
  ): Record<string, ColorInfo> => {
    const lfByColor: Record<string, ColorInfo> = {};

    filteredItems.forEach((item: Item) => {
      ["Trim", "Roof", "Wall"].forEach((part) => {
        const color = item[`${part} Color`];
        const lf = Number(item[`${part} LF`]) || 0;

        if (color) {
          if (!lfByColor[color]) {
            lfByColor[color] = {
              totalLF: 0,
              totalWeight: 0,
              jobNumbers: [],
            };
          }
          lfByColor[color].totalLF += lf;
          lfByColor[color].totalWeight += Math.round(lf * 2 * 1.1);
          if (!lfByColor[color].jobNumbers.includes(item["Job Number"])) {
            lfByColor[color].jobNumbers.push(item["Job Number"]);
          }
        }
      });
    });

    return lfByColor;
  };

  const displayLFByColorAndUrgency = (color: string) => {
    const filteredItems = filterItemsByUrgencyAndColor(items, color);
    const totalLFByColor = aggregateLFByColor(filteredItems);

    return Object.entries(totalLFByColor).map(
      ([color, { totalLF, totalWeight, jobNumbers }]) => {
        if (totalLF === 0) {
          return null;
        }
        return (
          <div key={color}>
            <strong>{color}:</strong> {totalLF} LF
            <br />
            <strong>Total Weight:</strong> {totalWeight} lbs
            <br />
            <strong>Job Numbers:</strong> {jobNumbers.join(", ")}
            <br />
            <br />
          </div>
        );
      }
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
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonCard>
                    <h2 style={{ backgroundColor: "rgba(255, 0, 0, 0.5)" }}>
                      Red (Next 60 days)
                    </h2>
                    {displayLFByColorAndUrgency("red")}
                  </IonCard>
                </IonCol>
                <IonCol>
                  <IonCard>
                    <h2 style={{ backgroundColor: "rgba(0, 128, 0, 0.5)" }}>
                      Green (More than 60 days)
                    </h2>
                    {displayLFByColorAndUrgency("green")}
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Purchasing;
