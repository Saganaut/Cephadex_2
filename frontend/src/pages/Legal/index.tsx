import CreatorsImg from "@assets/landingPage/CreatorsImg.png";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

export default function Legal(): ReactElement {
  return (
    <div>
      <section className=" text-gray-600 dark:text-white">
        <div className="container mx-auto flex flex-col items-center px-5 py-24 md:flex-row">
          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
            <img
              className="w-full h-full rounded object-cover object-center"
              alt="Cephadex illustration"
              src={CreatorsImg}
            />
          </div>
          <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:grow lg:pl-24">
            <h1 className=" mb-4 text-3xl font-medium text-gray-900 dark:text-white sm:text-4xl">
              Legal Information:
            </h1>
            <br className="hidden lg:inline-block" />
            <div className="">
              <div className="">
                <p className="my-5">
                  <strong>Cephadex Limited</strong>
                </p>
                <p className="my-2">Company Number: 739475</p>
                <p className="my-2">Tax registration: 4144165CH</p>
                <address className="my-2">
                  Registered Office:
                  <br />
                  UNIT 4, First Floor,
                  <br />
                  84 Strand Street,
                  <br />
                  Skerries, Dublin,
                  <br />
                  Ireland
                </address>
                <p className="my-2">Director: Kevin McCarthy</p>

                <p>
                  View our{" "}
                  <Link className="cursor-pointer underline" to="/terms">
                    Terms and Conditions
                  </Link>
                </p>

                <p className="mt-2">
                  For all enquiries contact{" "}
                  <Link
                    className="cursor-pointer underline"
                    to="support@cephadex.com"
                  >
                    support@cephadex.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
