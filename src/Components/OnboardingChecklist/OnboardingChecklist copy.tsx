import React, { useState } from "react";
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

const OnboardingChecklist = () => {
  const [checked, setChecked] = useState(false);

  const [checklist, setChecklist] = useState([
    { title: "Setup Zoom", checked: false, link: "https://zoom.us/" },
    { title: "Setup Slack", checked: false, link: "https://slack.com/" },
    {
      title: "Setup OneDrive",
      checked: false,
      link: "https://onedrive.live.com/",
    },
    {
      title: "Setup Google Drive",
      checked: false,
      link: "https://drive.google.com/",
    },
    { title: "Setup Trello", checked: false, link: "https://trello.com/" },
    { title: "Setup GitHub", checked: false, link: "https://github.com/" },
    {
      title: "Setup GitLab",
      checked: false,
      link: "https://about.gitlab.com/",
    },
    {
      title: "Setup Microsoft Teams",
      checked: false,
      link: "https://teams.microsoft.com/",
    },
    {
      title: "Setup Dropbox",
      checked: false,
      link: "https://www.dropbox.com/",
    },
    { title: "Setup Notion", checked: false, link: "https://www.notion.so/" },
    {
      title: "Setup Spotify",
      checked: false,
      link: "https://www.spotify.com/",
    },
    {
      title: "Setup Netflix",
      checked: false,
      link: "https://www.netflix.com/",
    },
    { title: "Setup Discord", checked: false, link: "https://discord.com/" },
    { title: "Setup Skype", checked: false, link: "https://www.skype.com/" },
  ]);

  const toggleItemChecked = (index: number) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    setChecklist(updatedChecklist);
  };

  return (
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
          {checklist?.map((item, index) => {
            return (
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
                <IonCheckbox slot="start" checked={item.checked} />
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default OnboardingChecklist;
