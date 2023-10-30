import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { validationSchema } from "components/App/Features/Extract/ExtractFormValidation";
import { InputField, TextAreaField } from "components/App/Shared/InputField";
import { FileInputField } from "components/App/Shared/FileInputField";
import { SelectField } from "components/App/Shared/SelectField";
import { useSelector } from "react-redux";
import { fetchAllDecks } from "services/Api/Deck/DeckApi";
import { languages } from "components/App/Features/Extract/Languages";
import { Formik, Form } from "formik";

const ExtractForm = () => {
  const cardsData = useSelector((state) => state.cards);
  const [deckCards, setDeckCards] = useState([]);

  const handleFileChange = (selectedFile, formik) => {
    console.log("!!!!!!!!!!!!!!!!!");
    const file = selectedFile;
    console.log("file:", file);
    formik.setFieldValue("fileField", file);
    debugger;
    formik.setFieldTouched("fileField", true);
  };

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
          <Form onSubmit={formik.handleSubmit}>
            <div>
              <div>
                {formik.errors.eitherTextOrFileOrUrl && (
                  <div className="text-red-500 mb-4">
                    {formik.errors.eitherTextOrFileOrUrl}
                  </div>
                )}
                {formik.errors.eitherNameOrExistingDeck && (
                  <div className="text-red-500 mb-4">
                    {formik.errors.eitherNameOrExistingDeck}
                  </div>
                )}
                {formik.errors.fileFormat && (
                  <div className="text-red-500 mb-4">
                    111{formik.errors.fileFormat}
                  </div>
                )}
                {formik.errors.fileSize && formik.touched.fileField && (
                  <div className="text-red-500 mb-4">
                    1111{formik.errors.fileSize}
                  </div>
                )}
              </div>
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
              <div className="mb-5">
                <h3>*Either upload a file</h3>
                <FileInputField
                  formik={formik}
                  name="fileField"
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                />
                {console.log("formik.touched:", formik.touched)}
                {console.log("formik.errors:", formik.errors)}
                {console.log("formik file field size", formik.touched.fileSize)}
                {console.log(
                  "formik file field format",
                  formik.touched.fileFormat
                )}
                {formik.errors.fileFormat && (
                  <div className="text-red-500 mb-4 mt-10">
                    1111{formik.errors.fileFormat}
                  </div>
                )}
                {formik.errors.fileSize && (
                  <div className="text-red-500 mb-4">
                    1111{formik.errors.fileSize}
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
                  <div className="text-red-500">{formik.errors.linkField}</div>
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export { ExtractForm };
