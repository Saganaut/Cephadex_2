import CephaLogoOne from "@assets/logos/CephaLogoOne.png";
import { Button } from "@source/common/Buttons/Button";
import { useModal } from "@source/lib/contexts/ModalContext";
import { NewsletterSignUpSection } from "@source/pages/LandingPage/LandingPageComponents/NewsLetterSignUpSection/NewsletterSignUpSection";
import React, { type ReactElement } from "react";
import { Link } from "react-router-dom";

const Footer = (): ReactElement => {
  const { openSignInModal } = useModal();

  const newLocal = (
    <ul>
      <li>
        <h5 className="text-blaze-orange">Social</h5>
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
        <h5 className="text-blaze-orange">Resources</h5>
      </li>
      <li>
        <Link to="/faq" className="text-white">
          FAQ
        </Link>
      </li>
      <li>
        <Link to="/tutorials" className="text-white">
          Tutorials
        </Link>
      </li>
    </ul>
  );

  const newLocal2 = (
    <ul>
      <li>
        <h5 className="text-blaze-orange">About us</h5>
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
        <Link to="/privacy" className="text-white">
          Privacy
        </Link>
      </li>
      <li>
        <a href="mailto:cephadex@cephadex.com" className="text-white">
          Contact us
        </a>
      </li>
      {/* <li>
        <Link to="/contact" className="text-white">
          Contact
        </Link>
      </li> */}
    </ul>
  );

  const newLocal3 = (
    <ul>
      <li>
        <h5 className="text-blaze-orange">Product</h5>
      </li>
      <li>
        <Link to="/pricing" className="text-white">
          Pricing
        </Link>
      </li>
      {/* <li>
        <Link to="/benefits" className="text-white">
          Benefits
        </Link>
      </li> */}
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

  // const newLocal4 = (
  //   <svg viewBox="0 0 500 75" preserveAspectRatio="none">
  //     <path
  //       d="M0.00,49.98 C120.00,120.00 349.20,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
  //       className="fill-electric-violet "
  //     ></path>
  //   </svg>
  // );

  return (
    <div className="relative  bottom-0 z-40 w-full bg-tolopea">
      <div>
        {/* {newLocal4} */}

        <div className="bg-tolopea ">
          <div className="flex flex-wrap p-5">
            <div className="flex-1 p-2 md:w-1/2">
              <NewsletterSignUpSection />
            </div>
            <div className="flex-1 p-2 md:w-1/2">
              <div className="flex flex-wrap p-3">
                <div className="w-1/2 p-2">{newLocal1}</div>
                <div className="w-1/2 p-2">{newLocal2}</div>
                <div className="w-1/2 p-2">{newLocal3}</div>
                <div className="w-1/2 p-2">{newLocal}</div>
              </div>
              <div className="flex flex-wrap p-3">
                <div className="w-full p-2 md:hidden">
                  <h5 className="text-white">Start your free trial</h5>
                </div>
                <div className="w-full p-2 md:w-1/2">
                  <Button
                    onClick={() => {
                      openSignInModal("register");
                    }}
                    label="Sign up today"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center p-3">
            <p className="text-white">© 2024 Cephadex. All rights reserved.</p>
          </div>
        </div>
      </div>{" "}
      <div className="xs:block absolute bottom-[60px] right-5  z-40 hidden sm:bottom-[40px] sm:left-5">
        <img src={CephaLogoOne} className="h-10" alt="Cepha Banner" />
      </div>
    </div>
  );
};

export { Footer };
