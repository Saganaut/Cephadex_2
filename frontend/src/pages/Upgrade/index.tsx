/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import React, { type ReactElement } from "react";

import { StripePricingTable } from "./StripePricingTable";

const UpgradePage = (): ReactElement => {
  return (
    <div className='mt-8 p-40 dark:text-white '>
      {/* <StripePricingTable /> */}
      <h3 className='mb-10 text-center text-2xl'>
        There are currently no pricing plans available
      </h3>
      <div className='flex flex-col gap-3'>
        <p>
          Cephadex has returned to it&apos;s roots as a personal project for the
          time being, as such there are currently no plans available.
        </p>

        <p>
          Cephadex will remain online and free to use but with limits.
          Additionally some features will be disabled. If you are interested in
          this project, want more credits, or anything else - please feel free
          to{" "}
          <a
            className='underline hover:text-blaze-orange-100'
            href='mailto:zen.white3980@eagereverest.com'>
            contact me
          </a>{" "}
          directly.
        </p>
        <p></p>
      </div>
    </div>
  );
};

export default UpgradePage;
