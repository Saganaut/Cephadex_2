import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
    return (
        <div>
            <section className="text-gray-600 body-font">
  <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
      <img
        className="object-cover object-center rounded"
        alt="hero"
        src="https://dummyimage.com/720x600"
      />
    </div>
    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
      <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
      Legal Information:
            
        </h1>  
<br className="hidden lg:inline-block" />
<div className="legal-info">
  <div className="content">
    <p className = "my-5"><strong>Cephadex Limited</strong></p>
    <p className = "my-2">Company Number: 739475</p>
    <p className = "my-2" >Tax registration: 4144165CH</p>
    <address className = "my-2" >
      Registered Office:<br />
      UNIT 4, First Floor,<br />
      84 Strand Street,<br />
      Skerries, Dublin,<br />
      Ireland
    </address>
    <p className = "my-2">Director: Kevin McCarthy</p>
    <p>
    <Link to="/terms">View our Terms and Conditions</Link>
    </p>
  </div>
</div>

      </div>
    </div>
</section>
        </div>
    )
}

export { Legal }