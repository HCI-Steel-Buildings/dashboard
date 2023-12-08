import React from "react";
import {
  IonCard,
  IonCardContent,
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
import "./ProjectCenter.css";

// Define interfaces for your data structure
interface Item {
  [key: string]: any; // Adjust this based on your actual data structure
}

interface ColorInfo {
  totalLF: number;
  jobNumbers: string[];
}

const Charts: React.FC = () => {
  const { data } = useCommonContext();
  const items: Item[] = data?.items || [];

  const getDaysUntilDelivery = (deliveryDateStr: string): number => {
    const deliveryDate = new Date(deliveryDateStr);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getColorForDays = (days: number): string => {
    if (days <= 30) return "red";
    if (days <= 45) return "yellow";
    return "green";
  };

  const filterItemsByUrgencyAndColor = (
    items: Item[],
    color: string,
    daysLimit: number
  ): Item[] => {
    return items.filter((item: Item) => {
      const daysUntilDelivery = getDaysUntilDelivery(item["Target Delivery"]);
      if (color === "green") {
        return daysUntilDelivery > 45;
      }
      return (
        getColorForDays(daysUntilDelivery) === color &&
        daysUntilDelivery <= daysLimit
      );
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
              jobNumbers: [],
            };
          }
          lfByColor[color].totalLF += lf;
          if (!lfByColor[color].jobNumbers.includes(item["Job Number"])) {
            lfByColor[color].jobNumbers.push(item["Job Number"]);
          }
        }
      });
    });

    return lfByColor;
  };

  const displayLFByColorAndUrgency = (color: string, daysLimit: number) => {
    const filteredItems = filterItemsByUrgencyAndColor(items, color, daysLimit);
    const totalLFByColor = aggregateLFByColor(filteredItems);

    return Object.entries(totalLFByColor).map(
      ([color, { totalLF, jobNumbers }]) => {
        if (totalLF === 0) {
          return null; // Skip rendering if totalLF is 0
        }
        return (
          <div key={color}>
            <strong>{color}:</strong> {totalLF} LF
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
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonCard>
                    {/* Red Header */}
                    <h2 style={{ backgroundColor: "rgba(255, 0, 0, 0.5)" }}>
                      Red (Next 30 days)
                    </h2>
                    {displayLFByColorAndUrgency("red", 30)}
                  </IonCard>
                </IonCol>
                <IonCol>
                  <IonCard>
                    {/* Yellow Header */}
                    <h2 style={{ backgroundColor: "rgba(255, 255, 0, 0.5)" }}>
                      Yellow (31 to 45 days)
                    </h2>
                    {displayLFByColorAndUrgency("yellow", 45)}
                  </IonCard>
                </IonCol>
                <IonCol>
                  <IonCard>
                    {/* Green Header */}
                    <h2 style={{ backgroundColor: "rgba(0, 128, 0, 0.5)" }}>
                      Green (More than 45 days)
                    </h2>
                    {displayLFByColorAndUrgency("green", Infinity)}
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow></IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
