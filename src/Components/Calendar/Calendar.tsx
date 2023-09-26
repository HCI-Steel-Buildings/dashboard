import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowBack, arrowForward } from "ionicons/icons";
import "./Calendar.css";
import { useMondayData } from "../../Context/MondayDataContext";
import {
  isWeekend,
  formatDate,
  isToday,
  monthNames,
} from "../../Utils/dateUtils";
import ClientCard from "../ClientCard/ClientCard";
import { parseDate } from "../../Utils/dateUtils";

export const Calendar: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  // State management for the calendar component.
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data } = useMondayData();
  const items = data?.items || [];

  const dateToClientMapping: {
    [date: string]: {
      clients: Array<{ name: string; type: string; projectId: string }>;
      count: number;
    };
  } = {};

  const dailyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  let monthCount = 0;

  items.forEach((item: any) => {
    const date = parseDate(item.name);
    const clientName = item.column_values[2]?.text;
    const clientType = item.column_values[9]?.text;
    const projectId = item.column_values[1]?.text;

    if (date && clientName && clientType && projectId) {
      const parsedDate = new Date(date);
      if (parsedDate.getMonth() === currentDate.getMonth()) {
        monthCount++;
        const dayIndex = parsedDate.getDay();
        dailyCounts[dayIndex]++;
      }

      if (!dateToClientMapping[date]) {
        dateToClientMapping[date] = { clients: [], count: 0 };
      }

      dateToClientMapping[date].clients.push({
        name: clientName,
        type: clientType,
        projectId: projectId,
      });

      dateToClientMapping[date].count++;
    }
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const daysArray = new Array(42).fill(null).map((_, index) => {
    const dayNumber = index - firstDay + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }

  const changeMonth = (direction: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    );
    setCurrentDate(newDate);
  };

  return (
    <IonCard className="calendar-card">
      <div className="monthly-stats">
        <div>Total for the month: {monthCount}</div>
      </div>

      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={() => changeMonth(-1)}>
            <IonIcon icon={arrowBack} />
          </IonButton>
        </IonButtons>
        <IonLabel
          className="ion-text-center"
          style={{ fontWeight: "bold", fontSize: "20px" }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </IonLabel>
        <IonButtons slot="end">
          <IonButton onClick={() => changeMonth(1)}>
            <IonIcon icon={arrowForward} />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonGrid>
        <IonRow>
          {dayNames.map((dayName, index) => (
            <IonCol key={index} className="calendar-day-name">
              <IonLabel>{dayName}</IonLabel>
            </IonCol>
          ))}
        </IonRow>
        {weeks.map((week, index) => (
          <IonRow key={index}>
            {week.map((day, dayIndex) => {
              const thisDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day || 1
              );
              const clientNames = dateToClientMapping[formatDate(thisDate)];
              return (
                <IonCol
                  key={dayIndex}
                  className={`calendar-day-cell ${
                    isWeekend(dayIndex) ? "weekend" : "workday"
                  } ${!day ? "empty-cell" : ""} ${
                    isToday(thisDate) ? "current-day" : ""
                  }`}
                >
                  {day && (
                    <>
                      <IonLabel className="calendar-day-label">{day}</IonLabel>
                      {clientNames &&
                        clientNames.clients.map((client, clientIndex) => (
                          <ClientCard
                            key={clientIndex}
                            name={client.name}
                            type={client.type}
                            projectId={client.projectId}
                            searchTerm={searchTerm}
                          />
                        ))}

                      <IonLabel className="calendar-quote-counter">
                        {clientNames && clientNames.count}
                      </IonLabel>
                    </>
                  )}
                </IonCol>
              );
            })}
          </IonRow>
        ))}
      </IonGrid>
    </IonCard>
  );
};

export default Calendar;
