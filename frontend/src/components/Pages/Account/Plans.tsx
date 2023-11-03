import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@source/components/Common/Form/Button";
import React, { type ReactElement } from "react";

const Plans = (): ReactElement => {
  return (
    <div className={"mt-[68px]"}>
      <h1 className={"pb-[18px] text-[24px] font-semibold text-blaze-orange"}>
        Plans
      </h1>
      <div className={"flex items-center"}>
        {/*   Current Plan */}

        <div
          className={
            "w-full max-w-[470px] rounded-[20px] bg-blaze-orange py-[32px] text-white "
          }
        >
          <div className={"px-[65px] "}>
            <h1 className={"text-[34px] font-semibold"}>Free</h1>
            <p className={"font-medium"}>
              Study for free on Cephadex our core features
            </p>
          </div>

          {/* Benefits */}
          <div className={"flex flex-col gap-y-[20px]"}>
            <div className={"flex items-center gap-[4px] px-[65px] py-[26px]"}>
              <h1 className={"text-[45px] font-semibold"}>$0.00</h1>
              <p>billed monthly</p>
            </div>

            <div className={"flex gap-x-[14px] px-[20px]  "}>
              <div
                className={
                  " flex h-[32px] w-[32px] items-center justify-center rounded-full bg-aquamarine"
                }
              >
                <CheckIcon className={"h-5 w-5 text-blaze-orange"} />
              </div>
              <p className={"max-w-[315px] text-[18px] font-normal"}>
                Turn your notes, pdfs, and ppts into quizzes to help you prepare
                for an upcoming exam.
              </p>
            </div>
            <div className={"flex gap-x-[14px] px-[20px]  "}>
              <div
                className={
                  " flex h-[32px] w-[32px] items-center justify-center rounded-full bg-aquamarine"
                }
              >
                <CheckIcon className={"h-5 w-5 text-blaze-orange"} />
              </div>
              <p className={"max-w-[315px] text-[18px] font-normal"}>
                Turn your notes, pdfs, and ppts into quizzes to help you prepare
                for an upcoming exam.
              </p>
            </div>
          </div>
        </div>

        <div className={"flex w-full flex-col items-center text-center"}>
          <h1 className={"text-[24px] font-semibold text-aquamarine"}>
            You can do more with Cephadex
          </h1>
          <p className={"max-w-[270px] pt-[10px] text-white"}>
            Use speed up your decks and quizzes and more.
          </p>
          <div className={"mt-[65px]"}>
            <Button label={"Start  a free trial"} onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};
export { Plans };
