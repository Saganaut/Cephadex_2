import type { UserSchema, UserSettingsSchema } from "@source/client";
import { StyledButton } from "@source/common/Buttons/StyledButton";
import { Dropdown } from "@source/common/Form/Dropdown";
import { useAppDispatch } from "@source/lib/store/hooks";
import { updateUserSettings } from "@source/lib/store/userSettings/actions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { languages } from "../Extract/StepOneComponents/languages";
import { InputRangeField } from "./components/InputRangeField";
import { SwitchFieldHookForm } from "./components/SwitchFieldHookForm";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface SettingsTabProps {
  user: UserSchema;
  settings: UserSettingsSchema;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ user, settings }) => {
  const [newUserEnabled, setNewUserEnabled] = useState<boolean>(
    settings.newUser ?? false
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const existingPreference = localStorage.getItem("dark-mode");
    return existingPreference != null ? JSON.parse(existingPreference) : true;
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    localStorage.setItem("dark-mode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const [basicOpen, setBasicOpen] = React.useState(false);
  const [studyOpen, setStudyOpen] = React.useState(true);
  const {
    register,
    getValues,
    watch,
    clearErrors,
    setValue,
    reset,
    handleSubmit,
  } = useForm<UserSettingsSchema>({
    defaultValues: {
      ...settings,
    },
  });
  register("theme");
  register("newUser");
  register("newUserStudy");
  register("newUserDecks");
  register("newUserTests");
  register("newUserCards");
  register("qtyCardsToLoadBeforeNewCards");
  register("numberOfCardsToLoad");
  // register("minimumSrsInterval");
  register("box0Multiplier");
  register("box1Multiplier");
  register("box2Multiplier");
  register("box3Multiplier");
  register("qtyCorrectInARowForMovingUpBox");
  register("retrieveWithinMinutes");
  // register("highestBox");
  register("qtyCorrectInARowForIntervalBonus");
  register("intervalBonusForCorrectInARow");
  // register("decrementBox1Multiplier");
  // register("decrementBox2Multiplier");
  // register("decrementBox3Multiplier");
  register("decrementMinimumSrsInterval");
  register("maxSrsInterval");
  // register("minimumBoxIdAfterStartingToStudyCard");
  // register("tooEasyMultiplier");
  // register("tooHardMultiplier");
  watch("qtyCardsToLoadBeforeNewCards");
  watch("numberOfCardsToLoad");
  watch("maxSrsInterval");
  watch("box0Multiplier");
  watch("box1Multiplier");
  watch("box2Multiplier");
  watch("box3Multiplier");
  watch("qtyCorrectInARowForMovingUpBox");
  watch("highestBox");
  watch("qtyCorrectInARowForIntervalBonus");
  watch("intervalBonusForCorrectInARow");
  watch("decrementBox1Multiplier");
  watch("decrementBox2Multiplier");
  watch("decrementBox3Multiplier");
  watch("decrementMinimumSrsInterval");
  watch("minimumBoxIdAfterStartingToStudyCard");
  watch("tooEasyMultiplier");
  watch("tooHardMultiplier");
  watch("retrieveWithinMinutes");

  const theme = watch("theme");
  const isThemeDark = theme === "dark";
  const toggleTheme = (): void => {
    if (getValues("theme") === "Dark") {
      setValue("theme", "Light");
      setDarkMode(false);
      return;
    }
    setValue("theme", "Dark");
    setDarkMode(true);
  };

  const onSubmit = (data: UserSettingsSchema): void => {
    void dispatch(updateUserSettings(data));
  };

  const languageField = register("language");
  watch("language");

  const languageFieldChange = (value: {
    value: number;
    label: string;
  }): void => {
    void languageField.onChange({
      target: { value, name: "language" },
    });
    setValue("language", value.label)
  };

  const handleResetToDefaultValues = (): void => {
    setValue("qtyCardsToLoadBeforeNewCards", 20);
    setValue("numberOfCardsToLoad", 20);
    setValue("box0Multiplier", 2);
    setValue("box1Multiplier", 4);
    setValue("box2Multiplier", 6);
    setValue("box3Multiplier", 10);
    setValue("qtyCorrectInARowForMovingUpBox", 3);
    setValue("qtyCorrectInARowForIntervalBonus", 3);
    setValue("intervalBonusForCorrectInARow", 3600);
  };

  const toggleNewUserSettings = (): void => {

    const valueNewUser = !newUserEnabled;
    setNewUserEnabled(valueNewUser);


    setValue("newUser", valueNewUser);
    setValue("newUserStudy", valueNewUser);
    setValue("newUserDecks", valueNewUser);
    setValue("newUserTests", valueNewUser);
    setValue("newUserCards", valueNewUser);
    setValue("newUserCreate", valueNewUser);
    setValue("newUserCreateQuiz", valueNewUser);
    setValue("newUserPlay", valueNewUser);
    setValue("newUserGroups", valueNewUser);
  };
  const handleRangeChange = (field: string, value: number): void => {
    setValue(field, value);
  };

  return (
    <div className=" mt-4 max-w-4xl rounded-lg bg-mariana-blue px-8 py-4 text-white shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div onClick={() => {
            setStudyOpen(!studyOpen);
          }} className = " flex cursor-pointer items-center gap-2"> {studyOpen ?<ChevronDownIcon   className =  "h-6 w-6"/> : <ChevronUpIcon className = "h-6 w-6" />  }<h3
         
          className="text-2xl "
        >
          Study Settings
        </h3></div>
        <StyledButton
          style="outline"
          size="small"
          type="button"
          onClick={handleResetToDefaultValues}
          label="Reset to Default"
        />
        {studyOpen && (
          <div className=" rounded-xl bg-mariana-blue-100 p-4">
            <>
              <InputRangeField
                id="qtyCardsToLoadBeforeNewCards"
                label={"Cards to load before new cards"}
                min={10}
                max={200}
                value={getValues("qtyCardsToLoadBeforeNewCards") ?? 0}
                onChange={(value) => {
                  handleRangeChange("qtyCardsToLoadBeforeNewCards", value);
                }}
              />
              <InputRangeField
                id="numberOfCardsToLoad"
                label={"Number of cards to load at once"}
                min={10}
                max={200}
                value={getValues("numberOfCardsToLoad") ?? 0}
                onChange={(value) => {
                  handleRangeChange("numberOfCardsToLoad", value);
                }}
              />
              <InputRangeField
                id="box0Multiplier"
                label="'New' multiplier"
                min={1}
                max={10}
                type="float"
                value={getValues("box0Multiplier") ?? 0}
                onChange={(value) => {
                  handleRangeChange("box0Multiplier", value);
                }}
              />
              <InputRangeField
                id="box1Multiplier"
                label="'Learning' multiplier"
                min={1}
                max={10}
                type="float"
                value={getValues("box1Multiplier") ?? 0}
                onChange={(value) => {
                  handleRangeChange("box1Multiplier", value);
                }}
              />
              <InputRangeField
                id="box2Multiplier"
                label="'Review' multiplier"
                min={1.0}
                max={10}
                type="float"
                value={getValues("box2Multiplier") ?? 0}
                onChange={(value) => {
                  handleRangeChange("box2Multiplier", value);
                }}
              />
              <InputRangeField
                id="box3Multiplier"
                label="'Mastered' multiplier"
                min={1}
                max={10}
                type="float"
                value={getValues("box3Multiplier") ?? 0}
                onChange={(value) => {
                  handleRangeChange("box3Multiplier", value);
                }}
              />
              <InputRangeField
                id="qtyCorrectInARowForMovingUpBox"
                label="Correct in a row to move up"
                min={1}
                max={10}
                value={getValues("qtyCorrectInARowForMovingUpBox") ?? 0}
                onChange={(value) => {
                  handleRangeChange("qtyCorrectInARowForMovingUpBox", value);
                }}
              />
              <InputRangeField
                id="qtyCorrectInARowForIntervalBonus"
                label="Correct in a row for bonus"
                min={2}
                max={10}
                value={getValues("qtyCorrectInARowForIntervalBonus") ?? 0}
                onChange={(value) => {
                  handleRangeChange("qtyCorrectInARowForIntervalBonus", value);
                }}
              />
              <InputRangeField
                id="intervalBonusForCorrectInARow"
                label="Interval bonus for correct in a row"
                min={10}
                max={4320}
                type="minutes"
                value={getValues("intervalBonusForCorrectInARow") ?? 0}
                onChange={(value) => {
                  handleRangeChange("intervalBonusForCorrectInARow", value);
                }}
              />
              <InputRangeField
                id="retrieveWithinMinutes"
                label="Retrieve cards due within X minutes"
                min={1}
                max={2880}
                type="minutes"
                value={getValues("retrieveWithinMinutes") ?? 0}
                onChange={(value) => {
                  handleRangeChange("retrieveWithinMinutes", value);
                }}
              />
              <InputRangeField
                id="maxSrsInterval"
                label="Max interval"
                min={6000}
                max={525600}
                type="minutes"
                value={getValues("maxSrsInterval") ?? 0}
                onChange={(value) => {
                  handleRangeChange("maxSrsInterval", value);
                }}
              />
            </>
          </div>
        )}
        <div onClick={() => {
            setBasicOpen(!basicOpen);
          }} className = " flex cursor-pointer items-center gap-2"> {basicOpen ? <ChevronDownIcon   className =  "h-6 w-6"/> : <ChevronUpIcon className = "h-6 w-6" />  }<h3
         
          className="text-2xl "
        >
          Base Settings
        </h3></div>
        {basicOpen && (
          <div className="w-fit rounded-xl bg-mariana-blue-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <SwitchFieldHookForm
                  enabled={isThemeDark}
                  setEnabled={toggleTheme}
                  label="Dark Mode"
                />
              </div>
              <div className="flex items-center">
                <SwitchFieldHookForm
                  enabled={newUserEnabled}
                  setEnabled={toggleNewUserSettings}
                  label="Enable tutorials"
                />
              </div>
              <div className="max-w-[400px]">
                {/* <Dropdown
                  options={languages}
                  onChange={languageFieldChange}
                  name={languageField.name}
                  dropdownRef={languageField.ref}
                  value={getValues("language")} // ignore this error for now
                  style={"select"}
                /> */}
              </div>
            </div>
          </div>
        )}
        <StyledButton onClick={() => {}} label="Save" type="submit" />
      </form>
    </div>
  );
};

export { SettingsTab };
