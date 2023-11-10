import { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import React from "react";
const SelectField = ({ list = [] }) => {
  const [selectedOption, setSelectedOption] = useState(list[0] || {});

  return (
    <div className="bg-mariana-blue  border rounded-md">
      <Listbox value={selectedOption} onChange={setSelectedOption}>
        <Listbox.Button className="flex flex-start w-full rounded-md">
          {selectedOption.name || "Select an option"}
        </Listbox.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options>
            {list.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {item.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export { SelectField };
