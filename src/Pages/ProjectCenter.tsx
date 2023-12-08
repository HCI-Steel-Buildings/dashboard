import React from "react";
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCommonContext } from "../Context/CommonContext";
import "./ProjectCenter.css";

const Charts: React.FC = () => {
  const { data } = useCommonContext();
  const items = data?.items || [];

  const getDaysUntilDelivery = (deliveryDateStr: string) => {
    const deliveryDate = new Date(deliveryDateStr);
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getColorForDays = (days: number) => {
    if (days <= 30) return "red";
    if (days <= 45) return "yellow";
    return "green";
  };

  const aggregateLFByColor = (
    items: any[]
  ): Record<
    string,
    {
      totalLF: number;
      totalWeight: number;
      jobNumbers: string[];
      deliveryDates: string[];
    }
  > => {
    const lfByColor: Record<
      string,
      {
        totalLF: number;
        totalWeight: number;
        jobNumbers: string[];
        deliveryDates: string[];
      }
    > = {};

    items.forEach((item: any) => {
      ["Trim", "Roof", "Wall"].forEach((part) => {
        const color = item[`${part} Color`];
        const lf = Number(item[`${part} LF`]) || 0;
        const jobNumber = item["Job Number"];
        const deliveryDate = item["Target Delivery"]; // Make sure this matches your data field

        if (color) {
          if (!lfByColor[color]) {
            lfByColor[color] = {
              totalLF: 0,
              totalWeight: 0,
              jobNumbers: [],
              deliveryDates: [],
            };
          }
          lfByColor[color].totalLF += lf;
          lfByColor[color].totalWeight += lf * 2; // Calculating total weight
          if (jobNumber && !lfByColor[color].jobNumbers.includes(jobNumber)) {
            lfByColor[color].jobNumbers.push(jobNumber);
            lfByColor[color].deliveryDates.push(deliveryDate);
          }
        }
      });
    });

    return lfByColor;
  };

  const totalLFByColor = aggregateLFByColor(items);

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
            {Object.entries(totalLFByColor).map(
              ([
                color,
                { totalLF, totalWeight, jobNumbers, deliveryDates },
              ]) => (
                <div key={color}>
                  <strong>{color}:</strong> {totalLF * 1.1} LF
                  <p>
                    <strong>Total Weight:</strong> {totalWeight} lbs
                  </p>
                  <p>
                    <strong>Job Numbers:</strong>
                    {jobNumbers.map((jobNumber, index) => {
                      const daysUntilDelivery = getDaysUntilDelivery(
                        deliveryDates[index]
                      );
                      const color = getColorForDays(daysUntilDelivery);
                      return (
                        <span
                          key={jobNumber}
                          style={{ color: color, marginRight: "5px" }}
                        >
                          {jobNumber}
                        </span>
                      );
                    })}
                  </p>
                  <br />
                </div>
              )
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
