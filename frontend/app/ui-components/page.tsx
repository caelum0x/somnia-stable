import React from 'react';
import UIComponentDemo from '../../src/components/UIComponentDemo';
import StandardNavbar from '../../src/components/StandardNavbar';
import StandardFooter from '../../src/components/StandardFooter';

const UIComponentsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <StandardNavbar
        userAddress={null}
        onConnect={() => {}}
      />
      <main className="flex-grow py-24">
        <UIComponentDemo />
      </main>
      <StandardFooter />
    </div>
  );
};

export default UIComponentsPage;