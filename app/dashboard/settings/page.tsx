"use client";
import { useState, useEffect, useRef } from 'react';
import { Save, Building2, MapPin, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/config';
import { COUNTRIES, US_STATES } from '@/lib/address';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    site_name: '',
    company_name: '',
    company_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    invoice_footer_text: ''
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('United States');
  const countryContainerRef = useRef<HTMLDivElement>(null);

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const stateContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryContainerRef.current && !countryContainerRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (stateContainerRef.current && !stateContainerRef.current.contains(event.target as Node)) {
        setShowStateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const addressStr = data.data.company_address || '';
        const parts = addressStr.split(',').map((p: string) => p.trim());
        let address_line1 = parts[0] || '';
        let address_line2 = '';
        let city = '';
        let state = '';
        let zip = '';
        let country = parts[parts.length - 1] === 'United States' ? 'United States' : (parts.length > 1 ? parts[parts.length - 1] : 'United States');
        
        if (parts.length >= 3) {
          if (parts.length >= 4) {
            address_line2 = parts[1];
            const csz = parts[2].split(' ');
            zip = csz.pop() || '';
            state = csz.pop() || '';
            city = csz.join(' ');
          } else {
            const csz = parts[1].split(' ');
            zip = csz.pop() || '';
            state = csz.pop() || '';
            city = csz.join(' ');
          }
        }

        setSettings({
          site_name: data.data.site_name || '',
          company_name: data.data.company_name || '',
          company_phone: data.data.company_phone || '',
          address_line1,
          address_line2,
          city,
          state,
          zip,
          country,
          invoice_footer_text: data.data.invoice_footer_text || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        site_name: settings.site_name,
        company_name: settings.company_name,
        company_phone: settings.company_phone,
        company_address: [
          settings.address_line1,
          settings.address_line2,
          [settings.city, settings.state, settings.zip].filter(Boolean).join(' '),
          settings.country
        ].filter(Boolean).join(', '),
        invoice_footer_text: settings.invoice_footer_text
      };

      const response = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">System Settings</h1>
        <p className="text-slate-500 font-medium">Configure your company information for invoices and checklists.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm uppercase tracking-wide">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <Building2 className="w-3.5 h-3.5" />
                Company Name
              </label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <Building2 className="w-3.5 h-3.5" />
                Website Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                placeholder="Enter site name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <Phone className="w-3.5 h-3.5" />
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.company_phone}
                onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <MapPin className="w-3.5 h-3.5" />
                Company Address
              </label>
              <div className="space-y-3">
                <input
                  required
                  placeholder="Street Address"
                  value={settings.address_line1}
                  onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                />
                <input
                  placeholder="Apartment, suite, etc. (optional)"
                  value={settings.address_line2}
                  onChange={(e) => setSettings({ ...settings, address_line2: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="City"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                  />
                  {settings.country === 'United States' ? (
                    <div ref={stateContainerRef} className="relative w-full">
                      <input
                        required
                        placeholder="State"
                        value={settings.state}
                        onFocus={() => {
                          setShowStateDropdown(true);
                          setStateSearch(settings.state);
                        }}
                        onChange={(e) => {
                          setSettings({ ...settings, state: e.target.value });
                          setStateSearch(e.target.value);
                          setShowStateDropdown(true);
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                      />
                      {showStateDropdown && (
                        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                          {US_STATES.filter((st) =>
                            st.toLowerCase().includes(stateSearch.toLowerCase())
                          ).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setSettings({ ...settings, state: st });
                                setShowStateDropdown(false);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              {st}
                            </button>
                          ))}
                          {US_STATES.filter((st) =>
                            st.toLowerCase().includes(stateSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-2.5 text-sm text-slate-400">
                              No state found.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      required
                      placeholder="State / Province"
                      value={settings.state}
                      onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                    />
                  )}
                  <input
                    required
                    placeholder="ZIP Code"
                    value={settings.zip}
                    onChange={(e) => setSettings({ ...settings, zip: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                  />
                  <div ref={countryContainerRef} className="relative w-full">
                    <input
                      required
                      placeholder="Country"
                      value={settings.country}
                      onFocus={() => {
                        setShowCountryDropdown(true);
                        setCountrySearch(settings.country);
                      }}
                      onChange={(e) => {
                        setSettings({ ...settings, country: e.target.value });
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold"
                    />
                    {showCountryDropdown && (
                      <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                        {COUNTRIES.filter((country) =>
                          country.toLowerCase().includes(countrySearch.toLowerCase())
                        ).map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => {
                              setSettings({ ...settings, country: country });
                              setShowCountryDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                          >
                            {country}
                          </button>
                        ))}
                        {COUNTRIES.filter((country) =>
                          country.toLowerCase().includes(countrySearch.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-2.5 text-sm text-slate-400">
                            No country found. Type to use custom value.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Invoice Footer Text
              </label>
              <textarea
                value={settings.invoice_footer_text}
                onChange={(e) => setSettings({ ...settings, invoice_footer_text: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-slate-900 font-semibold min-h-[100px]"
                placeholder="Enter legal or footer text to appear on invoices"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
        <div className="bg-amber-100 rounded-full p-2 h-fit">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-amber-900 font-black text-sm uppercase tracking-tight mb-1">Important Note</h4>
          <p className="text-amber-700 text-sm font-medium leading-relaxed">
            These details are used globally for all generated PDFs (Invoices and Checklists). Changes made here will apply to all future documents generated by staff in the mobile app.
          </p>
        </div>
      </div>
    </div>
  );
}
