import React, { useState } from 'react';

const PopupEncaissement = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    typeReglement: '',
    montant: '',
    dateReglement: '',
    file: null,
    filePreviewUrl: null,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        file,
        filePreviewUrl: previewUrl,
      }));
      setError(''); // Clear error when image is selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.typeReglement || !form.montant || !form.dateReglement || !form.file) {
      setError("Tous les champs sont obligatoires, y compris l'image.");
      return;
    }

    onSave(form);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '1rem', overflowY: 'auto'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'row',
          padding: '1.2rem',
          color: '#222',
          boxSizing: 'border-box',
          gap: '1.2rem',
          position: 'relative'
        }}
      >
        {/* Colonne gauche */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>AJOUTER UN ENCAISSEMENT</h2>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '0.9rem' }}>
            Type de règlement
            <select
              name="typeReglement"
              value={form.typeReglement}
              onChange={handleChange}
              required
              style={{
                marginTop: '4px', padding: '8px',
                borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem'
              }}
            >
              <option value="" disabled>Choisir...</option>
              <option value="Chèque">Chèque</option>
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '0.9rem' }}>
            Mode de règlement
            <select
              name="modeReglement"
              value={form.ModeReglement}
              onChange={handleChange}
              required
              style={{
                marginTop: '6px', padding: '10px',
                borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'
              }}
            >
              <option value="" disabled>Choisir...</option>
              <option value="Chèque">Chèque</option>
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '0.9rem' }}>
            Montant
            <input
              type="number"
              step="0.01"
              name="montant"
              value={form.montant}
              onChange={handleChange}
              required
              placeholder="0.00"
              style={{
                marginTop: '6px', padding: '10px',
                borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '0.9rem' }}>
            Date règlement
            <input
              type="date"
              name="dateReglement"
              value={form.dateReglement}
              onChange={handleChange}
              required
              style={{
                marginTop: '6px', padding: '10px',
                borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem'
              }}
            />
          </label>

          {error && (
            <div style={{ color: '#c0392b', fontSize: '0.9rem', marginTop: '-1rem' }}>{error}</div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 25px',
                backgroundColor: '#ddd',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#333',
                flex: 1
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 25px',
                backgroundColor: '#800020',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                flex: 1,
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#660019'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#800020'}
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Colonne droite - upload */}
        <div
          style={{
            flex: 1,
            border: '2px dashed #ccc',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#666',
            fontWeight: '600',
            cursor: 'pointer',
            userSelect: 'none',
            position: 'relative',
            padding: '1rem',
            minHeight: '200px'
          }}
          onClick={() => document.getElementById('fileInputEncaissement').click()}
        >
          {form.filePreviewUrl ? (
            <img
              src={form.filePreviewUrl}
              alt="preview"
              style={{
                maxWidth: '100%',
                maxHeight: '250px',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
          ) : (
            <>
              <div style={{ fontSize: '1rem', marginBottom: '8px' }}>Cliquer pour charger une image</div>
              <div style={{ fontSize: '2.5rem', color: '#999' }}>+</div>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            id="fileInputEncaissement"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </form>
    </div>
  );
};

export default PopupEncaissement;
