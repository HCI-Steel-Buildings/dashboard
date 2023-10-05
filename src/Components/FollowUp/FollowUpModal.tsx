import React, { FC } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonButton,
  IonIcon,
  IonTextarea,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardHeader,
  IonText,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";

interface FollowUpModalProps {
  isOpen: boolean;
  item: any;
  onClose: () => void;
}

const FollowUpModal: FC<FollowUpModalProps> = ({ isOpen, item, onClose }) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader translucent>
        <IonToolbar color="primary">
          <IonTitle>{item?.Name}</IonTitle>
          <IonButton slot="end" onClick={onClose} color={"danger"}>
            <IonIcon icon={closeCircle} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Customer Information</strong>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel>
                          <strong>Name:</strong>
                        </IonLabel>
                        <IonText> {item?.Name}</IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonLabel>
                          <strong>Email:</strong>
                        </IonLabel>
                        <IonText> {item?.["Customer Email"]}</IonText>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonLabel>
                          <strong>Phone:</strong>
                        </IonLabel>
                        <IonText> {item?.["Phone #"]}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Quote Information</strong>
                  </IonCardTitle>
                </IonCardHeader>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    <strong>Notes</strong>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonTextarea
                    style={{ height: "200px" }}
                    placeholder="Enter your notes here..."
                  ></IonTextarea>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default FollowUpModal;
