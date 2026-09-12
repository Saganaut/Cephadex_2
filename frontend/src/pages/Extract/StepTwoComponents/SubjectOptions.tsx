// import type ExtractFormValues from "@extract/data/ExtractFormValues";
// import { RadioGroup } from "@headlessui/react";
// import { useFormikContext } from "formik";
// import React from "react";

// interface SubjectOptionsProps {
//   subject: { label: string; value: string };
// }

// const SubjectOptions: React.FC<SubjectOptionsProps> = ({ subject }) => {
//   const formik = useFormikContext<ExtractFormValues>();

//   return (
//     <RadioGroup.Option value={subject.label}>
//       {({ checked }) => (
//         <>
//           <div
//             className={`flex cursor-pointer justify-center rounded-full px-4 py-2 ${
//               checked
//                 ? "bg-tolopea text-aquamarine"
//                 : " bg-aquamarine text-black"
//             }`}
//           >
//             {subject.label}
//           </div>
//         </>
//       )}
//     </RadioGroup.Option>
//   );
// };

// export { SubjectOptions };
