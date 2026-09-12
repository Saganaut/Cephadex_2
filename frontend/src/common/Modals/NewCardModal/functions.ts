import { type CardData } from "@source/client";

import { type NewCardFormValues } from ".";

const processCardData = (values: NewCardFormValues): CardData => {
  const processedValues: CardData = { ...values };

  if (values.category.length > 0) {
    if (values.category === "Multiple choice") {
      processedValues.category = "Mcq";
    }
    if (values.category === "Fill in the blanks") {
      processedValues.category = "Cloze";
    }
  }

  return processedValues;
};

export { processCardData };
