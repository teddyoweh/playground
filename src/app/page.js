'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

// Import Lucid React icons as SVG components
const LucidIcons = {
  Index: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5"/>
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  ),
  Query: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
      <path d="M11 8v6"/>
      <path d="M8 11h6"/>
    </svg>
  ),
  Log: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  Docs: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      <path d="M8 7h6"/>
      <path d="M8 11h8"/>
      <path d="M8 15h6"/>
    </svg>
  ),
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
      <polyline points="7.5 19.79 7.5 14.6 3 12"/>
      <polyline points="21 12 16.5 14.6 16.5 19.79"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
};

const API_BASE_URL = 'http://localhost:8999';

export default function Home() {
  const [activeTab, setActiveTab] = useState('index');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [requestLog, setRequestLog] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [indexForm, setIndexForm] = useState({
    remote: '',
    repository: '',
    branch: 'main',
    reload: true,
    notify: true
  });

  const [infoForm, setInfoForm] = useState({
    remote: '',
    repository: '',
    branch: 'main'
  });

  const [queryForm, setQueryForm] = useState({
    messages: [{ content: '', role: 'user', id: '1' }],
    repositories: [{ remote: '', repository: '', branch: 'main', reload: true, notify: true }],
    stream: false,
    genius: false
  });

  useEffect(() => {
    // Animate sections on load
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
    });
  }, [activeTab]);

  const addToRequestLog = (type, data, response) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      request: data,
      response,
      status: response ? 'success' : error ? 'error' : 'pending'
    };
    setRequestLog(prev => [newLog, ...prev]);
  };

  const handleIndexSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/repositories/index`, indexForm);
      setResponse(response.data);
      addToRequestLog('index', indexForm, response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to index repository');
      addToRequestLog('index', indexForm, null);
    }
    setLoading(false);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { remote, repository, branch } = infoForm;
      const response = await axios.post(`${API_BASE_URL}/repositories/info`,
        {

          path: `/${remote}/${repository}/${branch}` 
        }
      );
      setResponse(response.data);
      addToRequestLog('info', infoForm, response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to get repository info');
      addToRequestLog('info', infoForm, null);
    }
    setLoading(false);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, queryForm);
      setResponse(response.data);
      addToRequestLog('query', queryForm, response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to query repositories');
      addToRequestLog('query', queryForm, null);
    }
    setLoading(false);
  };

  const getTabLabel = (tab) => {
    switch(tab) {
      case 'index': return 'Index Repository';
      case 'info': return 'Repository Info';
      case 'query': return 'Query Repositories';
      case 'log': return 'Request Log';
      default: return '';
    }
  };

  const renderForm = () => {
    switch(activeTab) {
      case 'index':
        return (
          <form onSubmit={handleIndexSubmit}>
            <h2>Index a Repository</h2>
            <div className="input-group">
              <label>Remote</label>
              <input
                type="text"
                value={indexForm.remote}
                onChange={(e) => setIndexForm({...indexForm, remote: e.target.value})}
                placeholder="e.g., github"
                required
              />
            </div>
            <div className="input-group">
              <label>Repository</label>
              <input
                type="text"
                value={indexForm.repository}
                onChange={(e) => setIndexForm({...indexForm, repository: e.target.value})}
                placeholder="e.g., username/repo"
                required
              />
            </div>
            <div className="input-group">
              <label>Branch</label>
              <input
                type="text"
                value={indexForm.branch}
                onChange={(e) => setIndexForm({...indexForm, branch: e.target.value})}
                placeholder="e.g., main"
              />
            </div>
            <div className="input-group checkbox-group">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="reload"
                  checked={indexForm.reload}
                  onChange={(e) => setIndexForm({...indexForm, reload: e.target.checked})}
                />
                <label htmlFor="reload">Reload repository</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="notify"
                  checked={indexForm.notify}
                  onChange={(e) => setIndexForm({...indexForm, notify: e.target.checked})}
                />
                <label htmlFor="notify">Notify when complete</label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Indexing...' : 'Index Repository'}
              </button>
              <button type="button" className="button secondary" onClick={() => setIndexForm({
                remote: '',
                repository: '',
                branch: 'main',
                reload: true,
                notify: true
              })}>
                Reset
              </button>
            </div>
          </form>
        );
      
      case 'info':
        return (
          <form onSubmit={handleInfoSubmit}>
            <h2>Get Repository Info</h2>
            <div className="input-group">
              <label>Remote</label>
              <input
                type="text"
                value={infoForm.remote}
                onChange={(e) => setInfoForm({...infoForm, remote: e.target.value})}
                placeholder="e.g., github"
                required
              />
            </div>
            <div className="input-group">
              <label>Repository</label>
              <input
                type="text"
                value={infoForm.repository}
                onChange={(e) => setInfoForm({...infoForm, repository: e.target.value})}
                placeholder="e.g., username/repo"
                required
              />
            </div>
            <div className="input-group">
              <label>Branch</label>
              <input
                type="text"
                value={infoForm.branch}
                onChange={(e) => setInfoForm({...infoForm, branch: e.target.value})}
                placeholder="e.g., main"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Fetching...' : 'Get Info'}
              </button>
              <button type="button" className="button secondary" onClick={() => setInfoForm({
                remote: '',
                repository: '',
                branch: 'main'
              })}>
                Reset
              </button>
            </div>
          </form>
        );
      
      case 'query':
        return (
          <form onSubmit={handleQuerySubmit}>
            <h2>Query Repositories</h2>
            <div className="input-group">
              <label>Message Content</label>
              <textarea
                value={queryForm.messages[0].content}
                onChange={(e) => setQueryForm({
                  ...queryForm,
                  messages: [{ ...queryForm.messages[0], content: e.target.value }]
                })}
                placeholder="Enter your query..."
                required
              />
            </div>
            <div className="repository-inputs">
              <h3>Repository</h3>
              <div className="input-group">
                <label>Remote</label>
                <input
                  type="text"
                  value={queryForm.repositories[0].remote}
                  onChange={(e) => setQueryForm({
                    ...queryForm,
                    repositories: [{
                      ...queryForm.repositories[0],
                      remote: e.target.value
                    }]
                  })}
                  placeholder="e.g., github"
                  required
                />
              </div>
              <div className="input-group">
                <label>Repository</label>
                <input
                  type="text"
                  value={queryForm.repositories[0].repository}
                  onChange={(e) => setQueryForm({
                    ...queryForm,
                    repositories: [{
                      ...queryForm.repositories[0],
                      repository: e.target.value
                    }]
                  })}
                  placeholder="e.g., username/repo"
                  required
                />
              </div>
              <div className="input-group">
                <label>Branch</label>
                <input
                  type="text"
                  value={queryForm.repositories[0].branch}
                  onChange={(e) => setQueryForm({
                    ...queryForm,
                    repositories: [{
                      ...queryForm.repositories[0],
                      branch: e.target.value
                    }]
                  })}
                  placeholder="e.g., main"
                />
              </div>
            </div>
            <div className="input-group checkbox-group">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="stream"
                  checked={queryForm.stream}
                  onChange={(e) => setQueryForm({...queryForm, stream: e.target.checked})}
                />
                <label htmlFor="stream">Stream response</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="genius"
                  checked={queryForm.genius}
                  onChange={(e) => setQueryForm({...queryForm, genius: e.target.checked})}
                />
                <label htmlFor="genius">Enable genius mode</label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Querying...' : 'Send Query'}
              </button>
              <button type="button" className="button secondary" onClick={() => setQueryForm({
                messages: [{ content: '', role: 'user', id: '1' }],
                repositories: [{ remote: '', repository: '', branch: 'main', reload: true, notify: true }],
                stream: false,
                genius: false
              })}>
                Reset
              </button>
            </div>
          </form>
        );
      
      case 'log':
        return (
          <div className="request-log">
            <h2>Request Log</h2>
            {requestLog.length === 0 ? (
              <div className="empty-state">
                <p>No requests have been made yet.</p>
              </div>
            ) : (
              <div className="log-entries">
                {requestLog.map(entry => (
                  <div key={entry.id} className={`log-entry ${entry.status}`}>
                    <div className="log-header">
                      <span className="log-type">{entry.type.toUpperCase()}</span>
                      <span className="log-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="log-content">
                      <div className="log-request">
                        <h4>Request</h4>
                        <pre>{JSON.stringify(entry.request, null, 2)}</pre>
                      </div>
                      <div className="log-response">
                        <h4>Response</h4>
                        <pre>{entry.response ? JSON.stringify(entry.response, null, 2) : 'Error: ' + error}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside className={`sidebar ${showMobileMenu ? 'show' : ''}`}>
        <div className="logo">
          <LucidIcons.Logo />
          <h1>Greptile API</h1>
        </div>
        <nav className="tabs">
          <button 
            className={activeTab === 'index' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('index');
              setShowMobileMenu(false);
            }}
          >
            <LucidIcons.Index />
            Index Repository
          </button>
          <button 
            className={activeTab === 'info' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('info');
              setShowMobileMenu(false);
            }}
          >
            <LucidIcons.Info />
            Repository Info
          </button>
          <button 
            className={activeTab === 'query' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('query');
              setShowMobileMenu(false);
            }}
          >
            <LucidIcons.Query />
            Query Repositories
          </button>
          <button 
            className={activeTab === 'log' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('log');
              setShowMobileMenu(false);
            }}
          >
            <LucidIcons.Log />
            Request Log
          </button>
        </nav>
        <div className="sidebar-footer">
          <a href="https://greptile.com/docs" target="_blank" rel="noopener noreferrer" className="docs-link">
            <LucidIcons.Docs />
            Documentation
          </a>
        </div>
      </aside>

      <header className="header">
        <div className="breadcrumb">
          API Playground / <span>{getTabLabel(activeTab)}</span>
        </div>
        <div className="actions">
          <button className="button secondary" onClick={() => window.open('https://greptile.com/docs', '_blank')}>
            Documentation
          </button>
          <button className="button" onClick={() => setResponse(null)}>
            Clear Response
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="playground-container">
          <div className="section form-section">
            {renderForm()}
          </div>

          <div className="section response-section">
            <h2>Response</h2>
            {error && (
              <div className="status error">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}
            {loading && !response && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Processing request...</p>
              </div>
            )}
            {response && (
              <div className="response-container">
                <div className="response-header">
                  <span className="status success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Success
                  </span>
                  <button 
                    className="copy-button" 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </button>
                </div>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
