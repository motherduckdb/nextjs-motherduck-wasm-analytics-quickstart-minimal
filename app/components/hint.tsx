import React, { useState } from 'react';

interface HintComponentProps {
  title?: string;
  description?: string;
  codeBlock?: string;
}

const defaultHintComponentProps: HintComponentProps = {
    title: 'How to fix the error?',
    description: 'To fix the error under Customer Orders Data, run the following queries in MotherDuck, then refresh:',
    codeBlock: `
       CREATE OR REPLACE TABLE my_db.main.users (
            user_id BIGINT,
            username VARCHAR,
            email VARCHAR
        );

        INSERT INTO my_db.main.users (user_id, username, email) VALUES
        (1, 'johndoe', 'john.doe@example.com'),
        (2, 'janesmith', 'jane.smith@example.com'),
        (3, 'bobwilson', 'bob.wilson@example.com');

        CREATE OR REPLACE TABLE my_db.main.orders (
            order_id BIGINT,
            user_id BIGINT,
            total_amount DOUBLE,
            order_date TIMESTAMP WITH TIME ZONE
        );

        INSERT INTO my_db.main.orders (order_id, user_id, total_amount, order_date) VALUES
        (101, 1, 45.50, '2024-01-15'),
        (102, 2, 78.25, '2024-02-20'),
        (103, 1, 32.75, '2024-03-10'),
        (104, 3, 95.00, '2024-04-05');
    `,};

const HintComponent: React.FC<HintComponentProps> = ({ 
  title = defaultHintComponentProps.title,
  description = defaultHintComponentProps.description,
  codeBlock = defaultHintComponentProps.codeBlock, 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-3/4 rounded-md p-5 mb-4">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold mr-3">{title}</h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {isExpanded ? 'Hide Hint' : 'Show Hint'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4">
          <p className="mb-4">{description}</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{codeBlock}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default HintComponent;