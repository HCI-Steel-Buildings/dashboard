import React, { useEffect, useState, FC } from "react";
import { Pie } from "react-chartjs-2";
import { useCommonContext } from "../Context/CommonContext";
import "chart.js/auto";

const QuotesAnalytics: FC = () => {
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [contactedQuotes, setContactedQuotes] = useState(0);

  const { data } = useCommonContext();
  useEffect(() => {
    const items = data.items || [];

    const septemberQuotes = items.filter((item: any) => {
      const quoteDate = item["name"];
      if (quoteDate) {
        const date = new Date(quoteDate);
        return date.getMonth() === 8; // Months are 0-indexed, so 8 corresponds to September
      }
      return false;
    });

    setTotalQuotes(septemberQuotes.length);

    const contactedQuotesCount = septemberQuotes.filter(
      (item: any) => item["Contacted?"] === "YES"
    ).length;

    setContactedQuotes(contactedQuotesCount);
  }, [data]);

  const totalQuotesData = {
    labels: ["September Quotes", "Others"],
    datasets: [
      {
        data: [totalQuotes, data?.items?.length - totalQuotes],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const contactedQuotesData = {
    labels: ["Contacted Quotes in September", "Others"],
    datasets: [
      {
        data: [contactedQuotes, totalQuotes - contactedQuotes],
        backgroundColor: ["#FFCE56", "#FF9F40"],
      },
    ],
  };

  return (
    <div>
      <h2>Total Quotes in September: {totalQuotes}</h2>
      <Pie data={totalQuotesData} />
      <h2>Contacted Quotes in September: {contactedQuotes}</h2>
      <Pie data={contactedQuotesData} />
    </div>
  );
};

export default QuotesAnalytics;
