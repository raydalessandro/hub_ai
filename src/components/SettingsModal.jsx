import React, { useState } from 'react';
import { X, Key, Save } from 'lucide-react';

const SettingsModal = ({ apiKeys, setApiKeys, aiAgents, updateAgent, onClose }) => {
  const [localKeys, setLocalKeys] = useState(apiKeys);

  const handleSave = () => {
    setApiKeys(localKeys);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key size={20} />
              API Keys
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Claude API Key</label>
                <input
                  type="password"
                  value={localKeys.claude}
                  onChange={(e) => setLocalKeys({ ...localKeys, claude: e.target.value })}
                  placeholder="sk-ant-..."
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get your key from: https://console.anthropic.com
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">DeepSeek API Key</label>
                <input
                  type="password"
                  value={localKeys.deepseek}
                  onChange={(e) => setLocalKeys({ ...localKeys, deepseek: e.target.value })}
                  placeholder="sk-..."
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get your key from: https://platform.deepseek.com
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
            <div className="space-y-3">
              {aiAgents.map(agent => (
                <div key={agent.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${agent.color}`}></div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-400">{agent.role}</div>
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={agent.active}
                        onChange={(e) => updateAgent(agent.id, { active: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Role Description</label>
                    <input
                      type="text"
                      value={agent.role}
                      onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
                      className="w-full bg-gray-600 text-white text-sm rounded px-2 py-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-end gap-2 sticky bottom-0 bg-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
