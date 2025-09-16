import React, { useState } from 'react';
import { 
  StandardButton, 
  StandardCard, 
  StandardFormField, 
  StandardBadge,
  StandardSelect,
  StandardSelectOption,
  StandardModal
} from './StandardUI';

const UIComponentDemo: React.FC = () => {
  // Form state
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    amount: '',
    option: 'option1'
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Select options
  const selectOptions: StandardSelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle max click for amount input
  const handleMaxClick = () => {
    setFormValues(prev => ({ ...prev, amount: '1000' }));
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="heading-xl text-center mb-8">UI Component Library</h1>
      <div className="divider"></div>
      
      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Buttons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="heading-sm mb-4">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              <StandardButton>Default Primary</StandardButton>
              <StandardButton variant="secondary">Secondary</StandardButton>
              <StandardButton variant="accent">Accent</StandardButton>
              <StandardButton variant="outline">Outline</StandardButton>
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-4">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <StandardButton size="sm">Small</StandardButton>
              <StandardButton>Medium</StandardButton>
              <StandardButton size="lg">Large</StandardButton>
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-4">Button States</h3>
            <div className="flex flex-wrap gap-4">
              <StandardButton disabled>Disabled</StandardButton>
              <StandardButton isLoading>Loading</StandardButton>
            </div>
          </div>
          
          <div>
            <h3 className="heading-sm mb-4">Button with Icon</h3>
            <div className="flex flex-wrap gap-4">
              <StandardButton 
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"/>
                </svg>}
              >
                With Icon
              </StandardButton>
              <StandardButton 
                variant="secondary"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>}
              >
                Secondary Icon
              </StandardButton>
            </div>
          </div>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StandardCard 
            title="Default Card" 
            subtitle="This is a basic card with title and subtitle"
          >
            <p className="text-body mb-4">
              This is the content of the default card. You can add any content here.
            </p>
            <StandardButton variant="secondary" size="sm" fullWidth>Card Action</StandardButton>
          </StandardCard>
          
          <StandardCard 
            title="Card with Hover" 
            variant="hover"
            footer={<div className="flex justify-end"><StandardButton size="sm">Footer Action</StandardButton></div>}
          >
            <p className="text-body mb-2">This card has hover effects and a footer.</p>
            <div className="bg-white/5 p-3 rounded-lg">
              <code className="text-xs text-green-300">variant="hover"</code>
            </div>
          </StandardCard>
          
          <StandardCard 
            title="Glowing Card"
            variant="glow"
            className="border-blue-500/30"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-body">This card has a blue glow effect on hover.</p>
            </div>
          </StandardCard>
        </div>
      </section>
      
      <div className="divider"></div>
      
      {/* Form Elements Section */}
      <section className="mb-12">
        <h2 className="heading-lg mb-6">Form Elements</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <StandardCard title="Form Fields">
              <form className="space-y-4">
                <StandardFormField
                  id="username"
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  required
                />
                
                <StandardFormField
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="user@example.com"
                  value={formValues.email}
                  onChange={handleInputChange}
                  helperText="We'll never share your email"
                />
                
                <StandardFormField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formValues.password}
                  onChange={handleInputChange}
                  error={formValues.password && formValues.password.length < 8 ? "Password must be at least 8 characters" : undefined}
                />
                
                <div className="flex justify-end">
                  <StandardButton type="submit">Submit Form</StandardButton>
                </div>
              </form>
            </StandardCard>
          </div>
          
          <div>
            <StandardCard title="Advanced Form Components">
              <div className="space-y-4">
                <StandardFormField
                  id="amount"
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  value={formValues.amount}
                  onChange={handleInputChange}
                  maxButton
                  onMaxClick={handleMaxClick}
                  helperText="ETH"
                />
                
                <StandardSelect
                  id="option"
                  label="Select Option"
                  options={selectOptions}
                  value={formValues.option}
                  onChange={handleSelectChange}
                />
                
                <div className="form-group">
                  <div className="form-label">Badges</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <StandardBadge>Default</StandardBadge>
                    <StandardBadge variant="green">Success</StandardBadge>
                    <StandardBadge variant="red">Error</StandardBadge>
                    <StandardBadge variant="yellow">Warning</StandardBadge>
                    <StandardBadge variant="purple">Info</StandardBadge>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="form-label">Modal Dialog</div>
                  <StandardButton 
                    variant="secondary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Modal
                  </StandardButton>
                </div>
              </div>
            </StandardCard>
          </div>
        </div>
      </section>
      
      {/* Modal Example */}
      <StandardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        footer={
          <div className="flex space-x-3">
            <StandardButton variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</StandardButton>
            <StandardButton onClick={() => setIsModalOpen(false)}>Confirm</StandardButton>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-body">
            This is an example modal dialog using our standardized components.
          </p>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-body-sm">
              Modals are great for focused interactions and confirmations.
            </p>
          </div>
        </div>
      </StandardModal>
    </div>
  );
};

export default UIComponentDemo;