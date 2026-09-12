import SubjectIcon from "@assets/SubjectIcon.svg?react";
import CardsIcon from "@assets/tagIcons/CardsIcon.svg?react";
import DocsIcon from "@assets/tagIcons/DocsIcon.svg?react";
import QuizzesIcon from "@assets/tagIcons/QuizzesIcon.svg?react";
import TopicIcon from "@assets/TopicIcon.svg?react";
import { Tooltip } from "@source/common/Form/Tooltip";
import React, { type FunctionComponent, type SVGProps } from "react";

interface DetailsProps {
  description?: string | null;
  hideCategories?: boolean;
  info?: {
    topic: string;
    subject: string;
    cardsQuantity: number;
    filesQuantity: number;
    quizzesQuantity: number;
  };
}
const Details: React.FC<DetailsProps> = ({
  description,
  info,
  hideCategories,
}) => {
  return (
    <>
      {description != null && description.length > 0 && (
        <p className={"pt-2 text-sm font-medium text-aquamarine sm:text-lg"}>
          {description}
        </p>
      )}
      {/* Subject & Topic */}
      <div className={"mt-[20px] flex items-center gap-x-[24px]"}>
        {info?.subject != null && (
          <div className={"flex items-center gap-x-[16px]"}>
            <SubjectIcon className={"h-[24px] w-[24px]"} />
            <p className={"text-lg"}>{info?.subject}</p>
          </div>
        )}
        {info?.topic != null && (
          <div className={"flex items-center gap-x-[16px]"}>
            <TopicIcon className={"h-[24px] w-[24px]"} />
            <p className={"text-lg"}>{info?.topic}</p>
          </div>
        )}
      </div>
      {/*     Cards Categories */}
      {!(hideCategories ?? false) && (
        <div className="mt-[20px] flex justify-start gap-x-[10px] ">
          <Tooltip text="Cards">
            <TagWithIcon label={info?.cardsQuantity ?? 0} icon={CardsIcon} />
          </Tooltip>
          <Tooltip text="Quizzes">
            <TagWithIcon
              label={info?.quizzesQuantity ?? 0}
              icon={QuizzesIcon}
            />
          </Tooltip>
          <Tooltip text="Documents">
            <TagWithIcon label={info?.filesQuantity ?? 0} icon={DocsIcon} />
          </Tooltip>
        </div>
      )}
    </>
  );
};

export { Details };

interface TagWithIconProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: number;
}
const TagWithIcon: React.FC<TagWithIconProps> = ({ icon: Icon, label }) => {
  return (
    <>
      <div
        className={
          " flex w-[80px] items-center justify-center gap-2 rounded-[30px] bg-electric-violet-900 px-[18px] py-[4px] text-white text-center text-[14px] font-medium dark:bg-mariana-blue-100"
        }
      >
        <p>{label}</p>
        <Icon className="h-[20px] w-[20px]" />
      </div>
    </>
  );
};

export { TagWithIcon };

/* <div
  className={
    " w-[100px] items-center rounded-[30px] bg-mariana-blue-100 px-[18px] py-[4px] text-center text-[14px] font-medium"
  }
>
  {info?.cardsQuantity}
  <p>
    {" "}
    <CardsIcon className={"h-[24px] w-[24px]"} />
  </p>

  <div
    className={
      "w-[100px] whitespace-nowrap rounded-[30px] bg-mariana-blue-100 px-[18px] py-[4px] text-center text-[14px] font-medium"
    }
  >
    <QuizzesIcon className={"h-[24px] w-[24px]"} />{" "}
    <p>{info?.quizzesQuantity} </p>
  </div>
  <p
    className={
      "w-[100px] rounded-[30px] bg-mariana-blue-100 px-[18px] py-[4px] text-center text-[14px] font-medium"
    }
  >
    <DocsIcon className={"h-[24px] w-[24px]"} /> <p> {info?.filesQuantity}</p>
  </p>
</div>; */
