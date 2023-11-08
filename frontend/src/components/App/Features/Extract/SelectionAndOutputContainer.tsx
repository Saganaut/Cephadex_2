import React, { useState, useEffect } from "react";
import { FormikProps } from "formik";
import { InputField } from "@common/Form/InputField";
import { TextAreaField } from "@common/Form/TextAreaField";
import { InputErrorMessage } from "@common/Form/InputErrorMessage";
import { Dropdown } from "@common/Form/Dropdown";
import { FileInputField } from "@common/Form/FileInputField";
import { languages } from "@source/components/App/Features/Extract/data/Languages";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchDecksThunk } from "@services/Api/Deck/DeckApiThunks";
import { logger } from "@source/Lib/utils/Logger";

interface FormValues {
  nameField: string;
  fileField: File | null;
  linkField: string;
  textField: string;
  descriptionField: string;
  subjectField: string;
  existingDeckField: string;
  languageField: string;
  eitherNameOrExistingDeckError: string;
  eitherTextOrFileOrUrlError: string;
  tagField: string;
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
  logger.log("SelectionAndOutputContainer");
  const dispatch = useAppDispatch();
  const decks = useAppSelector((state) => state.decks);

  useEffect(() => {
    dispatch(fetchDecksThunk());
  }, [dispatch]);

  const deckOptions: DeckOption[] = decks.decks.map((deck) => ({
    value: deck.id,
    label: deck.name,
  }));

  useEffect(() => {
    if (deckOptions.length > 0 && !formik.values.existingDeckField) {
      formik.setFieldValue("existingDeckField", deckOptions[0].value);
    }
  }, [deckOptions, formik.values.existingDeckField, formik.setFieldValue]);

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
          <h3>Paste some text</h3>

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
          <h3>Tags</h3>
          <InputField
            name="tagField"
            value={formik.values.tagField}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Add some tags"
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
            placeholder="Add a description"
          />
        </div>
        <div className="mb-5">
          <h3>Add to an existing deck</h3>
          {deckOptions.length > 0 && (
            <Dropdown
              name="existingDeckField"
              label=""
              options={deckOptions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.existingDeckField}
            />
          )}
        </div>
        <div className="mb-5">
          <h3>Choose language</h3>
          <Dropdown
            label=""
            options={languages}
            name="languageField"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.languageField}
          />
        </div>
      </div>
    </>
  );
};

export { SelectionAndOutputContainer };
