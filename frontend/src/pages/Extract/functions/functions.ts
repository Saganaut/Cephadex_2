const turnFormIntoObject = (values: {
  nameField: any;
  fileField: any;
  linkField: any;
  textField: any;
  descriptionField: any;
  subjectField: any;
  existingDeckField: any;
  languageField: any;
  cardTypeField: any;
  multiOptionsField: any;
  detailField: any;
  customContentField: any;
  customTermField: any;
  translationField?: string;
  eitherTextOrFileOrUrlError?: string;
  eitherNameOrExistingDeckError?: string;
}) => {
  const {
    nameField,
    fileField,
    linkField,
    textField,
    descriptionField,
    subjectField,
    existingDeckField,
    languageField,
    cardTypeField,
    multiOptionsField,
    detailField,
    customContentField,
    customTermField,
  } = values;

  const data = {
    name: nameField,
    link: linkField,
    text: textField,
    description: descriptionField,
    subject: subjectField,
    existingDeck: existingDeckField,
    language: languageField,
    cardType: cardTypeField,
    multiOptions: multiOptionsField,
    detail: detailField,
    customContent: customContentField,
    customTerm: customTermField,
    file: null,
  };

  if (fileField?.name) {
    data.file = fileField.name;
  }

  return data;
};

const processData = (values: {
  [x: string]: any;
  nameField?: string;
  fileField: any;
  linkField?: string;
  textField?: string;
  descriptionField?: string;
  subjectField?: string;
  existingDeckField?: string;
  languageField?: string;
  cardTypeField?: string;
  multiOptionsField?: string[];
  detailField?: string;
  customContentField?: string;
  customTermField?: string;
  translationField?: string;
  eitherTextOrFileOrUrlError?: string;
  eitherNameOrExistingDeckError?: string;
}) => {
  if (values.cardTypeField === "Multiple choice") {
    values.cardTypeField = "Mcq";
  } else if (values.cardTypeField === "Fill in the blanks") {
    values.cardTypeField = "Cloze";
  }

  const { fileField, ...otherFields } = values;
  const dataString = JSON.stringify(otherFields);
  const bodyExtract = {
    data: dataString,
    file: fileField || null,
  };
  return bodyExtract;
};

export { turnFormIntoObject };

export { processData };
