import React from 'react';

interface StandardFormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  maxButton?: boolean;
  onMaxClick?: () => void;
}

export const StandardFormField: React.FC<StandardFormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  maxButton = false,
  onMaxClick
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label flex items-center justify-between">
        <span>{label}{required && <span className="text-red-400 ml-1">*</span>}</span>
        {helperText && <span className="text-sm text-gray-400">{helperText}</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`form-input ${error ? 'border-red-500' : ''}`}
        />
        
        {maxButton && onMaxClick && (
          <button 
            type="button"
            onClick={onMaxClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-1 rounded transition-colors"
          >
            MAX
          </button>
        )}
      </div>
      
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

interface StandardButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const StandardButton: React.FC<StandardButtonProps> = ({
  type = "button",
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  className = "",
  fullWidth = false
}) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = size === "md" ? "" : `btn-${size}`;
  const iconClass = icon ? "btn-icon" : "";
  const loadingClass = isLoading ? "btn-loading" : "";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${iconClass} ${loadingClass} ${widthClass} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="spinner spinner-sm"></div>
          <span>{children}</span>
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

interface StandardCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "hover" | "glow" | "glow-purple" | "glow-green";
  className?: string;
}

export const StandardCard: React.FC<StandardCardProps> = ({
  title,
  subtitle,
  children,
  footer,
  variant = "default",
  className = ""
}) => {
  const baseClass = "card";
  const variantClass = variant === "default" ? "" : `card-${variant}`;
  
  return (
    <div className={`${baseClass} ${variantClass} ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="heading-md text-white">{title}</h3>}
          {subtitle && <p className="text-body-sm mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

interface StandardBadgeProps {
  variant?: "blue" | "green" | "red" | "yellow" | "purple";
  children: React.ReactNode;
  className?: string;
}

export const StandardBadge: React.FC<StandardBadgeProps> = ({
  variant = "blue",
  children,
  className = ""
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
};

export interface StandardSelectOption {
  value: string;
  label: string;
}

interface StandardSelectProps {
  id: string;
  label: string;
  options: StandardSelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const StandardSelect: React.FC<StandardSelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label flex items-center justify-between">
        <span>{label}{required && <span className="text-red-400 ml-1">*</span>}</span>
        {helperText && <span className="text-sm text-gray-400">{helperText}</span>}
      </label>
      
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'border-red-500' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer
}) => {
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="modal-overlay animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="modal-container animate-slideUp">
        <div className="modal-header">
          <h2 className="heading-md text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition-colors hover:rotate-90 transform duration-300"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  StandardFormField,
  StandardButton,
  StandardCard,
  StandardBadge,
  StandardSelect,
  StandardModal
};