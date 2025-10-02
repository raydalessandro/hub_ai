import React from 'react';
import { FileText, X, Upload } from 'lucide-react';

const DocumentPanel = ({ documents, setDocuments, aiAgents, setShowDocuments }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocuments(prev => [...prev, {
          id: Date.now(),
          name: file.name,
          content: event.target.result.substring(0, 500) + '...',
          assignedTo: 'all',
          uploadDate: new Date().toLocaleDateString()
        }]);
      };
      reader.readAsText(file);
    }
  };

  const assignDocumentTo = (docId, aiId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, assignedTo: aiId } : doc
    ));
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Documents</h3>
        <button onClick={() => setShowDocuments(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="mb-4">
        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition">
          <Upload size={20} />
          <span className="text-sm">Upload Document</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx"
          />
        </label>
      </div>

      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="bg-gray-700 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <FileText size={16} className="mt-1 text-purple-400" />
              <div className="flex-1">
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="text-xs text-gray-400">{doc.uploadDate}</div>
              </div>
            </div>
            <div className="text-xs text-gray-300 mb-2 line-clamp-2">{doc.content}</div>
            <select
              value={doc.assignedTo}
              onChange={(e) => assignDocumentTo(doc.id, e.target.value)}
              className="w-full bg-gray-600 text-xs rounded px-2 py-1"
            >
              <option value="all">All Agents</option>
              {aiAgents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name} only</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentPanel;
