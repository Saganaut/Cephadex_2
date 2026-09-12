// import "react-datepicker/dist/react-datepicker.css";

// import { Filter } from "@common/Form/Filter";
// import { RadioButton } from "@common/Form/RadioButton";
// import { RadioSwitchButton } from "@common/Form/RadioSwitchButton";
// import { CalendarIcon } from "@heroicons/react/24/outline";
// import { QuizDetailsModal } from "@quizzes/components/Heading/QuizDetailsModal";
// import { type QuestionSchema } from "@source/client";
// import { useAppDispatch } from "@source/lib/store/hooks";
// import { addManyQuestions } from "@source/lib/store/questions/actions";
// import React, { useState } from "react";

// const options = [
//   { value: 0, label: "none" },
//   { value: 1, label: "Category" },
// ];
// export interface QuizData {
//   quizName: string;
//   quizDescription: string;
//   quizInstructions: string;
//   quizSubject: string;
//   quizTopic: string;
//   timeLimit: number | null;
//   dueDate: Date | null;
// }
// interface HeadingProps {
//   data: QuestionSchema[];
//   setCardSearchQuery: React.Dispatch<React.SetStateAction<string>>;
//   setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
//   setSortedArray: React.Dispatch<React.SetStateAction<QuestionSchema[]>>;
//   setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>;
//   showOnlySelected: boolean;
//   setCollapseMode: React.Dispatch<React.SetStateAction<boolean>>;
//   collapseMode: boolean;
//   setJeopardy: React.Dispatch<React.SetStateAction<boolean>>;
//   jeopardy: boolean;
//   selectAll: boolean;
//   setQuizDetails: React.Dispatch<React.SetStateAction<QuizData | null>>;
//   quizDetails: QuizData | null;
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   updateQuiz: () => void;
// }

// const Heading: React.FC<HeadingProps> = ({
//   data,
//   setCardSearchQuery,
//   setSelectAll,
//   setShowOnlySelected,
//   showOnlySelected,
//   setSortedArray,
//   setCollapseMode,
//   collapseMode,
//   setJeopardy,
//   jeopardy,
//   selectAll,
//   setQuizDetails,
//   quizDetails,
//   open,
//   setOpen,
//   updateQuiz,
// }) => {
//   const dispatch = useAppDispatch();
//   const [sortValue, setSortValue] = useState<{ value: number; label: string }>(
//     options[1]
//   );

//   const handleChange = (
//     setter: React.Dispatch<React.SetStateAction<boolean>>
//   ): void => {
//     setter((prev: boolean) => !prev);
//   };

//   const handleAddingQuestions = (): void => {
//     const questions: QuestionSchema[] = data.map((card, index) => {
//       if (jeopardy && card.qType !== "Mcq")
//         return {
//           id: card.id,
//           question: card.content ?? "",
//           term: card.term,
//           content: card?.term ?? "",
//           qType: card?.qType,
//           qOrder: index,
//           formula: card.formula ?? null,
//           promptOption: null,
//           points: card.points,
//           boc2: null,
//           boc3: null,
//           boc4: null,
//         };
//       else
//         return {
//           id: card.id,
//           term: card.term,
//           question: card.term,
//           boc2: card.boc2,
//           boc3: card.boc3,
//           boc4: card.boc4,
//           content: card?.content ?? "",
//           qType: card?.qType,
//           qOrder: index,
//           formula: card.formula ?? null,
//           promptOption: null,
//           points: card.points,
//         };
//     });
//     handleChange(setSelectAll);
//     dispatch(addManyQuestions({ questions, remove: selectAll }));
//   };

//   if (data == null) return null;

//   return (
//     <div
//       className={
//         "mb-8 flex flex-wrap items-center justify-between gap-y-4 rounded-xl bg-electric-violet-200 p-4 dark:bg-mariana-blue sm:py-2 md:rounded-2xl"
//       }
//     >
//       <div
//         onClick={() => {
//           setOpen(!open);
//         }}
//         className={
//           "cursor-pointer rounded-full bg-white p-2  hover:bg-electric-violet "
//         }
//       >
//         <CalendarIcon
//           className={"h-[24px] w-[24px] text-electric-violet hover:text-white"}
//         />
//       </div>

//       <RadioButton
//         theme={"violet"}
//         isChecked={selectAll}
//         handleInputChange={() => {
//           handleAddingQuestions();
//         }}
//         label={"Select all"}
//       />
//       <RadioButton
//         theme={"violet"}
//         isChecked={showOnlySelected}
//         handleInputChange={() => {
//           handleChange(setShowOnlySelected);
//         }}
//         label={"Show Selected "}
//       />
//       <div
//         className={
//           "min-w-[220px] rounded-[14px] p-1  dark:bg-mariana-blue sm:w-[40%] "
//         }
//       >
//         <Filter
//           setFilterValue={setCardSearchQuery}
//           dataArray={data}
//           setSortedArray={setSortedArray}
//           setSortValue={setSortValue}
//           sortOptions={options}
//           sortValue={sortValue}
//           searchPlaceHolder={"Search"}
//         />
//       </div>
//       <div className={"flex items-center gap-x-[10px]"}>
//         <RadioSwitchButton
//           isChecked={collapseMode}
//           handleInputChange={() => {
//             handleChange(setCollapseMode);
//           }}
//           label={"Collapse"}
//         />
//         <RadioSwitchButton
//           isChecked={jeopardy}
//           handleInputChange={() => {
//             handleChange(setJeopardy);
//           }}
//           label={"Jeopardy"}
//         />
//       </div>

//       {/*   QuizDetailsModal */}
//       <QuizDetailsModal
//         quizDetails={quizDetails}
//         isOpen={open}
//         setIsOpen={setOpen}
//         setQuizDetails={setQuizDetails}
//         updateQuiz={updateQuiz}
//       />
//     </div>
//   );
// };

// export { Heading };
