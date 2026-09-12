import React from "react";

interface TermProps {
  title: string;
  terms: string[];
}

const Term: React.FC<TermProps> = ({ title, terms }) => {
  return (
    <div>
      <h3 className="pb-2 pt-4 text-center text-xl font-semibold">{title}</h3>
      <ul className="list-inside list-disc pl-4 text-left">
        {terms.map((term, index) => (
          <li key={index}>{term}</li>
        ))}
      </ul>
    </div>
  );
};

export { Term };
