import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Charts.css";
import QuotesChart from "../Components/QuotesChart/QuotesChart";
import { useMondayData } from "../Context/MondayDataContext";
import { getCurrentMonthName, getMonthlyCount } from "../Utils/dateUtils";

const Charts: React.FC = () => {
  const { data, weeklyCounts } = useMondayData();
  const items = data?.items || [];
  const currentDate = new Date();
  const totalQuotesForMonth = getMonthlyCount(items, currentDate);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {`${getCurrentMonthName()} ${currentDate.getFullYear()} Quotes - Total: ${totalQuotesForMonth}`}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <QuotesChart weeklyCounts={weeklyCounts || [0, 0, 0, 0, 0]} />
      </IonContent>
    </IonPage>
  );
};

export default Charts;
