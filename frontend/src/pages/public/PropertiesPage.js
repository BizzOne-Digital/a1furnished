import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid, List } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import { propertyAPI } from '../../utils/api';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || ''
  });

  const fetchProperties = async (params = {}) => {
    setLoading(true);
    try {
      const res = await propertyAPI.getAll({ ...filters, ...params, page: currentPage, limit: 9 });
setProperties(res?.data?.properties || []);      setTotal(res?.data?.total || 0);
      setPages(res?.data?.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // Update URL params
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  }, [filters, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', city: '', bedrooms: '', propertyType: '', minPrice: '', maxPrice: '', sort: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const cities = ['Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham', 'Oakville', 'Burlington', 'Etobicoke'];
  const propertyTypes = ['Apartment', 'House', 'Condo', 'Townhouse', 'Suite', 'Studio'];

  return (
    <div style={{ background: 'var(--off-white)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--navy)', padding: '50px 0 30px' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: 'clamp(24px, 4vw, 38px)', marginBottom: '8px' }}>
            Available Properties
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
            {total > 0 ? `${total} furnished properties across the Greater Toronto Area` : 'Browse our furnished homes'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Search & Filter Bar */}
        <div style={{
          background: 'white', borderRadius: 'var(--radius)', padding: '20px',
          marginBottom: '28px', boxShadow: 'var(--shadow)',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          {/* Search input */}
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
            <input
              className="form-control"
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              placeholder="Search by name, city, or keyword..."
              style={{ paddingLeft: '40px', border: '2px solid var(--border)' }}
            />
          </div>

          {/* City */}
          <select
            className="form-control"
            value={filters.city}
            onChange={e => handleFilterChange('city', e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Bedrooms */}
          <select
            className="form-control"
            value={filters.bedrooms}
            onChange={e => handleFilterChange('bedrooms', e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="">Any Bedrooms</option>
            <option value="0">Studio</option>
            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>)}
          </select>

          {/* Sort */}
          <select
            className="form-control"
            value={filters.sort}
            onChange={e => handleFilterChange('sort', e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary btn-sm"
            style={{ whiteSpace: 'nowrap' }}
          >
            <SlidersHorizontal size={15} /> More Filters
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn btn-sm" style={{ color: 'var(--red)', border: '2px solid var(--red)', whiteSpace: 'nowrap' }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div style={{
            background: 'white', borderRadius: 'var(--radius)', padding: '20px',
            marginBottom: '28px', boxShadow: 'var(--shadow)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px'
          }}>
            <div>
              <label className="form-label">Property Type</label>
              <select className="form-control" value={filters.propertyType} onChange={e => handleFilterChange('propertyType', e.target.value)}>
                <option value="">Any Type</option>
                {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Min Price (CAD/month)</label>
              <input className="form-control" type="number" placeholder="e.g. 1500" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
            </div>
            <div>
              <label className="form-label">Max Price (CAD/month)</label>
              <input className="form-control" type="number" placeholder="e.g. 5000" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="loading-screen" style={{ minHeight: '400px' }}>
            <div className="spinner"></div>
            <p>Loading properties...</p>
          </div>
) : (properties || []).length === 0 ? (          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ fontFamily: 'Montserrat', marginBottom: '8px' }}>No properties found</h3>
            <p style={{ color: 'var(--gray)' }}>Try adjusting your filters</p>
            <button onClick={clearFilters} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--gray)', marginBottom: '20px', fontSize: '14px' }}>
              Showing <strong>{properties.length}</strong> of <strong>{total}</strong> properties
            </p>
            <div className="properties-grid">
{(properties || []).map(property => (                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                    style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: currentPage === page ? 'var(--navy)' : 'white',
                      color: currentPage === page ? 'white' : 'var(--navy)',
                      border: `2px solid ${currentPage === page ? 'var(--navy)' : 'var(--border)'}`,
                      fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
