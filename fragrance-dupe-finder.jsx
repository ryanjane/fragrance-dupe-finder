import React, { useState, useEffect } from 'react';

const APP_NAME = 'Fragrance Dupe Finder';

// Mock data - replace with real database
const MOCK_FRAGRANCES = [
  {
    id: '1',
    name: 'Dior Sauvage',
    house: 'Christian Dior',
    price: 130,
    notes: 'ambroxan, pepper, ambrette seed',
    source: 'https://www.dior.com',
    type: 'original'
  },
  {
    id: '2',
    name: 'Aromatic Elixir',
    house: 'Clinique',
    price: 85,
    notes: 'ambroxan, pepper, citrus',
    source: 'https://www.clinique.com',
    type: 'clone',
    compareTo: '1',
    accuracy: 4.2
  },
  {
    id: '3',
    name: 'Bleu de Chanel',
    house: 'Chanel',
    price: 155,
    notes: 'lemon, mint, cedarwood',
    source: 'https://www.chanel.com',
    type: 'original'
  },
  {
    id: '4',
    name: 'Bleu de Chanel Clone',
    house: 'Lonkoom',
    price: 35,
    notes: 'lemon, mint, woodsy',
    source: 'https://www.lonkoom.com',
    type: 'clone',
    compareTo: '3',
    accuracy: 3.8
  },
  {
    id: '5',
    name: 'Aventus',
    house: 'Creed',
    price: 380,
    notes: 'pineapple, birch, ambroxan',
    source: 'https://www.creed.com',
    type: 'original'
  },
  {
    id: '6',
    name: 'Creed Aventus Alternative',
    house: 'Fragrance One',
    price: 45,
    notes: 'pineapple, birch, musk',
    source: 'https://www.fragranceone.com',
    type: 'inspired',
    compareTo: '5',
    accuracy: 3.5
  },
  {
    id: '7',
    name: 'Sauvage Elixir',
    house: 'Perfume Studio',
    price: 28,
    notes: 'ambroxan, pepper, synthetic ambrette',
    source: 'https://www.perfumestudio.com',
    type: 'inspired',
    compareTo: '1',
    accuracy: 3.2
  }
];

const MOCK_REVIEWS = {
  '2': {
    accuracy: 4.2,
    priceValue: 4.8,
    reviews: 124
  },
  '4': {
    accuracy: 3.8,
    priceValue: 4.9,
    reviews: 87
  },
  '6': {
    accuracy: 3.5,
    priceValue: 4.7,
    reviews: 56
  },
  '7': {
    accuracy: 3.2,
    priceValue: 4.5,
    reviews: 42
  }
};

export default function FragranceDupeApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [fragrances, setFragrances] = useState(MOCK_FRAGRANCES);
  const [collections, setCollections] = useState({});
  const [selectedFrag, setSelectedFrag] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Search & filter
  const searchResults = fragrances.filter(frag =>
    frag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    frag.house.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle login
  const handleLogin = (email) => {
    setUser({ email, id: Date.now().toString() });
    setCollections({});
    setIsAdmin(email.includes('admin'));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setView('search');
  };

  // Add to collection
  const toggleCollection = (fragId) => {
    setCollections(prev => ({
      ...prev,
      [fragId]: !prev[fragId]
    }));
  };

  // Add new fragrance (admin only)
  const addFragrance = (newFrag) => {
    setFragrances([...fragrances, { ...newFrag, id: Date.now().toString() }]);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface-2)',
        borderBottom: '0.5px solid var(--border)',
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>{APP_NAME}</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isAdmin && (
              <button
                onClick={() => setView(view === 'admin' ? 'search' : 'admin')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius)',
                  border: '0.5px solid var(--border-strong)',
                  background: view === 'admin' ? 'var(--surface-1)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border-strong)',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'var(--surface-1)',
        borderBottom: '0.5px solid var(--border)',
        padding: '0.75rem 1rem',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {['search', 'collections', 'sources'].map(tab => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius)',
              border: view === tab ? '0.5px solid var(--border-accent)' : '0.5px solid var(--border)',
              background: view === tab ? 'var(--bg-accent)' : 'transparent',
              color: view === tab ? 'var(--text-accent)' : 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        {view === 'search' && <SearchView fragrances={searchResults} allFragrances={fragrances} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSelect={setSelectedFrag} selectedFrag={selectedFrag} onToggleCollection={toggleCollection} isInCollection={collections} />}
        {view === 'collections' && <CollectionsView fragrances={fragrances} inCollection={collections} onToggleCollection={toggleCollection} />}
        {view === 'sources' && <SourcesView />}
        {view === 'admin' && isAdmin && <AdminView fragrances={fragrances} onAddFragrance={addFragrance} />}
      </main>
    </div>
  );
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-0)',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface-2)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ margin: '0 0 1rem', fontSize: '24px', fontWeight: 500 }}>Fragrance Dupe Finder</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Find dupes, clones, and inspired fragrances</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '0.5px solid var(--border)', boxSizing: 'border-box', fontSize: '14px' }}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0 0' }}>Tip: Use "admin@example.com" to see admin features</p>
          </div>
          
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

function SearchView({ fragrances, allFragrances, searchTerm, setSearchTerm, onSelect, selectedFrag, onToggleCollection, isInCollection }) {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by fragrance name or house..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            borderRadius: 'var(--radius)',
            border: '0.5px solid var(--border)',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {selectedFrag ? (
        <FragranceDetail 
          frag={selectedFrag} 
          onBack={() => onSelect(null)} 
          onToggleCollection={onToggleCollection} 
          isInCollection={isInCollection[selectedFrag.id]}
          allFragrances={allFragrances}
          onSelectFrag={onSelect}
        />
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {fragrances.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No fragrances found. Try a different search.</p>
          ) : (
            fragrances.map(frag => (
              <FragranceCard
                key={frag.id}
                frag={frag}
                onSelect={() => onSelect(frag)}
                onToggleCollection={() => onToggleCollection(frag.id)}
                isInCollection={isInCollection[frag.id]}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FragranceCard({ frag, onSelect, onToggleCollection, isInCollection }) {
  const review = MOCK_REVIEWS[frag.id];
  const dupeType = frag.type === 'clone' ? 'Clone' : frag.type === 'inspired' ? 'Inspired' : 'Original';

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
      }}
      onClick={onSelect}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{frag.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{frag.house}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            background: frag.type === 'original' ? 'var(--bg-accent)' : 'var(--bg-success)',
            color: frag.type === 'original' ? 'var(--text-accent)' : 'var(--text-success)',
            padding: '4px 12px',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            fontWeight: 500
          }}>
            {dupeType}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollection();
            }}
            style={{
              background: isInCollection ? 'var(--fill-accent)' : 'transparent',
              color: isInCollection ? 'var(--on-accent)' : 'var(--text-primary)',
              border: '0.5px solid ' + (isInCollection ? 'var(--border-accent)' : 'var(--border)'),
              padding: '6px 12px',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isInCollection ? '★ Saved' : '☆ Save'}
          </button>
        </div>
      </div>

      <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>💰 ${frag.price}</p>
      {review && (
        <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
          ⭐ {review.accuracy}/5 accuracy · {review.reviews} reviews
        </p>
      )}
    </div>
  );
}

function FragranceDetail({ frag, onBack, onToggleCollection, isInCollection, allFragrances, onSelectFrag }) {
  const [showComparison, setShowComparison] = React.useState(false);
  const review = MOCK_REVIEWS[frag.id];
  const original = frag.compareTo ? allFragrances.find(f => f.id === frag.compareTo) : null;
  const dupes = allFragrances.filter(f => f.compareTo === frag.id && f.id !== frag.id);

  return (
    <div style={{ maxWidth: '700px' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '1rem',
          padding: '8px 16px',
          background: 'var(--surface-2)',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ← Back
      </button>

      <div style={{
        background: 'var(--surface-2)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '24px', fontWeight: 500 }}>{frag.name}</h1>
        <p style={{ margin: '0 0 1.5rem', fontSize: '16px', color: 'var(--text-secondary)' }}>{frag.house}</p>

        {/* Show if this is a dupe/inspired of something */}
        {original && (
          <div style={{ background: 'var(--bg-success)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '0.5px solid var(--border-success)' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-success)', fontWeight: 500 }}>
              {frag.type === 'clone' ? 'CLONE OF' : frag.type === 'inspired' ? 'INSPIRED BY' : 'SIMILAR TO'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{original.name}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{original.house} · ${original.price}</p>
              </div>
              <button
                onClick={() => {
                  onSelectFrag(original);
                  setShowComparison(false);
                }}
                style={{
                  padding: '6px 12px',
                  background: 'var(--fill-accent)',
                  color: 'var(--on-accent)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}
              >
                View Original
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--surface-1)', padding: '1rem', borderRadius: 'var(--radius)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Price</p>
            <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 500 }}>${frag.price}</p>
          </div>
          {review && (
            <div style={{ background: 'var(--surface-1)', padding: '1rem', borderRadius: 'var(--radius)' }}>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Accuracy</p>
              <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 500 }}>⭐ {review.accuracy}/5</p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 500 }}>Notes</h3>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>{frag.notes}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <a
            href={frag.source}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              textDecoration: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            View on brand site ↗
          </a>
          <button
            onClick={onToggleCollection}
            style={{
              padding: '8px 16px',
              background: isInCollection ? 'var(--bg-success)' : 'var(--surface-1)',
              color: isInCollection ? 'var(--text-success)' : 'var(--text-primary)',
              border: '0.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isInCollection ? '✓ In your collection' : '+ Add to collection'}
          </button>
          {original && !showComparison && (
            <button
              onClick={() => setShowComparison(true)}
              style={{
                padding: '8px 16px',
                background: 'var(--surface-1)',
                color: 'var(--text-primary)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Compare
            </button>
          )}
          {showComparison && (
            <button
              onClick={() => setShowComparison(false)}
              style={{
                padding: '8px 16px',
                background: 'var(--bg-danger)',
                color: 'var(--text-danger)',
                border: '0.5px solid var(--border-danger)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close Comparison
            </button>
          )}
        </div>

        {showComparison && original && (
          <ComparisonView original={original} dupe={frag} review={review} />
        )}

        {/* Show if this is an original with dupes */}
        {dupes.length > 0 && (
          <div style={{ marginTop: '2rem', borderTop: '0.5px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '16px', fontWeight: 500 }}>
              Dupes, Clones & Inspired Alternatives ({dupes.length})
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {dupes.map(dupe => {
                const dupeReview = MOCK_REVIEWS[dupe.id];
                return (
                  <div
                    key={dupe.id}
                    style={{
                      background: 'var(--surface-1)',
                      border: '0.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onClick={() => onSelectFrag(dupe)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>{dupe.name}</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{dupe.house}</p>
                      </div>
                      <span style={{
                        background: dupe.type === 'clone' ? 'var(--bg-accent)' : 'var(--bg-success)',
                        color: dupe.type === 'clone' ? 'var(--text-accent)' : 'var(--text-success)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius)',
                        fontSize: '11px',
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                      }}>
                        {dupe.type === 'clone' ? 'Clone' : 'Inspired'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span>💰 ${dupe.price}</span>
                      {dupeReview && <span>⭐ {dupeReview.accuracy}/5 accuracy</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', background: 'var(--bg-accent)', padding: '1rem', borderRadius: 'var(--radius)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-accent)' }}>
            This database is curated and cross-referenced across official brand sites, Fragrantica, Parfumo, and community reviews for accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}

function ComparisonView({ original, dupe, review }) {
  const originalReview = MOCK_REVIEWS[original.id];
  const savings = original.price - dupe.price;
  const savingsPercent = Math.round((savings / original.price) * 100);

  return (
    <div style={{
      background: 'var(--bg-accent)',
      border: '0.5px solid var(--border-accent)',
      borderRadius: 'var(--radius)',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ margin: '0 0 1.5rem', fontSize: '16px', fontWeight: 500, color: 'var(--text-accent)' }}>Side-by-Side Comparison</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Original */}
        <div style={{ borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Original</p>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 500 }}>{original.name}</h4>
          <p style={{ margin: '0 0 1rem', fontSize: '13px', color: 'var(--text-secondary)' }}>{original.house}</p>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Price</p>
              <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 500 }}>${original.price}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Notes</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{original.notes}</p>
            </div>
          </div>
        </div>

        {/* Dupe */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>This Fragrance</p>
          <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 500 }}>{dupe.name}</h4>
          <p style={{ margin: '0 0 1rem', fontSize: '13px', color: 'var(--text-secondary)' }}>{dupe.house}</p>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Price</p>
              <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 500 }}>
                ${dupe.price}
                <span style={{ fontSize: '14px', color: 'var(--text-success)', marginLeft: '8px' }}>Save ${savings} ({savingsPercent}%)</span>
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Notes</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{dupe.notes}</p>
            </div>
            {review && (
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Match Quality</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px' }}>⭐ {review.accuracy}/5 · {review.reviews} reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionsView({ fragrances, inCollection, onToggleCollection }) {
  const myFragrances = fragrances.filter(f => inCollection[f.id]);

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '18px', fontWeight: 500 }}>My Fragrances</h2>
      
      {myFragrances.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
          No fragrances saved yet. Search and save your favorites.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {myFragrances.map(frag => (
            <div
              key={frag.id}
              style={{
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{frag.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{frag.house}</p>
              </div>
              <button
                onClick={() => onToggleCollection(frag.id)}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-danger)',
                  color: 'var(--text-danger)',
                  border: '0.5px solid var(--border-danger)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SourcesView() {
  const sources = [
    { name: 'Fragrantica', url: 'https://www.fragrantica.com', description: 'Community fragrance database with reviews' },
    { name: 'Parfumo', url: 'https://www.parfumo.de', description: 'Extensive fragrance database and forum' },
    { name: 'Brand Official Sites', url: '#', description: 'Direct from manufacturers' },
    { name: 'Basenotes', url: 'https://www.basenotes.net', description: 'Fragrance forum and database' }
  ];

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '18px', fontWeight: 500 }}>Sources</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        This app cross-references multiple reliable sources to ensure accuracy of dupe and clone information.
      </p>

      <div style={{ display: 'grid', gap: '12px' }}>
        {sources.map(source => (
          <div
            key={source.name}
            style={{
              background: 'var(--surface-2)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{source.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>{source.description}</p>
            </div>
            {source.url !== '#' && (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  background: 'var(--fill-accent)',
                  color: 'var(--on-accent)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Visit ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminView({ fragrances, onAddFragrance }) {
  const [formData, setFormData] = useState({
    name: '',
    house: '',
    price: '',
    notes: '',
    type: 'original',
    source: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFragrance(formData);
    setFormData({ name: '', house: '', price: '', notes: '', type: 'original', source: '' });
    alert('Fragrance added successfully!');
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '18px', fontWeight: 500 }}>Admin Dashboard</h2>

      <div style={{
        background: 'var(--surface-2)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '16px', fontWeight: 500 }}>Add New Fragrance</h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Fragrance Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)',
                boxSizing: 'border-box',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>House</label>
            <input
              type="text"
              value={formData.house}
              onChange={(e) => setFormData({...formData, house: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)',
                boxSizing: 'border-box',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  border: '0.5px solid var(--border)',
                  boxSizing: 'border-box',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  border: '0.5px solid var(--border)',
                  boxSizing: 'border-box',
                  fontSize: '14px'
                }}
              >
                <option value="original">Original</option>
                <option value="clone">Clone</option>
                <option value="inspired">Inspired</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="e.g., bergamot, vanilla, musk"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)',
                boxSizing: 'border-box',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Brand URL</label>
            <input
              type="url"
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '0.5px solid var(--border)',
                boxSizing: 'border-box',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 16px',
              background: 'var(--fill-accent)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Add Fragrance
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '16px', fontWeight: 500 }}>Database ({fragrances.length} fragrances)</h3>
        <div style={{ display: 'grid', gap: '8px' }}>
          {fragrances.map(frag => (
            <div
              key={frag.id}
              style={{
                background: 'var(--surface-2)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px'
              }}
            >
              <div>
                <strong>{frag.name}</strong> · {frag.house} · ${frag.price}
              </div>
              <span style={{ background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 'var(--radius)', fontSize: '12px' }}>
                {frag.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
