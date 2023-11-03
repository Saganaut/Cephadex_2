import React, { useState, useEffect } from "react";
import { FormikProps } from "formik";
import { TextAreaField } from "@app/Shared/InputField";
import { FileInputField } from "@app/Shared/FileInputField";
import { SelectField } from "@app/Shared/SelectField";
import { languages } from "@app/Features/Extract/Languages";
import { InputField } from "@common/Form/InputField";
import { InputErrorMessage } from "@common/Form/InputErrorMessage";
import { Dropdown } from "@common/Form/Dropdown";

import { useSelector } from "react-redux";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
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

const SelectionAndOutputContainer: React.FC<
  SelectionAndOutputContainerProps
> = ({ formik }) => {
  const cardsData = useSelector((state) => state.cards);
  const [deckCards, setDeckCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (cardsData.length === 0) {
        const decks = await fetchAllDecks();
        setDeckCards(decks);
      } else {
        const filteredDecks = cardsData
          .filter((card) => card.type === "deck")
          .map((deck) => ({ id: deck.id, name: deck.name }));
        setDeckCards(filteredDecks);
      }
    };
    fetchData();
  }, [cardsData]);

  return (
    <>
      {" "}
      <div id="extract-selection" className="my-2">
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
          {/* {formik.errors.fileField && formik.touched.fileField && (
            <div className="text-red-500 mb-4 mt-10">
              {formik.errors.fileField}
            </div>
          )} */}
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
            error={!!(formik.errors.fileField && formik.touched.linkField)}
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
          <SelectField
            name="existingDeckField"
            value={formik.values.existingDeckField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            list={deckCards}
          />
        </div>
        <div className="mb-5">
          <h3>Choose language</h3>
          <Dropdown
            label="languageField"
            value={formik.values.languageField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={languages}
          />
        </div>
      </div>
    </>
  );
};

export { SelectionAndOutputContainer };
