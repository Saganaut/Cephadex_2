import { RadioButton } from "@source/common/Form/RadioButton";
import React, { useState } from "react";

interface AnkiDeckSelectProps {
  ankiDeck: any;
  handleInputChange: any;
}
const AnkiDeckSelect: React.FC<AnkiDeckSelectProps> = ({
  ankiDeck,
  handleInputChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChecked = (): void => {
    handleInputChange(ankiDeck);
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div className="rounded-xl bg-mariana-blue-100 p-2">
        <p>{ankiDeck}</p>
        <RadioButton
          isChecked={isChecked}
          handleInputChange={handleChecked}
          label=""
          theme="marina-blue"
        />
      </div>
    </>
  );
};

export { AnkiDeckSelect };
