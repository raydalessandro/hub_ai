import { useState } from 'react';

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);

  const addDocument = (document) => {
    setDocuments(prev => [...prev, document]);
  };

  const assignDocument = (docId, aiId) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, assignedTo: aiId } : doc
    ));
  };

  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  return { documents, addDocument, assignDocument, removeDocument };
};
