import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import Confetti from "react-confetti";

const OnboardingChecklist = () => {
  const defaultChecklist = [
    { title: "Setup Zoom", link: "https://zoom.us/" },
    { title: "Setup Slack", link: "https://slack.com/" },
    { title: "Setup OneDrive", link: "https://onedrive.live.com/" },
    { title: "Setup Google Drive", link: "https://drive.google.com/" },
    { title: "Setup Trello", link: "https://trello.com/" },
    { title: "Setup GitHub", link: "https://github.com/" },
    { title: "Setup GitLab", link: "https://about.gitlab.com/" },
    { title: "Setup Microsoft Teams", link: "https://teams.microsoft.com/" },
    { title: "Setup Dropbox", link: "https://www.dropbox.com/" },
    { title: "Setup Notion", link: "https://www.notion.so/" },
    { title: "Setup Spotify", link: "https://www.spotify.com/" },
    { title: "Setup Netflix", link: "https://www.netflix.com/" },
    { title: "Setup Discord", link: "https://discord.com/" },
    { title: "Setup Skype", link: "https://www.skype.com/" },
  ];

  const getInitialState = () => {
    const storedStatuses = localStorage.getItem("onboardingChecklist");
    return storedStatuses
      ? JSON.parse(storedStatuses)
      : new Array(defaultChecklist.length).fill(false);
  };

  const [checkedStatuses, setCheckedStatuses] = useState(getInitialState());
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "onboardingChecklist",
      JSON.stringify(checkedStatuses)
    );
  }, [checkedStatuses]);

  const toggleItemChecked = (index: number) => {
    const updatedStatuses = [...checkedStatuses];

    // Check if it's being checked and not unchecked
    if (!updatedStatuses[index]) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    updatedStatuses[index] = !updatedStatuses[index];
    setCheckedStatuses(updatedStatuses);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <IonCard style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
        <IonCardHeader>
          <IonCardTitle
            style={{ textAlign: "center", fontSize: "24px", color: "#333" }}
          >
            Onboarding Checklist
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {defaultChecklist.map((item, index) => (
              <IonItem
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => toggleItemChecked(index)}
              >
                <IonLabel>{item.title}</IonLabel>
                <IonButton
                  fill="clear"
                  href={item.link}
                  target="_blank"
                  slot="end"
                  style={{ marginRight: "10px" }}
                >
                  Go
                </IonButton>
                <IonCheckbox slot="start" checked={checkedStatuses[index]} />
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default OnboardingChecklist;
