import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./ProjectCenter.css";
import { useCommonContext } from "../Context/CommonContext";
import { getCurrentMonthName, getMonthlyCount } from "../Utils/dateUtils";
import EcoBuildingCalculator from "../Components/EcoBuildingCalculator/EcoBuildingCalculator";

const Charts: React.FC = () => {
  const { data, weeklyCounts } = useCommonContext();
  const items = data?.items || [];
  const currentDate = new Date();
  const totalQuotesForMonth = getMonthlyCount(items, currentDate);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Center</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <EcoBuildingCalculator />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
