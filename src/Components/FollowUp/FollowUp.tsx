import React, { useEffect, useState, FC } from "react";
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonCardTitle,
  IonCardHeader,
  IonIcon,
  IonButton,
  IonToolbar,
  IonCheckbox,
  IonItemGroup,
  IonModal,
  IonHeader,
  IonTitle,
  IonContent,
  IonTextarea,
} from "@ionic/react";
import {
  arrowBack,
  arrowForward,
  call,
  closeCircle,
  mailOutline,
} from "ionicons/icons";
import { useCommonContext } from "../../Context/CommonContext";

// Import Swiper and its components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

interface Item {
  "Next Follow-Up": string;
  Name: string;
  [key: string]: any;
}

interface Swiper {
  slidePrev: () => void;
  slideNext: () => void;
}

const FollowUp: FC = () => {
  const { data } = useCommonContext();
  const [followUps, setFollowUps] = useState<Item[][]>([[], []]);
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const swiper = useSwiper();

  const handleSlidePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleSlideNext = () => {
    swiperInstance?.slideNext();
  };

  const formatPhoneNumber = (input: string) => {
    const cleaned = ("" + input).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  };

  const getSlideTitle = (index: number) => {
    switch (index) {
      case 0:
        return "Today";
      case 1:
        return "Tomorrow";
      default:
        return ""; // Default title, if needed
    }
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentSlideIndex(swiper.realIndex);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleItemClicked = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  useEffect(() => {
    if (data && data.items) {
      const followUpsForDates = [0, 1].map((offset) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + offset);
        const formattedDate = `${targetDate.getFullYear()}-${String(
          targetDate.getMonth() + 1
        ).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

        return data.items.filter((item: Item) => {
          const followUpDate = item["Next Follow-Up"].split(" ")[0];
          return followUpDate === formattedDate;
        });
      });

      setFollowUps(followUpsForDates);
    }
  }, [data]);
  console.log(data.items);

  return (
    <IonCard style={{ width: "100%" }}>
      <IonCardHeader>
        <div>
          <IonButton onClick={handleSlidePrev}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonButton onClick={handleSlideNext}>
            <IonIcon icon={arrowForward} />
          </IonButton>
        </div>
        <IonCardTitle>
          <strong>Follow-Ups: {getSlideTitle(currentSlideIndex)}</strong>
        </IonCardTitle>
      </IonCardHeader>

      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedItem?.Name}</IonTitle>
            <IonButton slot="end" onClick={() => setShowModal(false)}>
              <IonIcon icon={closeCircle} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLabel>
            <strong>Name:</strong> {selectedItem?.Name}
          </IonLabel>
          <IonLabel>
            <strong>Email:</strong> {selectedItem?.["Customer Email"]}
          </IonLabel>
          <IonLabel>
            <strong>Phone:</strong>{" "}
            {formatPhoneNumber(selectedItem?.["Phone #"] || "")}
          </IonLabel>
          <IonTextarea placeholder="Enter your notes here..."></IonTextarea>
        </IonContent>
      </IonModal>

      <Swiper
        navigation
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
      >
        {followUps.map((followUpItems, index: number) => (
          <SwiperSlide key={index}>
            <IonList>
              {followUpItems?.map((item, i) => (
                <IonItem key={i} onClick={() => handleItemClicked(item)}>
                  <IonLabel>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {item?.Name}
                    </div>
                    <div style={{ color: "#555" }}>
                      <strong>Phone #:</strong>{" "}
                      {formatPhoneNumber(item["Phone #"])}
                    </div>
                    <div style={{ color: "#555" }}>
                      <strong>Email:</strong> {item["Customer Email"]}
                    </div>
                  </IonLabel>

                  <IonItemGroup style={{ display: "flex" }}>
                    {/* Phone icon */}
                    <IonItem lines="none" style={{ padding: 0 }}>
                      <IonIcon
                        icon={call}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() =>
                          window.open(`tel:${item["Phone #"]}`, "_system")
                        }
                      />
                    </IonItem>

                    {/* Email icon */}
                    <IonItem lines="none" style={{ padding: 0 }}>
                      <IonIcon
                        icon={mailOutline}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() =>
                          window.open(
                            `mailto:${item["Customer Email"]}`,
                            "_system"
                          )
                        }
                      />
                    </IonItem>

                    {/* Checkbox */}
                    <IonItem lines="none" style={{ padding: 0 }}>
                      <IonCheckbox
                        onIonChange={(e) => {
                          if (e.detail.checked) {
                            // Your logic for sending the POST request when checkbox is checked
                          }
                        }}
                      />
                    </IonItem>
                  </IonItemGroup>
                </IonItem>
              ))}
            </IonList>
          </SwiperSlide>
        ))}
      </Swiper>
    </IonCard>
  );
};

export default FollowUp;
