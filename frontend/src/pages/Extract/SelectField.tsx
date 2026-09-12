import { Listbox, Transition } from "@headlessui/react";
import React, { useState } from "react";

interface SelectFieldProps {
  list: Array<{ id: string; name: string }>; // Add the type for the list prop
}

const SelectField: React.FC<SelectFieldProps> = ({ list = [] }) => {
  const [selectedOption, setSelectedOption] = useState(list[0] || {});

  return (
    <div className="rounded-md  border bg-mariana-blue">
      <Listbox value={selectedOption} onChange={setSelectedOption}>
        <Listbox.Button className=" flex w-full rounded-md">
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
