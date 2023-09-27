import React, { useEffect, useState, FC } from "react";
import { Pie } from "react-chartjs-2";
import { useCommonContext } from "../Context/CommonContext";
import "chart.js/auto";
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow } from "@ionic/react";
import "./QuotesAnalytics.css";
import stateMapping from "./StateMappingObject";

interface Item {
  name?: string;
  "Contacted?": string;
  State?: string;
  [key: string]: any;
}
interface StateMapping {
  [key: string]: string;
}

const QuotesAnalytics: FC = () => {
  const [totalQuotes, setTotalQuotes] = useState<number>(0);
  const [contactedQuotes, setContactedQuotes] = useState<number>(0);
  const [statesCount, setStatesCount] = useState<Record<string, number>>({});
  const { data } = useCommonContext();

  useEffect(() => {
    const items: Item[] = data.items || [];

    const septemberQuotes = items.filter((item: Item) => {
      const quoteDate = item.name;
      if (quoteDate) {
        const date = new Date(quoteDate);
        return date.getMonth() === 8; // September
      }
      return false;
    });

    setTotalQuotes(septemberQuotes.length);

    const contactedQuotesCount = septemberQuotes.filter(
      (item: Item) => item["Contacted?"] === "YES"
    ).length;
    setContactedQuotes(contactedQuotesCount);
    const statesCount = items.reduce(
      (acc: Record<string, number>, item: Item) => {
        let state: string | undefined = item.State;
        if (state) {
          // Casting stateMapping to an indexable type
          state = (stateMapping as Record<string, string>)[state] || state;
          acc[state] = (acc[state] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    setStatesCount(statesCount);
  }, [data]);

  const contactedQuotesData = {
    labels: ["Contacted Quotes", "Not Contacted Quotes"],
    datasets: [
      {
        data: [contactedQuotes, totalQuotes - contactedQuotes],
        backgroundColor: ["#00FF00", "#FF0000"],
      },
    ],
  };

  const statesData = {
    labels: Object.keys(statesCount),
    datasets: [
      {
        data: Object.values(statesCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#00FF00",
        ], // Add more colors if needed
      },
    ],
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonCard>
            <IonCardContent>
              <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>
                Total Quotes in September: {totalQuotes}
              </h2>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol>
          <IonCard>
            <IonCardContent>
              <h2>
                <strong>Contacted Quotes:</strong>
                <strong className="contactedQuotes">{contactedQuotes}</strong>
              </h2>
              <Pie data={contactedQuotesData} />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol>
          <IonCard>
            <IonCardContent>
              <h2>
                <strong>Quotes By State</strong>
              </h2>
              <Pie data={statesData} />
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default QuotesAnalytics;
