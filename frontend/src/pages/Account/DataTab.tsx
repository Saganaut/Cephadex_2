import { type UserSchema } from "@source/client";
import React from "react";

interface DataTabProps {
  user: UserSchema;
}

const DataTab: React.FC<DataTabProps> = ({ user }) => {
  const formatDate = (date: string | null | undefined): string => {
    if (date == null) return "N/A";
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  };

  return (
    <div className="mt-4 max-w-4xl rounded-lg bg-mariana-blue px-8 py-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-blaze-orange">
        Account Information
      </h2>
      <div className="mb-4 grid gap-4 text-white sm:grid-cols-2">
        <div>Type: {user.accountType ?? "N/A"}</div>
        <div>Status: {user.accountStatus ?? "N/A"}</div>
        <div>Created: {formatDate(user.timeCreated)}</div>
        <div>Last Accessed: {formatDate(user.timeAccessed)}</div>
        {/* <div>
          Expiration: {formatDate(user.accountExpiration)} (
          {user.accountExpirationReason || "N/A"})
        </div> */}
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-blaze-orange">
        Subscription Details
      </h2>
      <div className="mb-4 grid gap-4 text-white sm:grid-cols-2">
        <div>Start Date: {formatDate(user.subscriptionStartDate)}</div>
        {/* <div>End Date: {formatDate(user.subscriptionEndDate)}</div> */}
        <div>Latest Rollover: {formatDate(user.latestRollOver)}</div>
        {/* <div>Rollover Date: {formatDate(user.rollOverDate)}</div> */}
        <div>Remaining Credit: {user.remainingCredit?.toFixed(0) ?? "N/A"}</div>

        <div>Stripe Customer ID: {user.stripeCustomerId ?? "N/A"}</div>
        <div>Used Trial: {user.usedTrial ?? false ? "Yes" : "No"}</div>
      </div>

      <h2 className="mb-4 text-2xl font-semibold text-blaze-orange">
        Usage Statistics
      </h2>
      <div className="mb-4 grid gap-4 text-white sm:grid-cols-2">
        {/* Iterate over quantities and display */}
        {Object.entries(user)
          .filter(([key]) => key.startsWith("quantity"))
          .map(([key, value]) => (
            <div key={key}>
              {key.replace("quantity", "")}: {value ?? "N/A"}
            </div>
          ))}
      </div>
    </div>
  );
};

export { DataTab };
