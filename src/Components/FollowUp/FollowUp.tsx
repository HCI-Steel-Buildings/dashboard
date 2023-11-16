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
  open,
} from "ionicons/icons";
import { useCommonContext } from "../../Context/CommonContext";
import { formatName, formatPhoneNumber } from "../../Utils/nameUtils";
import FollowUpModal from "./FollowUpModal";

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
  const { data, refreshData } = useCommonContext();
  const [followUps, setFollowUps] = useState<Item[][]>([[], []]);
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [missedFollowUps, setMissedFollowUps] = useState<Item[]>([]);

  const swiper = useSwiper();

  const handleSlidePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleSlideNext = () => {
    swiperInstance?.slideNext();
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
      // Logic for Today's and Tomorrow's Follow-Ups
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

      // Logic for Missed Follow-Ups
      const today = new Date();
      const beginningOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const todayStr = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const missedItems = data.items.filter((item: Item) => {
        const followUpDate = item["Next Follow-Up"].split(" ")[0];
        return (
          followUpDate < todayStr &&
          followUpDate >=
            `${beginningOfMonth.getFullYear()}-${String(
              beginningOfMonth.getMonth() + 1
            ).padStart(2, "0")}-01` &&
          item["Contacted?"] === "NO"
        );
      });

      setMissedFollowUps(missedItems);
    }
  }, [data]);

  const sendPostRequest = async (data: any) => {
    try {
      const response = await fetch("/api/update-contact-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <>
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

        <FollowUpModal
          isOpen={showModal}
          item={selectedItem}
          onClose={() => setShowModal(false)}
        />

        <Swiper
          navigation
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
        >
          {followUps.map((followUpItems, index: number) => (
            <SwiperSlide key={index}>
              <IonList>
                {followUpItems?.map((item, i) => (
                  <IonItem key={item?.id}>
                    <IonLabel>
                      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        {formatName(item?.Name)}
                      </div>
                      <div style={{ color: "#555" }}>
                        <strong>Phone #:</strong>{" "}
                        {formatPhoneNumber(item["Phone #"])}
                      </div>
                      <div style={{ color: "#555" }}>
                        <strong>Email:</strong> {item["Customer Email"]}
                      </div>
                    </IonLabel>
                    <IonButton onClick={() => handleItemClicked(item)}>
                      <IonIcon icon={open} />
                    </IonButton>

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
                          onIonChange={async (e) => {
                            if (e.detail.checked) {
                              // Wait for 2 seconds
                              const dataToSend = {
                                itemId: item?.id,
                              };

                              // Optimistically remove the item from the list
                              const newFollowUps = [...followUps];
                              newFollowUps[currentSlideIndex] = newFollowUps[
                                currentSlideIndex
                              ].filter((i) => i.id !== item.id);
                              setFollowUps(newFollowUps);

                              const response = await sendPostRequest(
                                dataToSend
                              );
                              if (!response) {
                                // If request failed, revert the UI changes
                                const revertedFollowUps = [...followUps];
                                revertedFollowUps[currentSlideIndex].push(item);
                                setFollowUps(revertedFollowUps);

                                // Notify the user of the error
                                alert(
                                  "Error updating follow-up status. Please try again."
                                );
                              } else {
                                // Optionally notify the user of success
                                alert("Follow-up status updated successfully.");
                              }
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
      <IonCard style={{ width: "100%" }}>
        <IonCardHeader style={{ backgroundColor: "rgba(255,0,0,0.5)" }}>
          <IonCardTitle>
            <strong>Missed Follow-Ups</strong>
            <span>:{missedFollowUps?.length}</span>
          </IonCardTitle>
        </IonCardHeader>

        <IonList>
          {missedFollowUps?.map((item, i) => (
            <IonItem key={item?.id}>
              <IonLabel>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {formatName(item?.Name)}
                </div>
                <div style={{ color: "#555" }}>
                  <strong>Phone #:</strong> {formatPhoneNumber(item["Phone #"])}
                </div>
                <div style={{ color: "#555" }}>
                  <strong>Email:</strong> {item["Customer Email"]}
                </div>
              </IonLabel>
              <IonButton onClick={() => handleItemClicked(item)}>
                <IonIcon icon={open} />
              </IonButton>

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
                      window.open(`mailto:${item["Customer Email"]}`, "_system")
                    }
                  />
                </IonItem>

                {/* Checkbox */}
                <IonItem lines="none" style={{ padding: 0 }}>
                  <IonCheckbox
                    onIonChange={async (e) => {
                      if (e.detail.checked) {
                        // Wait for 2 seconds
                        setTimeout(async () => {
                          const dataToSend = {
                            itemId: item?.id,
                          };

                          // Optimistically remove the item from the list
                          const newMissedFollowUps = missedFollowUps.filter(
                            (i) => i.id !== item.id
                          );
                          setMissedFollowUps(newMissedFollowUps);

                          const response = await sendPostRequest(dataToSend);
                          if (!response) {
                            // If request failed, revert the UI changes
                            setMissedFollowUps((prev) => [...prev, item]);

                            // Notify the user of the error
                            alert(
                              "Error updating missed follow-up status. Please try again."
                            );
                          } else {
                            // Optionally notify the user of success
                            alert(
                              "Missed follow-up status updated successfully."
                            );
                          }
                        }, 2000);
                      }
                    }}
                  />
                </IonItem>
              </IonItemGroup>
            </IonItem>
          ))}
        </IonList>
      </IonCard>
    </>
  );
};

export default FollowUp;
