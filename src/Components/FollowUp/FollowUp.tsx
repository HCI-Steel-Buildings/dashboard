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
} from "@ionic/react";
import { arrowBack, arrowForward } from "ionicons/icons";
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

  const swiper = useSwiper();

  const handleSlidePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleSlideNext = () => {
    swiperInstance?.slideNext();
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
          <strong>Follow-Ups:</strong>
        </IonCardTitle>
      </IonCardHeader>

      <Swiper navigation onSwiper={setSwiperInstance}>
        {followUps.map((followUpItems, index) => (
          <SwiperSlide key={index}>
            <IonList>
              {followUpItems.map((item, i) => (
                <IonItem key={i}>
                  <IonLabel>
                    <strong>Name:</strong> {item.Name}
                    <br />
                    Follow-Up: {item["Phone #"]}
                  </IonLabel>
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
