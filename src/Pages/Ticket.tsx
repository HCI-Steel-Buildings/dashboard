import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonFooter,
  IonInput,
} from "@ionic/react";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Ticket.css";

const Ticket: React.FC = () => {
  const { user } = useAuth0(); // Grab the user from the useAuth0 hook
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(""); // state for the modal textarea
  const [tickets, setTickets] = useState<any[]>([]); // store our tickets here

  const handleAddTicket = () => {
    const newTicket = {
      user: user?.name,
      note,
      id: Date.now(), // using timestamp as a simple unique id
    };

    setTickets([newTicket, ...tickets]);
    setNote("");
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>IT Ticketing</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tickets</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonButton onClick={() => setShowModal(true)}>Add Ticket</IonButton>

        <IonList>
          {tickets.map((ticket) => (
            <IonItem key={ticket.id}>
              <IonLabel>
                {ticket.note} <br />
                <small>Submitted by: {ticket.user}</small>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Ticket</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonTextarea
              value={note}
              onIonChange={(e) => setNote(e.detail.value!)}
              placeholder="Enter ticket note..."
            ></IonTextarea>
          </IonContent>
          <IonFooter>
            <IonButton onClick={handleAddTicket}>Submit Ticket</IonButton>
            <IonButton color="medium" onClick={() => setShowModal(false)}>
              Cancel
            </IonButton>
          </IonFooter>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Ticket;
