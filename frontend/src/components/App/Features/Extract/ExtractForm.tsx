import React from "react";
import { validationSchema } from "@app/Features/Extract/ExtractFormValidation";
import { Formik, Form } from "formik";
import { CardTypeSelector } from "@app/Features/Extract/CardTypeSelector";
import { MultiOptionsContainer } from "@app/Features/Extract/MultiOptionsContainer";
import { AdvancedOptionsContainer } from "@app/Features/Extract/AdvancedOptionsContainer";
import { ExtractSubmitButton } from "@app/Features/Extract/ExtractSubmitButton";
import { SelectionAndOutputContainer } from "@app/Features/Extract/SelectionAndOutputContainer";

interface ExtractProps {
  customIsSelected: boolean;
}

const ExtractForm: React.FC<ExtractProps> = ({ customIsSelected }) => {
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
          cardTypeField: "",
          multiOptionsField: "",
          detailField: "",
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
