import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
import { FormikProps } from "formik";
import { InputField } from "@common/Form/InputField";
import { TextAreaField } from "@common/Form/TextAreaField";
import { InputErrorMessage } from "@common/Form/InputErrorMessage";
import { Dropdown } from "@common/Form/Dropdown";
import { FileInputField } from "@common/Form/FileInputField";
import { languages } from "@source/components/App/Features/Extract/data/Languages";
import { DashboardCardsState } from "../../../../types/Globals";
import { Deck } from "../../../../types/Deck";
interface FormValues {
  nameField: string;
  fileField: File | null;
  linkField: string;
  textField: string;
  descriptionField: string;
  subjectField: string;
  existingDeckField: string;
  languageField: string;
}

interface SelectionAndOutputContainerProps {
  formik: FormikProps<FormValues>;
}
type DeckOption = {
  value: number;
  label: string;
};
const SelectionAndOutputContainer: React.FC<
  SelectionAndOutputContainerProps
> = ({ formik }) => {
  console.log("rendering SelectAndOutputContainer");
  const cardsData = useSelector(
    (state: { dashboardCards: DashboardCardsState }) => state.dashboardCards
  );
  const [deckCards, setDeckCards] = React.useState<DeckOption[]>([]);

  useEffect(() => {
    console.log("useEffect in SelectionAndOutputContainer");
    const fetchData = async () => {
      if (cardsData.length === 0) {
        const decks = await fetchAllDecks();
        const filteredDecks = decks
          .filter((deck: Deck) => deck.type === "Deck")
          .map((deck: Deck) => ({ value: deck.id, label: deck.name }));
        setDeckCards(filteredDecks);
      } else {
        const filteredDecks = cardsData
          .filter((card) => card.type === "Deck")
          .map((deck) => ({ value: deck.id, label: deck.name }));
        setDeckCards(filteredDecks);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {" "}
      <div id="extract-selection" className="my-2">
        <InputErrorMessage
          error={
            !!formik.errors.eitherNameOrExistingDeckError &&
            formik.touched.nameField &&
            formik.touched.existingDeckField
          }
          errorMessage={formik.errors.eitherNameOrExistingDeckError || ""}
        />
        <InputErrorMessage
          error={
            !!formik.errors.eitherTextOrFileOrUrlError &&
            (formik.touched.textField ||
              formik.touched.linkField ||
              formik.touched.fileField)
          }
          errorMessage={formik.errors.eitherTextOrFileOrUrlError || ""}
        />
        <div className=" w-full">
          <h3>*Title</h3>
          <InputField
            name="nameField"
            value={formik.values.nameField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Name of the deck, like Chemistry - Chapter 22: long"
            type="text"
          />
          <InputErrorMessage />
        </div>
        {formik.errors.nameField && (
          <div className="text-red-500 mb-4 mt-10">Name error</div>
        )}

        <div className="mb-1">
          <h3 className="mb-2">*Either upload a file</h3>
          <FileInputField
            formik={formik}
            name="fileField"
            onBlur={formik.handleBlur}
          />
          <InputErrorMessage
            error={!!(formik.errors.fileField && formik.touched.fileField)}
            errorMessage={formik.errors.fileField || ""}
          />
        </div>
        <div className="mb-1">
          <h3>Insert a link</h3>
          <InputField
            name="linkField"
            value={formik.values.linkField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Insert a wikipedia, youtube, or other URL"
            type="text"
          />
          <InputErrorMessage
            error={!!(formik.errors.linkField && formik.touched.linkField)}
            errorMessage={formik.errors.linkField || ""}
          />
        </div>
        <div className="mb-5">
          <h3>*Description</h3>

          <TextAreaField
            name="textField"
            value={formik.values.textField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Paste some text"
          />
        </div>
        <div className="mb-5">
          <h3>Subject</h3>
          <InputField
            name="subjectField"
            value={formik.values.subjectField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Set a subject"
            type="text"
          />
        </div>
        <div className="mb-5">
          <h3>Description</h3>
          <InputField
            name="descriptionField"
            value={formik.values.descriptionField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            placeholder="Add a description so you and others can identify what it's for easily"
          />
        </div>
        <div className="mb-5">
          <h3>Add to an existing deck</h3>
          {deckCards.length > 0 && (
            <Dropdown name="existingDeckField" label="" options={deckCards} />
          )}
        </div>
        <div className="mb-5">
          <h3>Choose language</h3>
          <Dropdown label="" options={languages} name="languageField" />
        </div>
      </div>
    </>
  );
};

export { SelectionAndOutputContainer };
