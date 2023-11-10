import React from "react";
import { validationSchema } from "@extract/data/ExtractFormValidation";
import { Formik, Form } from "formik";
import { CardTypeSelector } from "@extract/CardTypeSelector";
import { MultiOptionsContainer } from "@extract/MultiOptionsContainer";
import { AdvancedOptionsContainer } from "@extract/AdvancedOptionsContainer";
import { ExtractSubmitButton } from "@extract/ExtractSubmitButton";
import { SelectionAndOutputContainer } from "@extract/SelectionAndOutputContainer";
import { extract } from "@services/Api/Deck/CreateApi";
import { logger } from "@utils/Logger";
interface ExtractProps {
  customIsSelected: boolean;
}

const ExtractForm: React.FC<ExtractProps> = ({ customIsSelected }) => {
  logger.log(ExtractForm, "ExtractForm");
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
          cardTypeField: "Mix",
          multiOptionsField: [],
          detailField: "",
          eitherTextOrFileOrUrlError: "",
          eitherNameOrExistingDeckError: "",
        }}
        validationSchema={validationSchema}
        validateOnBlur={true}
        onSubmit={(values) => {
          logger.log("ExtractForm", values);

          extract(values);
        }}
      >
        {(formik) => (
          <Form>
            {customIsSelected ? (
              <SelectionAndOutputContainer formik={formik} />
            ) : (
              <div id="customizations" className="my-5">
                <div className="text-white">
                  What type of cards would you like to create?
                </div>
                <CardTypeSelector />
                <div className="grid grid-cols-1 gap-y-5 mt-5">
                  <MultiOptionsContainer />
                  <AdvancedOptionsContainer />
                </div>
              </div>
            )}
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
