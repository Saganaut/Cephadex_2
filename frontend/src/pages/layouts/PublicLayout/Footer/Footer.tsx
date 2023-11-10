import cephaBanner from "@assets/cepha-banner-1.png";
import { SignUpButton } from "@common/Form/Buttons/SignUpButton";
import { useModal } from "@source/lib/contexts/ModalContext";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

const Footer = (): ReactElement => {
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
          className="text-white"
        >
          Instagram
        </Link>
      </li>
    </ul>
  );
  const newLocal1 = (
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

  const newLocal2 = (
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

  const newLocal3 = (
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

  const newLocal4 = (
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
        {newLocal4}

        <div className="bg-electric-violet">
          <div className="flex flex-row p-5">
            <div className="hidden md:block md:w-1/2">
              <img className="h-10 w-auto" src={cephaBanner} alt="" />
            </div>
            <div className="md:w-1/2">
              <div className="flex flex-row flex-wrap p-3 ">
                <div className="w-1/2 p-2 md:w-1/4">{newLocal1}</div>
                <div className="w-1/2 p-2 md:w-1/4">{newLocal2}</div>
                <div className="w-1/2 p-2 md:w-1/4">{newLocal3}</div>
                <div className="w-1/2 p-2 md:w-1/4">{newLocal}</div>
              </div>
              <div className="flex flex-row p-3">
                <div className="hidden w-full md:block  md:w-1/2">
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
          <div className="flex items-center justify-center p-3">
            <p className="text-white">© 2022 Cephadex. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Footer };
