import React from 'react';

interface InputFieldProps {
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder = '',
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white font-mono text-sm text-gray-900";
  
  return (
    <div>
      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className={`${baseClasses} min-h-[120px] resize-vertical`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          spellCheck={false}
          className={baseClasses}
        />
      )}
    </div>
  );
};

export default InputField;