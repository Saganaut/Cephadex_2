import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

const Legal = (): ReactElement => {
  return (
    <div>
      <section className="body-font text-gray-600">
        <div className="container mx-auto flex flex-col items-center px-5 py-24 md:flex-row">
          <div className="mb-10 w-5/6 md:mb-0 md:w-1/2 lg:w-full lg:max-w-lg">
            <img
              className="rounded object-cover object-center"
              alt="hero"
              src="https://dummyimage.com/720x600"
            />
          </div>
          <div className="flex flex-col items-center text-center md:w-1/2 md:items-start md:pl-16 md:text-left lg:grow lg:pl-24">
            <h1 className="title-font mb-4 text-3xl font-medium text-gray-900 sm:text-4xl">
              Legal Information:
            </h1>
            <br className="hidden lg:inline-block" />
            <div className="legal-info">
              <div className="content">
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
                  <Link to="/terms">View our Terms and Conditions</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Legal };
