import { UserService } from "@source/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const SubmitButton = ({
  isDisabled,
}: {
  isDisabled: boolean;
}): React.ReactElement => {
  return (
    <button
      type="submit"
      className={`
            cursor-pointer rounded-full border-2 bg-electric-violet p-2 text-white 
            transition-transform hover:bg-aquamarine hover:text-tolopea
            ${
              isDisabled
                ? "cursor-not-allowed bg-electric-violet-200 shadow-none"
                : ""
            }
        `}
    >
      Submit
    </button>
  );
};
interface NewsletterFormData {
  Email: string;
}

interface NewsLetterSignUpFormProps {
  value?: string;
}

const NewsletterSignUpForm: React.FC<NewsLetterSignUpFormProps> = ({
  value = "subscribe",
}) => {
  const [message, setMessage] = React.useState<string>("");
  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
  const { register, handleSubmit, watch } = useForm<NewsletterFormData>();

  const onSubmit = async (data: NewsletterFormData): Promise<void> => {
    if (value === "unsubscribe") {
      const response = await UserService.unsubscribe({ email: data.Email });
      if (response.message != null) {
        setMessage(response.message);
      }
      return;
    }
    const response = await UserService.subscribe({ email: data.Email });
    if (response.message != null) {
      setMessage(response.message);
    }
  };
  const emailValue = watch("Email");

  useEffect(() => {
    if (emailValue === "") {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  }, [emailValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" flex w-full max-w-[260px] items-center  justify-between overflow-hidden rounded-full border bg-white p-1 sm:max-w-none">
        <input
          type="text"
          placeholder="Email"
          className="flex max-w-[170px] p-2 outline-none focus:bg-white focus:outline-none   sm:max-w-none sm:grow"
          {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
        />

        <SubmitButton isDisabled={isDisabled} />
      </div>
      <p className="text-center text-blaze-orange">{message}</p>
    </form>
  );
};

export { NewsletterSignUpForm };
