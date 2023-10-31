import React, { useState, useEffect } from "react";
import { validationSchema } from "@app/Features/Extract/ExtractFormValidation";
import { InputField, TextAreaField } from "@app/Shared/InputField";
import { FileInputField } from "@app/Shared/FileInputField";
import { SelectField } from "@app/Shared/SelectField";
import { useSelector } from "react-redux";
import { fetchAllDecks } from "@services/Api/Deck/DeckApi";
import { languages } from "@app/Features/Extract/Languages";
import { Formik, Form } from "formik";
import { CardTypeSelector } from "@app/Features/Extract/CardTypeSelector";

import { MultiOptionsContainer } from "@app/Features/Extract/MultiOptionsContainer";
import { AdvancedOptionsContainer } from "@app/Features/Extract/AdvancedOptionsContainer";
import { ExtractSubmitButton } from "@app/Features/Extract/ExtractSubmitButton";
interface ExtractProps {
  customIsSelected: boolean;
}

const ExtractForm: React.FC<ExtractProps> = ({ customIsSelected }) => {
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
  console.log("validation schema", validationSchema);

  return (
    <>
      <Formik
        initialValues={{
          nameField: "",
          fileField: null,
          linkField: "",
          textField: "",
          descriptionField: "",
          subjectField: "",
          existingDeckField: "",
          languageField: "",
        }}
        validationSchema={validationSchema}
        validateOnBlur={true}
        onSubmit={(values) => {
          console.log("submit ----------------------------------");
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
            {customIsSelected ? (
              <div id="extract-selection" className="my-5">
                <div className="mb-5">
                  <h3>*Title</h3>
                  <InputField
                    name="nameField"
                    value={formik.values.nameField}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Name of the deck, like Chemistry - Chapter 22: long"
                    type="text"
                  />
                </div>
                {formik.errors.nameField && (
                  <div className="text-red-500 mb-4 mt-10">Name error</div>
                )}

                <div className="mb-5">
                  <h3 className="mb-5">*Either upload a file</h3>
                  <FileInputField
                    formik={formik}
                    name="fileField"
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.fileField && formik.touched.fileField && (
                    <div className="text-red-500 mb-4 mt-10">
                      {formik.errors.fileField}
                    </div>
                  )}
                </div>
                <div className="mb-5">
                  <h3>Insert a link</h3>
                  <InputField
                    name="linkField"
                    value={formik.values.linkField}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Insert a wikipedia, youtube, or other URL"
                    type="text"
                  />
                  {formik.errors.linkField && formik.touched.linkField ? (
                    <div className="text-red-500">
                      {formik.errors.linkField}
                    </div>
                  ) : null}
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
                  <SelectField
                    name="languageField"
                    value={formik.values.languageField}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    list={languages}
                  />
                </div>
              </div>
            ) : (
              <div id="customizations" className="my-5">
                <div className="text-white">
                  What type of cards would you like to create?
                </div>
                <CardTypeSelector />
              </div>
            )}
            <div>
              <MultiOptionsContainer />
              <AdvancedOptionsContainer />
            </div>
            <div className="flex justify-end">
              <ExtractSubmitButton />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export { ExtractForm };
