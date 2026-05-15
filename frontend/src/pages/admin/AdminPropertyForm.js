import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Plus, X, Upload, Trash2, Star } from 'lucide-react';

const AMENITY_PRESETS = [
  'WiFi', 'Air Conditioning', 'Heating', 'Fully Equipped Kitchen', 'Washer & Dryer',
  'Smart TV', 'Parking', 'Gym Access', 'Concierge', 'Elevator', 'Balcony',
  'Pet Friendly', 'Work Desk', 'Backyard', 'BBQ Grill', 'All Utilities Included',
  'Dishwasher', 'Microwave', 'Coffee Maker', 'Iron & Board', 'Baby Crib', 'Pool'
];

const AMENITY_ICONS = {
  'WiFi': 'wifi', 'Air Conditioning': 'wind', 'Heating': 'thermometer',
  'Fully Equipped Kitchen': 'utensils', 'Washer & Dryer': 'shirt', 'Smart TV': 'tv',
  'Parking': 'car', 'Gym Access': 'dumbbell', 'Concierge': 'bell',
  'Elevator': 'arrow-up', 'Balcony': 'home', 'Pet Friendly': 'heart',
  'Work Desk': 'monitor', 'Backyard': 'tree', 'BBQ Grill': 'flame',
  'All Utilities Included': 'zap'
};

const defaultForm = {
  title: '', shortDescription: '', description: '', propertyType: 'Apartment',
  status: 'available', featured: false,
  address: { street: '', city: '', province: 'Ontario', postalCode: '', country: 'Canada' },
  bedrooms: 1, bathrooms: 1, maxGuests: 2, squareFeet: '', parkingSpots: 0,
  pricing: { perMonth: '', perWeek: '', perNight: '', securityDeposit: '', cleaningFee: '' },
  minimumStay: 30, amenities: [], tags: ''
};

// ✅ FIX: Input component moved OUTSIDE AdminPropertyForm
// Pehle yeh andar tha jis se har state change pe re-render hota tha
// aur focus kho jaata tha. Bahar nikalnay se yeh masla theek ho gaya.
const Input = ({ label, path, type = 'text', placeholder, required, min, style = {}, form, setField }) => (
  <div className="form-group">
    <label className="form-label">{label}{required && ' *'}</label>
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      min={min}
      value={path.includes('.') ? form[path.split('.')[0]][path.split('.')[1]] : form[path]}
      onChange={e => setField(path, type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
      style={style}
    />
  </div>
);

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const fileInputRef = useRef();

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isEdit) {
      propertyAPI.getAll({ limit: 100 })
        .then(res => {
          const prop = res.data.properties.find(p => p._id === id);
          if (prop) {
            setForm({
              title: prop.title || '',
              shortDescription: prop.shortDescription || '',
              description: prop.description || '',
              propertyType: prop.propertyType || 'Apartment',
              status: prop.status || 'available',
              featured: prop.featured || false,
              address: prop.address || defaultForm.address,
              bedrooms: prop.bedrooms || 1,
              bathrooms: prop.bathrooms || 1,
              maxGuests: prop.maxGuests || 2,
              squareFeet: prop.squareFeet || '',
              parkingSpots: prop.parkingSpots || 0,
              pricing: prop.pricing || defaultForm.pricing,
              minimumStay: prop.minimumStay || 30,
              amenities: prop.amenities || [],
              tags: (prop.tags || []).join(', ')
            });
            setImages(prop.images || []);
          }
        })
        .catch(() => toast.error('Failed to load property'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const setField = (path, value) => {
    setForm(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      if (parts.length === 2) return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
      return prev;
    });
  };

  const addAmenity = (name) => {
    if (!name.trim()) return;
    if (form.amenities.find(a => a.name.toLowerCase() === name.toLowerCase())) return;
    setForm(prev => ({
      ...prev,
      amenities: [...prev.amenities, { name: name.trim(), icon: AMENITY_ICONS[name] || 'check' }]
    }));
    setAmenityInput('');
  };

  const removeAmenity = (name) => {
    setForm(prev => ({ ...prev, amenities: prev.amenities.filter(a => a.name !== name) }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadImages = async (propertyId) => {
    if (selectedFiles.length === 0) return;
    setUploadingImages(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append('images', f));
      await propertyAPI.uploadImages(propertyId, formData);
      toast.success(`${selectedFiles.length} images uploaded`);
      setSelectedFiles([]);
    } catch (err) {
      toast.error('Image upload failed. Make sure Cloudinary is configured.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await propertyAPI.deleteImage(id, imageId);
      setImages(prev => prev.filter(img => img._id !== imageId));
      toast.success('Image deleted');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const handleSetPrimary = async (imageId) => {
    const updated = images.map(img => ({ ...img, isPrimary: img._id === imageId }));
    setImages(updated);
    try {
      await propertyAPI.update(id, { images: updated });
      toast.success('Primary image set');
    } catch (err) {
      toast.error('Failed to set primary image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.pricing.perMonth) {
      toast.error('Please fill in title, description, and monthly price');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      let propertyId;
      if (isEdit) {
        await propertyAPI.update(id, payload);
        propertyId = id;
        toast.success('Property updated!');
      } else {
        const res = await propertyAPI.create(payload);
        propertyId = res.data.property._id;
        toast.success('Property created!');
      }
      if (selectedFiles.length > 0) {
        await handleUploadImages(propertyId);
      }
      navigate('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'images', label: `Images${images.length > 0 ? ` (${images.length})` : ''}` }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/properties')}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontFamily: 'Montserrat', fontSize: '22px', color: 'var(--navy)' }}>{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '12px', boxShadow: 'var(--shadow)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--navy)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--gray)', transition: 'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <Input label="Property Title" path="title" placeholder="e.g. Luxury 2-Bedroom Suite - Downtown Toronto" required form={form} setField={setField} />
            <Input label="Short Description" path="shortDescription" placeholder="Brief one-line description (for cards)" form={form} setField={setField} />
            <div className="form-group">
              <label className="form-label">Full Description *</label>
              <textarea className="form-control" rows={8} value={form.description}
                onChange={e => setField('description', e.target.value)}
                placeholder="Detailed property description..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select className="form-control" value={form.propertyType} onChange={e => setField('propertyType', e.target.value)}>
                  {['Apartment', 'House', 'Condo', 'Townhouse', 'Suite', 'Studio'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={e => setField('status', e.target.value)}>
                  {['available', 'booked', 'maintenance', 'draft'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Featured</label>
                <select className="form-control" value={form.featured ? 'yes' : 'no'} onChange={e => setField('featured', e.target.value === 'yes')}>
                  <option value="yes">Yes — Show on homepage</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '20px', color: 'var(--navy)' }}>Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <Input label="Street Address" path="address.street" placeholder="e.g. 20 Blue Jays Way" form={form} setField={setField} />
              <Input label="City *" path="address.city" placeholder="e.g. Toronto" required form={form} setField={setField} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <Input label="Province" path="address.province" placeholder="Ontario" form={form} setField={setField} />
              <Input label="Postal Code" path="address.postalCode" placeholder="M5V 0E1" form={form} setField={setField} />
              <Input label="Country" path="address.country" placeholder="Canada" form={form} setField={setField} />
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '20px', color: 'var(--navy)' }}>Property Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <Input label="Bedrooms *" path="bedrooms" type="number" min="0" required form={form} setField={setField} />
              <Input label="Bathrooms *" path="bathrooms" type="number" min="1" required form={form} setField={setField} />
              <Input label="Max Guests" path="maxGuests" type="number" min="1" form={form} setField={setField} />
              <Input label="Square Feet" path="squareFeet" type="number" min="0" form={form} setField={setField} />
              <Input label="Parking Spots" path="parkingSpots" type="number" min="0" form={form} setField={setField} />
              <Input label="Min Stay (days)" path="minimumStay" type="number" min="1" form={form} setField={setField} />
            </div>
            <div className="form-group" style={{ marginTop: '8px' }}>
              <label className="form-label">Tags (comma separated)</label>
              <input className="form-control" value={form.tags} onChange={e => setField('tags', e.target.value)} placeholder="e.g. downtown, luxury, city view, business travel" />
              <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>Tags help guests find your property through search</div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '8px', color: 'var(--navy)' }}>Pricing (CAD)</h3>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '24px' }}>Note: 13% HST Ontario is automatically applied on top of the base price during booking.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <Input label="Per Month (CAD) *" path="pricing.perMonth" type="number" min="0" placeholder="e.g. 3500" required form={form} setField={setField} />
              <Input label="Per Week (CAD)" path="pricing.perWeek" type="number" min="0" placeholder="e.g. 950" form={form} setField={setField} />
              <Input label="Per Night (CAD)" path="pricing.perNight" type="number" min="0" placeholder="e.g. 180" form={form} setField={setField} />
              <Input label="Security Deposit" path="pricing.securityDeposit" type="number" min="0" placeholder="e.g. 1500" form={form} setField={setField} />
              <Input label="Cleaning Fee" path="pricing.cleaningFee" type="number" min="0" placeholder="e.g. 120" form={form} setField={setField} />
            </div>
            <div style={{ marginTop: '24px', padding: '20px', background: 'var(--off-white)', borderRadius: '12px' }}>
              <h4 style={{ fontFamily: 'Montserrat', fontSize: '14px', marginBottom: '12px' }}>Pricing Preview</h4>
              {form.pricing.perMonth && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {[
                    { label: '1 Month Stay', calc: () => { const b = +form.pricing.perMonth; const t = Math.round(b * 0.13); return b + t + (+form.pricing.cleaningFee || 0); } },
                    { label: '3 Month Stay', calc: () => { const b = +form.pricing.perMonth * 3; const t = Math.round(b * 0.13); return b + t + (+form.pricing.cleaningFee || 0); } },
                    { label: '6 Month Stay', calc: () => { const b = +form.pricing.perMonth * 6; const t = Math.round(b * 0.13); return b + t + (+form.pricing.cleaningFee || 0); } }
                  ].map(item => (
                    <div key={item.label} style={{ background: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--gray)', fontSize: '12px', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '20px', color: 'var(--navy)' }}>${item.calc().toLocaleString()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--gray)' }}>incl. HST & fees</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amenities Tab */}
        {activeTab === 'amenities' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '20px', color: 'var(--navy)' }}>Amenities</h3>

            {/* Selected amenities */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', minHeight: '40px' }}>
              {form.amenities.length === 0 && <p style={{ color: 'var(--gray)', fontSize: '14px' }}>No amenities added yet</p>}
              {form.amenities.map((a, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--navy)', color: 'white', borderRadius: '999px', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 600 }}>
                  {a.name}
                  <button type="button" onClick={() => removeAmenity(a.name)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add custom amenity */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input className="form-control" value={amenityInput} onChange={e => setAmenityInput(e.target.value)}
                placeholder="Type custom amenity name..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(amenityInput); } }} />
              <button type="button" className="btn btn-primary btn-sm" onClick={() => addAmenity(amenityInput)}><Plus size={14} /> Add</button>
            </div>

            {/* Preset amenities */}
            <h4 style={{ fontFamily: 'Montserrat', fontSize: '13px', color: 'var(--gray)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Add</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {AMENITY_PRESETS.filter(a => !form.amenities.find(fa => fa.name === a)).map(a => (
                <button key={a} type="button" onClick={() => addAmenity(a)}
                  style={{ padding: '7px 14px', border: '2px solid var(--border)', borderRadius: '999px', background: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'Montserrat', fontWeight: 500, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'inherit'; }}
                >
                  + {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div style={{ background: 'white', borderRadius: '14px', padding: '28px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontFamily: 'Montserrat', fontSize: '16px', marginBottom: '8px', color: 'var(--navy)' }}>Property Images</h3>
            <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '24px' }}>
              {isEdit ? 'Upload images directly. They will be stored on Cloudinary.' : 'Save the property first, then upload images.'}
            </p>

            {/* Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.background = 'var(--off-white)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Upload size={32} style={{ color: 'var(--gray)', margin: '0 auto 12px' }} />
              <p style={{ fontFamily: 'Montserrat', fontWeight: 600, color: 'var(--navy)', marginBottom: '4px' }}>Click to upload images</p>
              <p style={{ color: 'var(--gray)', fontSize: '13px' }}>JPG, PNG, WebP up to 10MB each</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageSelect} />
            </div>

            {selectedFiles.length > 0 && (
              <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--off-white)', borderRadius: '10px' }}>
                <p style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{selectedFiles.length} file(s) selected:</p>
                {selectedFiles.map((f, i) => <div key={i} style={{ fontSize: '13px', color: 'var(--gray-dark)' }}>• {f.name}</div>)}
                {isEdit && (
                  <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}
                    onClick={() => handleUploadImages(id)} disabled={uploadingImages}>
                    <Upload size={14} /> {uploadingImages ? 'Uploading...' : 'Upload Now'}
                  </button>
                )}
                {!isEdit && <p style={{ fontSize: '12px', color: 'var(--red)', marginTop: '8px' }}>⚠ Images will upload automatically when you save the property.</p>}
              </div>
            )}

            {/* Existing images grid */}
            {images.length > 0 && (
              <>
                <h4 style={{ fontFamily: 'Montserrat', fontSize: '14px', marginBottom: '12px' }}>Current Images ({images.length})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: img.isPrimary ? '3px solid var(--navy)' : '3px solid transparent' }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      {img.isPrimary && (
                        <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'var(--navy)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'Montserrat', fontWeight: 700 }}>PRIMARY</div>
                      )}
                      <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                        {!img.isPrimary && (
                          <button type="button" onClick={() => handleSetPrimary(img._id)}
                            title="Set as primary"
                            style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Star size={12} />
                          </button>
                        )}
                        <button type="button" onClick={() => handleDeleteImage(img._id)}
                          title="Delete image"
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--red)' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div style={{ padding: '6px 8px', fontSize: '11px', color: 'var(--gray-dark)', background: 'white', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {img.caption || `Image ${i + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </form>

      {/* Sticky Save Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px' }}>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}
          style={{ boxShadow: '0 8px 30px rgba(200,16,46,0.4)', padding: '14px 28px', fontSize: '15px' }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Property'}
        </button>
      </div>
    </div>
  );
};

export default AdminPropertyForm;