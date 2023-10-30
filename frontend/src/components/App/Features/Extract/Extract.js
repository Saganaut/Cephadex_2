import React from "react";
import { ExtractForm } from "./ExtractForm";

const Extract = () => {
  return (
    <div>
      <section className="text-gray-600 body-font container px-5 py-24 mx-auto ">
        <div>
          <button>Selection & Output</button>
          <button>Customizations</button>
        </div>
        <ExtractForm />
      </section>
    </div>
  );
};

export { Extract };
