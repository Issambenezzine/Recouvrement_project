import React, { useState } from 'react';

const actionOptions = {
  "Internet": ["Email de rappel", "Lien de paiement", "Message WhatsApp"],
  "Cadrage": ["Envoi échéancier", "Demande engagement", "Préparation contentieux"],
  "Appel Téléphonique": ["Appel tél 1", "Relance appel", "Appel final"],
  "Terrain": ["Visite domicile", "Remise en main propre", "Constat sur place"]
};

const PopupAction = ({ onClose, onSave, dossier }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    familleAction: '',
    action: '',
    datePrevue: '',
    dateExecution: '',
    detail: '',
    sort: '',
    actionSuivante: '',
    dateActionSuivante: '',
    statutPrecedent: 'INITIE',
    nouveauStatus: '',
    dossierId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "familleAction") {
      setFormData(prev => ({
        ...prev,
        familleAction: value,
        action: '', // reset action si famille changée
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleValidateStep1 = () => {
    if (!formData.familleAction || !formData.action || !formData.datePrevue) {
      alert("Merci de remplir tous les champs requis.");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.popup} onClick={e => e.stopPropagation()}>
        <div style={{ ...styles.header, backgroundColor: '#7d0022' }}>
          <h2 style={styles.headerTitle}>
            {step === 1 ? 'AJOUTER UNE NOUVELLE TÂCHE' : 'EXÉCUTION DE L’ACTION'}
          </h2>
        </div>

        <div style={styles.form}>
          {step === 1 ? (
            <>
              <label style={styles.label}>Famille d’action:</label>
              <select name="familleAction" value={formData.familleAction} onChange={handleChange} style={styles.smallSelect}>
                <option value="">-- Choisir --</option>
                {Object.keys(actionOptions).map(famille => (
                  <option key={famille} value={famille}>{famille}</option>
                ))}
              </select>

              <label style={styles.label}>Action:</label>
              <select
                name="action"
                value={formData.action}
                onChange={handleChange}
                style={styles.smallSelect}
                disabled={!formData.familleAction}
              >
                <option value="">-- Choisir --</option>
                {formData.familleAction &&
                  actionOptions[formData.familleAction].map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))
                }
              </select>

              <label style={styles.label}>Date prévue:</label>
              <input type="date" name="datePrevue" value={formData.datePrevue} onChange={handleChange} style={styles.smallInput} />

              <div style={styles.buttons}>
                <button onClick={onClose} style={styles.cancel}>FERMER</button>
                <button onClick={handleValidateStep1} style={styles.validate}>VALIDER</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleFinalSubmit}>
              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Action en cours:</label>
                  <input type="text" value={formData.action} readOnly style={styles.smallInput} />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date prévue:</label>
                  <input type="date" required value={formData.datePrevue} readOnly style={styles.smallInput} />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date d’exécution:</label>
                  <input type="date" required name="dateExecution" value={formData.dateExecution} onChange={handleChange} style={styles.smallInput} />
                </div>
              </div>

              <label style={styles.label}>Commentaire :</label>
              <textarea name="detail" value={formData.detail} onChange={handleChange} style={styles.textarea} />

              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Sort:</label>
                  <select name="sort" value={formData.sort} onChange={handleChange} style={styles.smallSelect}>
                    <option value="">-- Choisir --</option>
                    <option value="Appel effectué">Appel effectué</option>
                    <option value="NRP">NRP</option>
                    <option value="Faux num">Faux num</option>
                    <option value="Eteint">Eteint</option>
                  </select>
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Action suivante:</label>
                  <select
                    name="actionSuivante"
                    value={formData.actionSuivante}
                    onChange={handleChange}
                    style={styles.smallSelect}
                  >
                    <option value="">-- Choisir --</option>
                    {Object.values(actionOptions).flat().map((a, i) => (
                      <option key={i} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Date d’action suivante:</label>
                  <input type="date" required name="dateActionSuivante" value={formData.dateActionSuivante} onChange={handleChange} style={styles.smallInput} />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.column}>
                  <label style={styles.label}>Statut précédent:</label>
                  <input type="text" value={dossier?.dossier?.status || 'INITIE'} readOnly style={{ ...styles.smallInput, backgroundColor: '#eee' }} />
                </div>
                <div style={styles.column}>
                  <label style={styles.label}>Nouveau statut :</label>
                  <select name="nouveauStatus" required value={formData.nouveauStatus} onChange={handleChange} style={styles.smallSelect}>
                    <option value="">-- Choisir --</option>
                    <option value="A Rappeler">A Rappeler</option>
                    <option value="Contestation">Contestation</option>
                    <option value="EMPLOYEUR LOCALISÉ">EMPLOYEUR LOCALISÉ</option>
                    <option value="EN COURS DE TRAITEMENT">EN COURS DE TRAITEMENT</option>
                    <option value="INJOIGNABLE">INJOIGNABLE</option>
                    <option value="SOLDE">SOLDE</option>
                  </select>
                </div>
              </div>

              <div style={styles.buttons}>
                <button type="button" onClick={onClose} style={styles.cancel}>FERMER</button>
                <button type="submit" style={styles.validate}>VALIDER</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '75%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  header: {
    padding: '12px 20px'
  },
  headerTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  form: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 500
  },
  smallInput: {
    padding: '6px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%'
  },
  smallSelect: {
    padding: '6px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%'
  },
  textarea: {
    padding: '6px',
    fontSize: '13px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minHeight: '50px',
    resize: 'vertical',
    width: '100%'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px'
  },
  validate: {
    background: 'transparent',
    color: '#7d0022',
    fontWeight: 'bold',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer'
  },
  cancel: {
    background: 'transparent',
    color: '#999',
    fontWeight: 'bold',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer'
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  column: {
    flex: '1 1 200px',
    minWidth: '180px'
  }
};

export default PopupAction;
