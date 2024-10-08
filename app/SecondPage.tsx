
import React from 'react';
import { Link } from 'react-router-dom';
import Transition from '../components/Transition';

const SecondPage = () => (
  <Transition>
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Second Page</h1>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Back to First Page
      </Link>
    </div>
  </Transition>
);

export default SecondPage;
