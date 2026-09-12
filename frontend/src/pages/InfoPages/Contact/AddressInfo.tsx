import React, { type ReactElement } from "react";

const AddressInfo = (): ReactElement => {
  return (
    <div className="flex justify-center items-center">
      {/* <iframe
        width="100%"
        height="100%"
        className="absolute inset-0"
        frameBorder={0}
        title="map"
        marginHeight={0}
        marginWidth={0}
        scrolling="no"
        src="https://maps.google.com/maps?width=100%&height=600&hl=en&q=%C4%B0zmir+(My%20Business%20Name)&ie=UTF8&t=&z=14&iwloc=B&output=embed"
        style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
      /> */}
      <div className="relative flex flex-wrap rounded bg-white py-6 shadow-md">
        <div className="px-6 lg:w-1/2">
          <h2 className=" text-xs font-semibold tracking-widest text-gray-900">
            Registered Office
          </h2>
          <p className="mt-1">
            Cephadex Limited, UNIT 4 First Floor 84 Strand Street Skerries,
            Dublin Ireland
          </p>
        </div>
        <div className="mt-4 px-6 lg:mt-0 lg:w-1/2">
          <h2 className=" text-xs font-semibold tracking-widest text-gray-900">
            EMAIL
          </h2>
          <a className="leading-relaxed text-indigo-500">
            cephadex@cephadex.com
          </a>
        </div>
      </div>
    </div>
  );
};
export { AddressInfo };
