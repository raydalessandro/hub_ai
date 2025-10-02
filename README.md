# Nodo432 AI Communication Hub

Hub di comunicazione innovativo per orchestrare conversazioni tra umani e multiple AI con ruoli specializzati.

## Features
- 🤝 Chat di gruppo (Umano + AI multiple)
- 💬 Chat private 1:1 con ogni AI
- 🤖 Conversazioni AI-AI osservabili con intervento umano
- 📄 Gestione documenti per training AI specifico
- 🎯 Contesto condiviso tra tutte le conversazioni

## Setup
```bash
npm install
npm start

nodo432-ai-hub/
├── README.md
├── package.json
├── .gitignore
├── .env.example
├── public/
│   └── index.html
└── src/
    ├── App.jsx                    # Main app component
    ├── index.jsx                  # Entry point
    ├── components/
    │   ├── Sidebar.jsx           # Navigation sidebar
    │   ├── ChatArea.jsx          # Main chat container
    │   ├── ChatHeader.jsx        # Chat header with controls
    │   ├── MessageList.jsx       # Messages display
    │   ├── Message.jsx           # Single message component
    │   ├── ChatInput.jsx         # Input field and send button
    │   └── DocumentPanel.jsx     # Document management panel
    ├── services/
    │   └── aiService.js          # AI API calls (Claude & DeepSeek)
    ├── utils/
    │   └── contextManager.js     # Context and history management
    └── styles/
        └── index.css             # Tailwind CSS
