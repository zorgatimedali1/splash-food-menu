import { useState, useEffect, type FormEvent } from 'react';
import { FiSave, FiCheck } from 'react-icons/fi';
import { useSettings, useUpdateSettings } from '../hooks/useApi';

export default function Settings() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    whatsapp_number: '',
    delivery_fee: '',
    restaurant_address: '',
    opening_hours: '',
  });

  useEffect(() => {
    if (data?.data) {
      setForm({
        whatsapp_number: data.data.whatsapp_number || '',
        delivery_fee: data.data.delivery_fee || '',
        restaurant_address: data.data.restaurant_address || '',
        opening_hours: data.data.opening_hours || '',
      });
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  if (isLoading) {
    return (
      <div className="card p-8 max-w-2xl animate-pulse space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-splash-light-gray rounded w-32 mb-2" />
            <div className="h-10 bg-splash-light-gray rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div>
          <label className="label">Numéro WhatsApp</label>
          <input
            className="input" type="tel" value={form.whatsapp_number}
            onChange={set('whatsapp_number')} placeholder="+21699744593"
          />
          <p className="text-xs text-splash-gray mt-1">Format international avec indicatif pays. Ex: +21699744593</p>
        </div>

        <div>
          <label className="label">Frais de livraison (DT)</label>
          <input
            className="input" type="number" step="0.5" min="0"
            value={form.delivery_fee} onChange={set('delivery_fee')} placeholder="2"
          />
        </div>

        <div>
          <label className="label">Adresse du restaurant</label>
          <input
            className="input" value={form.restaurant_address}
            onChange={set('restaurant_address')} placeholder="Avenue 14 Janvier, Kalaa Kebira 4060"
          />
        </div>

        <div>
          <label className="label">Horaires d'ouverture</label>
          <textarea
            className="input resize-none" rows={3}
            value={form.opening_hours} onChange={set('opening_hours')}
            placeholder="Lun-Dim: 11h - 23h"
          />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={updateSettings.isPending} className="btn-primary flex items-center gap-2 px-6 py-3">
            {saved ? (
              <><FiCheck size={15} /> Enregistré !</>
            ) : updateSettings.isPending ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enregistrement…</>
            ) : (
              <><FiSave size={15} /> Enregistrer les paramètres</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
