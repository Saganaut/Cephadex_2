import { type UserSettingsSchema } from "@source/client";
import { useAppDispatch } from "@source/lib/store/hooks";
import { updateUserSettings } from "@source/lib/store/userSettings/actions";
import { type Step, type Steps } from "intro.js-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { useFetchUser } from "../userHooks/useFetchUser";

interface useIntroJSProps {
  type:
    | "dashboard"
    | "create-deck"
    | "decks"
    | "quiz"
    | "create-quiz"
    | "group"
    | "cards"
    | "study"
    | "play";
  introSteps: Step[];
  startingElement?: string;
}

const useIntroJS = (
  props: useIntroJSProps
): {
  stepsRef: React.MutableRefObject<Steps | null>;
  isInitialTourActive: boolean;
  markSectionAsToured: () => void;
  handleTabChange: (startStepIndex: number) => void;
} => {
  const [tourCompleted, setTourCompleted] = useState(false);
  const stepsRef = useRef<Steps>(null);
  const [isInitialTourActive, setIsInitialTourActive] = useState(false);
  const [touredSection, setTouredSection] = useState<object>({});
  const dispatch = useAppDispatch();
  const { userSettings } = useFetchUser();
  const handleTabChange = (startStepIndex: number): void => {
    if (stepsRef.current !== null) {
      setTimeout(() => {
        stepsRef.current?.introJs.start(props.startingElement);
        stepsRef.current?.introJs.goToStepNumber(startStepIndex);
      }, 1000);
    }
  };

  const markSectionAsToured = useCallback(
    (updatedSettings: UserSettingsSchema) => {
      if (isInitialTourActive) {
        setTourCompleted(true);
        setIsInitialTourActive(false);
        void dispatch(updateUserSettings(updatedSettings));
      }
    },
    [dispatch, isInitialTourActive]
  );

  const initializeTour = (section: object): void => {
    if (tourCompleted) return;
    setTimeout(() => {
      setIsInitialTourActive(true);
      setTouredSection(section);
    }, 2000);
  };

  if (userSettings != null && !isInitialTourActive) {
    switch (props.type) {
      case "dashboard":
        if (userSettings.newUser) {
          initializeTour({ newUser: false });
        }
        break;
      case "create-deck":
        if (userSettings.newUserCreate) {
          initializeTour({ newUserCreate: false });
        }
        break;
      case "decks":
        if (userSettings.newUserDecks) {
          initializeTour({ newUserDecks: false });
        }
        break;
      case "quiz":
        if (userSettings.newUserTests) {
          initializeTour({ newUserTests: false });
        }
        break;
      case "group":
        if (userSettings.newUserGroups) {
          initializeTour({ newUserGroups: false });
        }
        break;
      case "study":
        if (userSettings.newUserStudy) {
          initializeTour({ newUserStudy: false });
        }
        break;
      case "play":
        if (userSettings.newUserPlay) {
          initializeTour({ newUserPlay: false });
        }
        break;
      case "cards":
        if (userSettings.newUserCards) {
          initializeTour({ newUserCards: false });
        }
        break;
      case "create-quiz":
        if (userSettings.newUserCreateQuiz) {
          initializeTour({ newUserCreateQuiz: false });
        }
        break;
      default:
        break;
    }
  }

  const updatedSettings = useMemo(
    () => ({ ...userSettings, ...touredSection }),
    [userSettings, touredSection]
  );

  return {
    stepsRef,
    isInitialTourActive,
    markSectionAsToured: () => {
      markSectionAsToured(updatedSettings);
    },
    handleTabChange,
  };
};

export { useIntroJS };
