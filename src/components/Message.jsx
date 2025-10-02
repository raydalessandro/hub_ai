import React from 'react';

const Message = ({ message }) => {
  const { sender, senderName, content, timestamp, isIntervention, color } = message;

  return (
    <div className={`flex ${sender === 'human' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-2xl ${
        sender === 'human' 
          ? isIntervention 
            ? 'bg-orange-600' 
            : 'bg-purple-600' 
          : color || 'bg-gray-700'
      } rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold">
            {sender === 'human' ? 'You' : senderName}
          </span>
          {isIntervention && (
            <span className="text-xs bg-orange-700 px-2 py-0.5 rounded">INTERVENTION</span>
          )}
          <span className="text-xs text-gray-300">{timestamp}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default Message;
