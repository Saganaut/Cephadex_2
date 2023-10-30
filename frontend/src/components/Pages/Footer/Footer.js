import React from "react";
import { Link } from "react-router-dom";
import { SignUpButton } from "components/Common/Button";

import { useModal } from "contexts/ModalContext";

const Footer = () => {
  const { openRegisterModal } = useModal();

  const newLocal = (
    <ul>
      <li>
        <h5>Social</h5>
      </li>
      <li>
        <Link
          to="https://twitter.com/Cephadex"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          Twitter
        </Link>
      </li>
      <li>
        <Link    
        to="https://www.instagram.com/CephadexSocial/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white">Instagram</Link>
      </li>
    </ul>
  );
  const newLocal_1 = (
    <ul>
      <li>
        <h5>Resources</h5>
      </li>
      <li>
        <Link to="/help" className="text-white">
          Help
        </Link>
      </li>
      <li>
        <Link to="/tutorials" className="text-white">
          Tutorials
        </Link>
      </li>
      <li>
        <a href="mailto:cephadex@cephadex.com" className="text-white">
          Contact us
        </a>
      </li>
    </ul>
  );

  const newLocal_2 = (
    <ul>
      <li>
        <h5>About us</h5>
      </li>
      <li>
        <Link to="/legal" className="text-white">
          Legal
        </Link>
      </li>
      <li>
        <Link to="/terms" className="text-white">
          Terms
        </Link>
      </li>
      <li>
        <Link to="/contact" className="text-white">
          Contact
        </Link>
      </li>
    </ul>
  );

  const newLocal_3 = (
    <ul>
      <li>
        <h5>Product</h5>
      </li>
      <li>
        <Link to="/pricing" className="text-white">
          Pricing
        </Link>
      </li>
      <li>
        <Link to="/benefits" className="text-white">
          Benefits
        </Link>
      </li>
      <li>
        <Link to="/documentation" className="text-white">
          Documentation
        </Link>
      </li>
      <li>
        <Link to="/blog" className="text-white">
          Blog
        </Link>
      </li>
    </ul>
  );

  const newLocal_4 = (
    <svg viewBox="0 0 500 75" preserveAspectRatio="none">
      <path
        d="M0.00,49.98 C120.00,120.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
        className="fill-electric-violet "
      ></path>
    </svg>
  );

  return (
    <div className="bg-mariana-blue">
      <div>
        {newLocal_4}

        <div className="bg-electric-violet">
          <div className="p-5 flex flex-row">
            <div className="hidden md:block md:w-1/2">
              <img
                className="h-10 w-auto"
                src="/assets/cepha-banner-1.png"
                alt=""
              />
            </div>
            <div className="md:w-1/2">
              <div className="flex flex-row flex-wrap p-3 ">
                <div className="w-1/2 md:w-1/4 p-2">{newLocal_1}</div>
                <div className="w-1/2 md:w-1/4 p-2">{newLocal_2}</div>
                <div className="w-1/2 md:w-1/4 p-2">{newLocal_3}</div>
                <div className="w-1/2 md:w-1/4 p-2">{newLocal}</div>
              </div>
              <div className="flex flex-row p-3">
                <div className="w-full hidden md:w-1/2  md:block">
                  <h5 className="text-white ">Start your free trial</h5>
                </div>
                <div className="w-full md:w-1/2">
                  <SignUpButton
                    onClick={() => {
                      openRegisterModal();
                    }}
                    label="Try it for FREE"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center p-3">
            <p className="text-white">© 2022 Cephadex. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Footer };
