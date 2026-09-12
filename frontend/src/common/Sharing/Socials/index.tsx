import React from "react";
import {
  FaDiscord,
  FaFacebook,
  FaReddit,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

interface SocialsProps {
  link: string;
}

interface SocialItemProps {
  icon: JSX.Element;
  onClick: () => void;
}

const SocialItem: React.FC<SocialItemProps> = ({ icon, onClick }) => {
  return (
    <div
      className="group flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-full bg-electric-violet-200 hover:bg-aquamarine-900 dark:bg-mariana-blue-100 dark:hover:bg-electric-violet"
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

const Socials: React.FC<SocialsProps> = ({ link }) => {
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    link
  )}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    link
  )}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    link
  )}`;
  const discordShare = `https://discord.com/channels/@me/${encodeURIComponent(
    link
  )}`;
  const redditShare = `https://www.reddit.com/submit?url=${encodeURIComponent(
    link
  )}`;
  const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(
    link
  )}`;

  const openShareWindow = (url: string | URL | undefined): boolean => {
    window.open(url, "shareWindow", "height=600,width=800");
    return false;
  };

  return (
    <div className="mx-auto mb-[20px] flex w-fit justify-between gap-x-[20px] rounded-full bg-electric-violet px-[12px] py-[8px] dark:bg-mariana-blue">
      <SocialItem
        icon={
          <FaFacebook className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(facebookShare)}
      />
      <SocialItem
        icon={
          <FaTwitter className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(twitterShare)}
      />
      <SocialItem
        icon={
          <FaWhatsapp className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(whatsappShare)}
      />
      <SocialItem
        icon={
          <FaDiscord className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(discordShare)}
      />
      <SocialItem
        icon={
          <FaTelegram className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(telegramShare)}
      />
      <SocialItem
        icon={
          <FaReddit className="h-[34px] w-[34px] text-tolopea group-hover:text-white" />
        }
        onClick={() => openShareWindow(redditShare)}
      />
    </div>
  );
};

export { Socials };
