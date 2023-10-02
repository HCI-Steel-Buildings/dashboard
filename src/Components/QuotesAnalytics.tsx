import React, { useEffect, useState, FC } from "react";
import { Pie } from "react-chartjs-2";
import { useCommonContext } from "../Context/CommonContext";
import "chart.js/auto";
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow } from "@ionic/react";
import "./QuotesAnalytics.css";
import stateMapping from "./StateMappingObject";
import FollowUp from "./FollowUp/FollowUp";

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
  const currentMonth = new Date().getMonth();

  useEffect(() => {
    const items: Item[] = data.items || [];

    const octoberQuotes = items?.filter((item: Item) => {
      const quoteDate = item.name;
      if (quoteDate) {
        const date = new Date(quoteDate);
        return date.getMonth() === currentMonth;
      }
      return false;
    });

    setTotalQuotes(octoberQuotes.length);

    const contactedQuotesCount = octoberQuotes.filter(
      (item: Item) => item["Contacted?"] === "YES"
    ).length;
    setContactedQuotes(contactedQuotesCount);
    const statesCount = octoberQuotes?.reduce(
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
        ],
      },
    ],
  };

  return (
    <IonGrid>
      <IonRow>
        <IonCol size="4">
          {" "}
          {/* Takes up 1/3 of the width */}
          <IonCard>
            <IonCardContent>
              <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>
                Total Quotes in October: {totalQuotes}
              </h2>
            </IonCardContent>
          </IonCard>
          <FollowUp />
        </IonCol>

        <IonCol size="4">
          {" "}
          {/* Takes up 1/3 of the width */}
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

        <IonCol size="4">
          {" "}
          {/* Takes up 1/3 of the width */}
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
