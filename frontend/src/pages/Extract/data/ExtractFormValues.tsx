interface Role {
  value: number;
  label: string;
}

interface ExtractFormValues {
  nameField: string;
  fileField: File | null;
  linkField: string;
  textField: string;
  cardTypeField: string;
  descriptionField: string;
  subjectField: string;
  existingDeckField: string;
  languageField: string;
  eitherNameOrExistingDeckError: string;
  eitherTextOrFileOrUrlError: string;
  tagField: string;
  customTermField: string;
  customContentField: string;
  translationField: string;
  detailField: string;
  multiOptionsField: string[];
}

export default ExtractFormValues;
