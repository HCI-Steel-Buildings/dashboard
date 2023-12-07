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

  const aggregateLFByColor = (
    items: any[]
  ): Record<
    string,
    { totalLF: number; totalWeight: number; jobNumbers: string[] }
  > => {
    const lfByColor: Record<
      string,
      { totalLF: number; totalWeight: number; jobNumbers: string[] }
    > = {};

    items.forEach((item: any) => {
      ["Trim", "Roof", "Wall"].forEach((part) => {
        const color = item[`${part} Color`];
        const lf = Number(item[`${part} LF`]) || 0;
        const jobNumber = item["Job Number"];

        if (color) {
          if (!lfByColor[color]) {
            lfByColor[color] = { totalLF: 0, totalWeight: 0, jobNumbers: [] };
          }
          lfByColor[color].totalLF += lf;
          lfByColor[color].totalWeight += lf * 2; // Calculating total weight
          if (jobNumber && !lfByColor[color].jobNumbers.includes(jobNumber)) {
            lfByColor[color].jobNumbers.push(jobNumber);
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
              ([color, { totalLF, totalWeight, jobNumbers }]: [
                string,
                { totalLF: number; totalWeight: number; jobNumbers: string[] }
              ]) => (
                <div key={color}>
                  <strong>{color}:</strong> {totalLF} LF
                  <p>
                    <strong>Total Weight:</strong> {totalWeight} lbs
                  </p>
                  <p>
                    <strong>Job Numbers:</strong> {jobNumbers.join(", ")}
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
