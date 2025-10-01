# 🌐 Hub AI

**Multi-AI Orchestration Platform with RAG, Agents, and Document Intelligence**

A modern web application that orchestrates conversations between multiple AI models (Claude, DeepSeek, Gemini) with integrated RAG capabilities via Anything-LLM, custom AI agents, and GitHub repository analysis.

---

## ✨ Features

### 🤖 Multi-AI Chat
- **Simultaneous AI Models**: Claude (Anthropic), DeepSeek, and more
- - **Orchestrated Conversations**: Choose which AI responds or let them talk to each other
  - - **Auto-Conversation Mode**: AI models debate and collaborate automatically
    - - **Streaming Responses**: Real-time response streaming for better UX
      - - **Context Awareness**: All AIs see the complete conversation history
       
        - ### 📚 Document Intelligence (RAG)
        - - **Anything-LLM Integration**: Leverages Anything-LLM API for powerful RAG
          - - **Multi-Format Support**: PDF, DOCX, TXT, MD, CSV, and more
            - - **Semantic Search**: Vector-based document retrieval
              - - **Context Injection**: Automatic relevant context from documents
                - - **Workspace Management**: Organize documents by project/topic
                 
                  - ### 🤖 AI Agents
                  - - **Pre-built Agents**:
                    -   - 🔍 Research Agent (web search)
                        -   - 💻 Code Assistant (GitHub integration)
                            -   - 📊 Data Analyst
                                -   - 📝 Content Writer
                                    - - **Custom Agent Builder**: Create agents with specific tools and prompts
                                      - - **Agent Orchestration**: Multi-agent collaboration on complex tasks
                                       
                                        - ### 💻 GitHub Integration
                                        - - **Repository Import**: Clone and analyze entire repositories
                                          - - **Code Understanding**: AI-powered code explanation
                                            - - **Documentation Generation**: Auto-generate docs from code
                                              - - **PR Review Assistant**: AI review of pull requests
                                               
                                                - ### 🎯 Advanced Features
                                                - - **Debate Mode**: AIs argue different perspectives
                                                  - - **Interview Mode**: Structured Q&A format
                                                    - - **Brainstorming Mode**: Creative ideation sessions
                                                      - - **Memory System**: Persistent conversation memory
                                                        - - **Export Options**: Markdown, PDF, shareable links
                                                          - - **Analytics Dashboard**: Usage stats, costs, insights
                                                           
                                                            - ---

                                                            ## 🏗️ Architecture

                                                            ```
                                                            ┌─────────────────────────────────────────────────┐
                                                            │              Frontend (React)                   │
                                                            │  Modern UI with TailwindCSS + Socket.io        │
                                                            └──────────────────┬──────────────────────────────┘
                                                                               │
                                                                               ▼
                                                            ┌─────────────────────────────────────────────────┐
                                                            │           Backend (FastAPI)                     │
                                                            │  ┌──────────────┬──────────────┬──────────────┐│
                                                            │  │ AI Services  │   Agents     │  WebSockets  ││
                                                            │  │ - Claude     │   Framework  │  Real-time   ││
                                                            │  │ - DeepSeek   │              │  Updates     ││
                                                            │  │ - Gemini     │              │              ││
                                                            │  └──────────────┴──────────────┴──────────────┘│
                                                            └───────────┬────────────────────────┬────────────┘
                                                                        │                        │
                                                                        ▼                        ▼
                                                              ┌─────────────────┐    ┌──────────────────────┐
                                                              │ Anything-LLM API│    │ External Services    │
                                                              │ - RAG System    │    │ - GitHub API         │
                                                              │ - Documents     │    │ - Web Search         │
                                                              │ - Embeddings    │    │ - Other Tools        │
                                                              └─────────────────┘    └──────────────────────┘
                                                            ```

                                                            ---

                                                            ## 🚀 Quick Start

                                                            ### Prerequisites
                                                            - Python 3.9+
                                                            - - Node.js 18+
                                                              - - Anything-LLM account with API key
                                                                - - API keys for AI providers (Anthropic, DeepSeek, etc.)
                                                                 
                                                                  - ### Installation
                                                                 
                                                                  - 1. **Clone the repository**
                                                                    2. ```bash
                                                                       git clone https://github.com/raydalessandro/hub_ai.git
                                                                       cd hub_ai
                                                                       ```

                                                                       2. **Setup Backend**
                                                                       3. ```bash
                                                                          cd backend
                                                                          python -m venv venv
                                                                          source venv/bin/activate  # On Windows: venv\Scripts\activate
                                                                          pip install -r requirements.txt
                                                                          ```

                                                                          3. **Setup Frontend**
                                                                          4. ```bash
                                                                             cd frontend
                                                                             npm install
                                                                             ```

                                                                             4. **Configure Environment Variables**
                                                                             5. ```bash
                                                                                cp .env.example .env
                                                                                # Edit .env with your API keys
                                                                                ```

                                                                                5. **Run the Application**
                                                                               
                                                                                6. **Backend:**
                                                                                7. ```bash
                                                                                   cd backend
                                                                                   uvicorn app.main:app --reload --port 8000
                                                                                   ```

                                                                                   **Frontend:**
                                                                                   ```bash
                                                                                   cd frontend
                                                                                   npm run dev
                                                                                   ```

                                                                                   Visit `http://localhost:5173`

                                                                                   ---

                                                                                   ## 🐳 Docker Deployment

                                                                                   ```bash
                                                                                   docker-compose up -d
                                                                                   ```

                                                                                   Access at `http://localhost:80`

                                                                                   ---

                                                                                   ## 📁 Project Structure

                                                                                   ```
                                                                                   hub_ai/
                                                                                   ├── backend/
                                                                                   │   ├── app/
                                                                                   │   │   ├── api/              # API routes
                                                                                   │   │   │   ├── chat.py
                                                                                   │   │   │   ├── documents.py
                                                                                   │   │   │   ├── agents.py
                                                                                   │   │   │   └── github.py
                                                                                   │   │   ├── core/             # Core functionality
                                                                                   │   │   │   ├── config.py
                                                                                   │   │   │   └── security.py
                                                                                   │   │   ├── services/         # Business logic
                                                                                   │   │   │   ├── ai/          # AI integrations
                                                                                   │   │   │   │   ├── claude.py
                                                                                   │   │   │   │   ├── deepseek.py
                                                                                   │   │   │   │   └── orchestrator.py
                                                                                   │   │   │   ├── anythingllm.py
                                                                                   │   │   │   ├── agents.py
                                                                                   │   │   │   └── github.py
                                                                                   │   │   └── main.py          # FastAPI app
                                                                                   │   ├── requirements.txt
                                                                                   │   └── Dockerfile
                                                                                   ├── frontend/
                                                                                   │   ├── src/
                                                                                   │   │   ├── components/
                                                                                   │   │   │   ├── Chat/
                                                                                   │   │   │   ├── Documents/
                                                                                   │   │   │   ├── Agents/
                                                                                   │   │   │   └── GitHub/
                                                                                   │   │   ├── pages/
                                                                                   │   │   ├── hooks/
                                                                                   │   │   ├── store/
                                                                                   │   │   └── utils/
                                                                                   │   ├── package.json
                                                                                   │   └── Dockerfile
                                                                                   ├── docker-compose.yml
                                                                                   ├── .env.example
                                                                                   └── README.md
                                                                                   ```

                                                                                   ---

                                                                                   ## 🔧 Configuration

                                                                                   ### Required API Keys

                                                                                   Add these to your `.env` file:

                                                                                   ```env
                                                                                   # AI Providers
                                                                                   ANTHROPIC_API_KEY=sk-ant-xxx
                                                                                   DEEPSEEK_API_KEY=sk-xxx
                                                                                   GEMINI_API_KEY=xxx  # Optional

                                                                                   # Anything-LLM
                                                                                   ANYTHING_LLM_API_KEY=xxx
                                                                                   ANYTHING_LLM_BASE_URL=https://api.anythingllm.com

                                                                                   # GitHub (optional, for repo integration)
                                                                                   GITHUB_TOKEN=ghp_xxx

                                                                                   # Application
                                                                                   APP_HOST=0.0.0.0
                                                                                   APP_PORT=8000
                                                                                   FRONTEND_URL=http://localhost:5173
                                                                                   ```

                                                                                   ---

                                                                                   ## 🎮 Usage Examples

                                                                                   ### Multi-AI Chat
                                                                                   ```python
                                                                                   # Start a conversation
                                                                                   "Claude, what do you think about AI safety?"
                                                                                   # Select Claude to respond

                                                                                   # Switch to DeepSeek
                                                                                   "DeepSeek, do you agree with Claude's perspective?"
                                                                                   # Select DeepSeek to respond

                                                                                   # Auto-conversation mode
                                                                                   # Let them discuss for 5 turns
                                                                                   ```

                                                                                   ### Document Q&A with RAG
                                                                                   ```python
                                                                                   # Upload documents to Anything-LLM workspace
                                                                                   # Then ask questions
                                                                                   "Based on the uploaded research papers, what are the key findings about neural networks?"
                                                                                   ```

                                                                                   ### GitHub Code Analysis
                                                                                   ```python
                                                                                   # Import repository
                                                                                   "Analyze the repository: facebook/react"

                                                                                   # Ask questions
                                                                                   "Explain the virtual DOM implementation"
                                                                                   "Find potential performance bottlenecks"
                                                                                   ```

                                                                                   ### AI Agent Usage
                                                                                   ```python
                                                                                   # Use research agent
                                                                                   "@research What are the latest trends in quantum computing?"

                                                                                   # Use code assistant
                                                                                   "@code Refactor this function to be more efficient"
                                                                                   ```

                                                                                   ---

                                                                                   ## 🎯 Roadmap

                                                                                   - [x] Multi-AI chat interface
                                                                                   - [ ] - [x] Anything-LLM integration
                                                                                   - [ ] - [x] Basic RAG functionality
                                                                                   - [ ] - [ ] AI Agents framework
                                                                                   - [ ] - [ ] GitHub integration
                                                                                   - [ ] - [ ] Auto-conversation modes
                                                                                   - [ ] - [ ] Memory system
                                                                                   - [ ] - [ ] Analytics dashboard
                                                                                   - [ ] - [ ] Mobile app
                                                                                   - [ ] - [ ] API marketplace for custom agents
                                                                                  
                                                                                   - [ ] ---
                                                                                  
                                                                                   - [ ] ## 🤝 Contributing
                                                                                  
                                                                                   - [ ] Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.
                                                                                  
                                                                                   - [ ] ---
                                                                                  
                                                                                   - [ ] ## 📄 License
                                                                                  
                                                                                   - [ ] This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
                                                                                  
                                                                                   - [ ] ---
                                                                                  
                                                                                   - [ ] ## 🙏 Acknowledgments
                                                                                  
                                                                                   - [ ] - **Anything-LLM** by Mintplex Labs for the RAG infrastructure
                                                                                   - [ ] - **Anthropic** for Claude API
                                                                                   - [ ] - **DeepSeek** for their powerful models
                                                                                   - [ ] - **OpenAI** for the API format standard
                                                                                  
                                                                                   - [ ] ---
                                                                                  
                                                                                   - [ ] ## 📧 Contact
                                                                                  
                                                                                   - [ ] - GitHub: [@raydalessandro](https://github.com/raydalessandro)
                                                                                   - [ ] - Project Link: [https://github.com/raydalessandro/hub_ai](https://github.com/raydalessandro/hub_ai)
                                                                                  
                                                                                   - [ ] ---
                                                                                  
                                                                                   - [ ] **Built with ❤️ for the AI community**
