import React from "react";

import { EditButton } from "../Buttons/IconButtons/EditButton";
import { ShareButton } from "../Buttons/IconButtons/ShareButton";
import { StudyButton } from "../Buttons/IconButtons/StudyButton";
import { Details } from "./Details";
import { SideContent } from "./SideContent";
import { Title } from "./Title";

interface PageHeaderProps {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  img?: string | null;
  type?: "withImage" | "withoutImage";
  CustomDetails?: any;
  detailsProps?: Record<string, any>;
  onEdit?: () => void;
  onShare?: () => void;
  onStudy?: () => void;
  hideCategories?: boolean;
  info?: {
    topic: string;
    subject: string;
    cardsQuantity: number;
    filesQuantity: number;
    quizzesQuantity: number;
  };
}
const PageHeader: React.FC<PageHeaderProps> = ({
  subtitle,
  title,
  description,
  img,
  CustomDetails,
  type = "withoutImage",
  info,
  onEdit,
  onShare,
  onStudy,
  hideCategories,
}) => {
  return (
    <div
      id='page-header'
      className={
        "relative mb-2 w-full bg-electric-violet-200  p-[34px] text-tolopea dark:bg-mariana-blue dark:text-white sm:mb-6 md:rounded-[18px]"
      }>
      <div className={"flex items-center justify-between"}>
        <div className='w-full lg:max-w-[80%]'>
          <div className='mb-1 flex items-center gap-3'>
            <div className='max-w-[75%]'>
              <Title title={title} />
            </div>
            {!(onEdit == null) && (
              <EditButton onClick={onEdit} style='shallows' />
            )}
            {!(onShare == null) && (
              <ShareButton onClick={onShare} style='shallows' />
            )}
            {!(onStudy == null) && (
              <StudyButton onClick={onStudy} style='shallows' />
            )}
          </div>
          <p className='text-sm sm:text-lg'>{subtitle}</p>

          {CustomDetails == null ? (
            <Details
              description={description}
              info={info}
              hideCategories={hideCategories}
            />
          ) : (
            <CustomDetails />
          )}
        </div>
        <div className={"hidden lg:block"}>
          {type === "withImage" && <SideContent img={img} />}
        </div>
      </div>
    </div>
  );
};
export { PageHeader };
