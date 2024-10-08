// FirstPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Transition from '../components/Transition';

const FirstPage = () => (
  <Transition>
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">First Page</h1>
      <Link
        to="/second"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Second Page
      </Link>
    </div>
  </Transition>
);

export default FirstPage;
