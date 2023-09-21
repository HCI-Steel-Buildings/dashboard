import React, { useMemo } from "react";
import "./ClientCard.css";
import { IonCard, IonCardSubtitle, IonCardTitle } from "@ionic/react";

interface ClientCardProps {
  name: string;
  type: string;
  projectId: string;
  searchTerm: string;
}

const ClientCard: React.FC<ClientCardProps> = ({
  name,
  type,
  projectId,
  searchTerm,
}) => {
  const shouldHighlight = useMemo(() => {
    return (
      searchTerm &&
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        projectId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [name, type, projectId, searchTerm]);

  return (
    <IonCard
      className={`client-card ${shouldHighlight ? "highlight-search" : ""}`}
    >
      <IonCardTitle>{name}</IonCardTitle>
      <IonCardSubtitle>{projectId}</IonCardSubtitle>
    </IonCard>
  );
};

export default ClientCard;
