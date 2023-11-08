import CephadexEllipse from "@assets/CephadexEllipse.png";
import DeckIcon from "@assets/DeckIcon.svg";
import { Dropdown } from "@common/Form/Dropdown";
import ArrowSmallUpIcon from "@heroicons/react/20/solid/ArrowSmallUpIcon";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { Form, Formik } from "formik";
import React, { type ReactElement } from "react";

const sortOptions: Array<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Other" },
];
function Study(): ReactElement {
  return (
    <div className={"mt-[140px] w-full"}>
      <div
        className={
          "relative w-full rounded-[18px] bg-mariana-blue px-[32px] pb-[65px] pt-[40px]"
        }
      >
        {/* Image */}
        <img
          src={CephadexEllipse}
          className={
            "absolute left-[50%] top-[-138px] h-[174px] w-[174px] -translate-x-1/2"
          }
        />

        {/*   Heading */}
        <div className={"mb-[80px] text-center "}>
          <h1 className={"text-[24px] font-bold text-aquamarine"}>
            Do you want to study at sea with me today?
          </h1>
          <p className={"text-[18px] text-aquamarine"}>
            Come on enter the ocean of knowledge
          </p>
        </div>

        {/*     Filter / Sort */}
        <Formik
          initialValues={{
            searchField: "",
            sortField: "",
          }}
          validateOnBlur={true}
          onSubmit={(values) => {
            console.log("submit ----------------------------------");
            console.log(values);
          }}
        >
          {(formik) => (
            <Form>
              <div className={"ml-auto flex w-[60%] gap-x-[36px]"}>
                {/* Search */}
                <div className={"relative w-full"}>
                  <MagnifyingGlassIcon
                    className={
                      "absolute left-[10px] top-[50%] h-[18px] w-[18px] -translate-y-1/2 text-aquamarine"
                    }
                  />
                  <input
                    autoComplete={"off"}
                    className="w-full appearance-none rounded-[14px]  bg-tolopea py-[8px] pl-[38px]  pr-[18px] text-[14px]  leading-tight text-aquamarine shadow placeholder:text-aquamarine/30 focus:outline-none"
                    type={"text"}
                    placeholder={"Search for a deck"}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.searchField}
                    name={"searchField"}
                  />
                </div>

                {/* Sort */}
                <div className={"flex w-full gap-x-[4px]"}>
                  <div
                    className={
                      "flex h-full w-[38px] min-w-[38px] items-center justify-center rounded-full bg-tolopea"
                    }
                  >
                    <ArrowSmallUpIcon className={"w-[20px] text-aquamarine"} />
                  </div>
                  <Dropdown
                    style={"sort"}
                    options={sortOptions}
                    value={formik.values.sortField}
                    name={"sortField"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {/* Decks */}

        <div className={"w-full"}>
          <h1 className={"pb-2 font-medium text-white"}>Select deck</h1>

          <div
            className={"flex w-full items-center justify-between gap-x-[38px]"}
          >
            {/* DECK */}
            <div
              className={
                "flex w-full rounded-[10px] bg-tolopea px-[16px] py-[10px]"
              }
            >
              {/*   Icon */}
              <img src={DeckIcon} alt="icon" className={"h-[58px] w-[58px]"} />
              {/*   Info */}
              <div className={"w-full pl-[15px]"}>
                <h1
                  className={
                    "border-b-[1px] border-white text-[14px] font-bold text-white"
                  }
                >
                  Card title
                </h1>
                <p className={"pt-1 text-[11px] font-medium text-white"}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <span
                  className={
                    "mr-auto block py-1 text-right text-[9px] text-aquamarine"
                  }
                >
                  20h 10min
                </span>
              </div>

              {/*   Icon */}
              <EllipsisVerticalIcon
                className={"h-[24px] w-[24px] text-white"}
              />
            </div>
            {/* DECK */}
            <div
              className={
                "flex w-full rounded-[10px] bg-tolopea px-[16px] py-[10px]"
              }
            >
              {/*   Icon */}
              <img src={DeckIcon} alt="icon" className={"h-[58px] w-[58px]"} />
              {/*   Info */}
              <div className={"w-full pl-[15px]"}>
                <h1
                  className={
                    "border-b-[1px] border-white text-[14px] font-bold text-white"
                  }
                >
                  Card title
                </h1>
                <p className={"pt-1 text-[11px] font-medium text-white"}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <span
                  className={
                    "mr-auto block py-1 text-right text-[9px] text-aquamarine"
                  }
                >
                  20h 10min
                </span>
              </div>

              {/*   Icon */}
              <EllipsisVerticalIcon
                className={"h-[24px] w-[24px] text-white"}
              />
            </div>{" "}
            {/* DECK */}
            <div
              className={
                "flex w-full rounded-[10px] bg-tolopea px-[16px] py-[10px]"
              }
            >
              {/*   Icon */}
              <img src={DeckIcon} alt="icon" className={"h-[58px] w-[58px]"} />
              {/*   Info */}
              <div className={"w-full pl-[15px]"}>
                <h1
                  className={
                    "border-b-[1px] border-white text-[14px] font-bold text-white"
                  }
                >
                  Card title
                </h1>
                <p className={"pt-1 text-[11px] font-medium text-white"}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </p>
                <span
                  className={
                    "mr-auto block py-1 text-right text-[9px] text-aquamarine"
                  }
                >
                  20h 10min
                </span>
              </div>

              {/*   Icon */}
              <EllipsisVerticalIcon
                className={"h-[24px] w-[24px] text-white"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Study;
