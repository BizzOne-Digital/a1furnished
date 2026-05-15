import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { propertyAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = {
  available: '#10b981',
  booked: '#3b82f6',
  maintenance: '#f59e0b',
  draft: '#9ca3af'
};

const AdminProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);

    try {
      const res = await propertyAPI.getAll({
        search: debouncedSearch,
        limit: 50
      });

      setProperties(res.data.properties || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [debouncedSearch]);

  // Delete property
  const handleDelete = async (id) => {
    try {
      await propertyAPI.delete(id);

      toast.success('Property deleted');
      setDeleteModal(null);

      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  // Toggle status
  const handleToggleStatus = async (property) => {
    const newStatus =
      property.status === 'available' ? 'draft' : 'available';

    try {
      await propertyAPI.update(property._id, {
        status: newStatus
      });

      toast.success(
        `Property ${
          newStatus === 'available'
            ? 'published'
            : 'unpublished'
        }`
      );

      fetchProperties();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'Montserrat',
              fontSize: '24px',
              color: 'var(--navy)',
              marginBottom: '2px'
            }}
          >
            Properties
          </h1>

          <p
            style={{
              color: 'var(--gray)',
              fontSize: '14px'
            }}
          >
            {total} total properties
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate('/admin/properties/new')
          }
        >
          <Plus size={16} />
          Add New Property
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: 'var(--shadow)',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px'
        }}
      >
        <div
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gray)'
            }}
          />

          <input
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            style={{
              paddingLeft: '40px'
            }}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      ) : properties.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: '14px',
            padding: '60px',
            textAlign: 'center',
            boxShadow: 'var(--shadow)'
          }}
        >
          <div
            style={{
              fontSize: '50px',
              marginBottom: '16px'
            }}
          >
            🏠
          </div>

          <h3
            style={{
              fontFamily: 'Montserrat',
              marginBottom: '8px'
            }}
          >
            No properties yet
          </h3>

          <p
            style={{
              color: 'var(--gray)',
              marginBottom: '20px'
            }}
          >
            Add your first property to get started
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate('/admin/properties/new')
            }
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '14px',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--navy)'
                  }}
                >
                  {[
                    'Property',
                    'City',
                    'Type',
                    'Beds/Baths',
                    'Price/Month',
                    'Status',
                    'Views',
                    'Actions'
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        color:
                          'rgba(255,255,255,0.85)',
                        fontFamily: 'Montserrat',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {properties.map((p) => {
                  const img =
                    p.images?.find(
                      (i) => i.isPrimary
                    ) || p.images?.[0];

                  return (
                    <tr
                      key={p._id}
                      style={{
                        borderBottom:
                          '1px solid var(--border)'
                      }}
                    >
                      <td
                        style={{
                          padding: '14px 16px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <img
                            src={
                              img?.url ||
                              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100'
                            }
                            alt=""
                            style={{
                              width: '52px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              flexShrink: 0
                            }}
                          />

                          <div>
                            <div
                              style={{
                                fontFamily:
                                  'Montserrat',
                                fontWeight: 700,
                                fontSize: '13px',
                                color:
                                  'var(--navy)',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow:
                                  'ellipsis',
                                whiteSpace:
                                  'nowrap'
                              }}
                            >
                              {p.title}
                            </div>

                            {p.featured && (
                              <span
                                style={{
                                  background:
                                    '#fef3c7',
                                  color:
                                    '#92400e',
                                  fontSize: '10px',
                                  padding:
                                    '1px 6px',
                                  borderRadius:
                                    '4px',
                                  fontFamily:
                                    'Montserrat',
                                  fontWeight: 700
                                }}
                              >
                                FEATURED
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td
                        style={{
                          padding: '14px 16px',
                          fontSize: '14px',
                          color:
                            'var(--gray-dark)'
                        }}
                      >
                        {p.address?.city}
                      </td>

                      <td
                        style={{
                          padding: '14px 16px',
                          fontSize: '13px',
                          color: 'var(--gray)'
                        }}
                      >
                        {p.propertyType}
                      </td>

                      <td
                        style={{
                          padding: '14px 16px',
                          fontSize: '14px'
                        }}
                      >
                        {p.bedrooms}bd /{' '}
                        {p.bathrooms}ba
                      </td>

                      <td
                        style={{
                          padding: '14px 16px',
                          fontFamily:
                            'Montserrat',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: 'var(--navy)'
                        }}
                      >
                        $
                        {p.pricing?.perMonth?.toLocaleString()}
                      </td>

                      <td
                        style={{
                          padding: '14px 16px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background:
                                statusColor[
                                  p.status
                                ] || '#9ca3af'
                            }}
                          />

                          <span
                            style={{
                              fontSize: '13px',
                              color:
                                'var(--gray-dark)',
                              textTransform:
                                'capitalize'
                            }}
                          >
                            {p.status}
                          </span>
                        </div>
                      </td>

                      <td
                        style={{
                          padding: '14px 16px',
                          fontSize: '14px',
                          color: 'var(--gray)'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} />
                          {p.views || 0}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: '14px 16px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px'
                          }}
                        >
                          <button
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/admin/properties/edit/${p._id}`
                              )
                            }
                            className="action-btn"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            title="View"
                            onClick={() =>
                              window.open(
                                `/properties/${p.slug}`,
                                '_blank'
                              )
                            }
                            className="action-btn"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            title="Toggle"
                            onClick={() =>
                              handleToggleStatus(p)
                            }
                            className="action-btn"
                          >
                            {p.status ===
                            'available' ? (
                              <ToggleRight
                                size={14}
                              />
                            ) : (
                              <ToggleLeft
                                size={14}
                              />
                            )}
                          </button>

                          <button
                            title="Delete"
                            onClick={() =>
                              setDeleteModal(p)
                            }
                            className="action-btn delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setDeleteModal(null)
          }
        >
          <div
            className="modal"
            style={{
              maxWidth: '420px'
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <h3
                style={{
                  fontFamily: 'Montserrat',
                  color: 'var(--navy)'
                }}
              >
                Delete Property
              </h3>
            </div>

            <div className="modal-body">
              <p
                style={{
                  color: 'var(--gray-dark)',
                  lineHeight: 1.6
                }}
              >
                Are you sure you want to delete{' '}
                <strong>
                  "{deleteModal.title}"
                </strong>
                ?
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  setDeleteModal(null)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-sm"
                style={{
                  background: 'var(--red)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontFamily: 'Montserrat',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onClick={() =>
                  handleDelete(
                    deleteModal._id
                  )
                }
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;