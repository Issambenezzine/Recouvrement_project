import React, { useState, useEffect } from 'react';
import { toast, Slide } from "react-toastify";
import axios from 'axios';

export default function PopupEncaissement({ onClose, onSave, dossier }) {
  // only for file & preview
  const [form, setForm] = useState({
    file: null,
    filePreviewUrl: null,
    fileName: null,
    fileType: null,
  });

  const HOST = import.meta.env.VITE_SERVER_HOST;
  const PORT = import.meta.env.VITE_SERVER_PORT;

    const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  // separate states
  const [typeReg, setTypeReglement] = useState("");
  const [modeReg, setModeReglement] = useState("");

  const [montant, setMontant] = useState("");
  const [dateReg, setDateReglement] = useState(getTodayDate());
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeReglementValues,setTypeReglementValues] = useState([]);
  const [modeReglementValues, setModeReglementValues] = useState([]);
  

  const fetchTypeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/typereg`);
      setTypeReglementValues(res.data.filter(item => item.visibility == 1 || []));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchModeReglement = async () => {
    try {
      const res = await axios.get(`http://${HOST}:${PORT}/parametrage/modereg`);
      setModeReglementValues(res.data.filter(item => item.visibility == 1 || []));
    } catch (err) {
      console.log(err.message);
    }
  };


  useEffect(() => {
    fetchModeReglement();
    fetchTypeReglement();
  },[])

  // Cleanup preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (form.filePreviewUrl) {
        URL.revokeObjectURL(form.filePreviewUrl);
      }
    };
  }, [form.filePreviewUrl]);

  // Helper function to get file icon based on file type
  const getFileIcon = (fileType, fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    if (fileType?.startsWith('image/')) {
      return '🖼️';
    } else if (fileType === 'application/pdf' || extension === 'pdf') {
      return '📄';
    } else if (fileType?.includes('word') || extension === 'doc' || extension === 'docx') {
      return '📝';
    } else if (fileType?.includes('excel') || extension === 'xls' || extension === 'xlsx') {
      return '📊';
    } else if (fileType?.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') {
      return '📋';
    } else if (fileType?.startsWith('text/') || extension === 'txt') {
      return '📄';
    } else if (fileType?.startsWith('video/')) {
      return '🎥';
    } else if (fileType?.startsWith('audio/')) {
      return '🎵';
    } else {
      return '📎';
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // file picker with enhanced error handling for any file type
  const handleFileChange = e => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (e.g., max 10MB for any file type)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("Le fichier est trop volumineux. Taille maximale: 10MB.");
        return;
      }

      // Clean up previous preview URL
      if (form.filePreviewUrl) {
        URL.revokeObjectURL(form.filePreviewUrl);
      }

      // Create preview URL only for images
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }

      setForm({
        file,
        filePreviewUrl: previewUrl,
        fileName: file.name,
        fileType: file.type,
      });
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Erreur lors de la sélection du fichier:", err);
      setError("Erreur lors de la sélection du fichier.");
    }
  };

  // Enhanced form validation
  const validateForm = () => {
    if (!typeReg.trim()) {
      setError("Le type de règlement est obligatoire.");
      return false;
    }

    if (!modeReg.trim()) {
      setError("Le mode de règlement est obligatoire.");
      return false;
    }

    if (!montant || isNaN(parseFloat(montant)) || parseFloat(montant) <= 0) {
      setError("Veuillez saisir un montant valide supérieur à 0.");
      return false;
    }

    if (!dateReg) {
      setError("La date de règlement est obligatoire.");
      return false;
    }

    // Validate date is not in the future
    const selectedDate = new Date(dateReg);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (selectedDate > today) {
      setError("La date de règlement ne peut pas être dans le futur.");
      return false;
    }

    if (!form.file) {
      setError("Veuillez sélectionner un fichier.");
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission

    setError(""); // Clear previous errors

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Validate required props
    if (!dossier?.dossier?.id || !dossier?.creance?.id) {
      setError("Données du dossier manquantes. Veuillez réessayer.");
      return;
    }

    // Check if userName exists in localStorage
    const userName = localStorage.getItem("userName");
    if (!userName) {
      setError("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("typeReg", typeReg.trim());
      formData.append("modeReg", modeReg.trim())
      formData.append("montant", parseFloat(montant).toString());
      formData.append("dateReg", dateReg);
      formData.append("file", form.file);
      formData.append("responsable", userName);
      formData.append("dossierId", Number(dossier.dossier.id));
      formData.append("creanceId", Number(dossier.creance.id));
      formData.append("UserId", localStorage.getItem("UserId"));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch(`http://${HOST}:${PORT}/encaissement/encaiss`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorMessage = "Erreur lors de l'envoi du fichier";
        
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = res.statusText || errorMessage;
        }

        throw new Error(`${errorMessage} (Code: ${res.status})`);
      }

      const result = await res.json();

      toast.success("Un encaissement a été ajouté !", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
        theme: "colored",
      });

      // Call onSave callback if provided
      if (typeof onSave === 'function') {
        await onSave(result);
      }

      // Close popup on success
      onClose();

    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      
      let errorMessage = "Erreur lors de l'envoi du fichier";
      
      if (err.name === 'AbortError') {
        errorMessage = "Délai d'attente dépassé. Veuillez réessayer.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show error toast for network/server errors
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000, padding: '1rem', overflowY: 'auto',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff', maxWidth: '700px', width: '100%',
        borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        display: 'flex', gap: '2rem', padding: '1.5rem',
        boxSizing: 'border-box', position: 'relative',
      }}>
        {/* Left column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '1.8rem', margin: 0 }}>
            AJOUTER UN ENCAISSEMENT
          </h2>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 600 }}>
            Type de règlement *
            <select
              value={typeReg}
              onChange={e => {
                setTypeReglement(e.target.value);
                setError(""); // Clear error on change
              }}
              required
              disabled={isSubmitting}
              style={{ 
                marginTop: 6, padding: 10, borderRadius: 4, 
                border: '1px solid #ccc',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              <option value="" disabled>Choisir...</option>
              {typeReglementValues.map((value, index) =>(
                <option key={index} value={value.typeReg}>{value.typeReg}</option>
              ))
              }
              {/* <option value="Chèque">Chèque</option>
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement</option> */}
            </select>
          </label>
           <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', fontSize: '0.9rem' }}>
            Mode de règlement
            <select
              name="modeReglement"
              value={modeReg}
              onChange={e => {
                setModeReglement(e.target.value);
                setError(""); // Clear error on change
              }}
              required
              style={{
                marginTop: 6, padding: 10, borderRadius: 4, 
                border: '1px solid #ccc',
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              <option value="" disabled>Choisir...</option>
              {modeReglementValues.map((value, index) =>(
                <option key={index} value={value.modeReg}>{value.modeReg}</option>
              ))}
              {/* <option value="Chèque">Chèque</option>
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement</option> */}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 600 }}>
            Montant *
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={montant}
              onChange={e => {
                setMontant(e.target.value);
                setError(""); // Clear error on change
              }}
              required
              disabled={isSubmitting}
              placeholder="0.00"
              style={{ 
                marginTop: 6, padding: 10, borderRadius: 4, 
                border: '1px solid #ccc',
                opacity: isSubmitting ? 0.6 : 1
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 600 }}>
            Date règlement *
            <input
              type="date"
              value={dateReg}
              onChange={e => {
                setDateReglement(e.target.value);
                setError(""); // Clear error on change
              }}
              readOnly
              required
              disabled={isSubmitting}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              style={{ 
                marginTop: 6, padding: 10, borderRadius: 4, 
                border: '1px solid #ccc',
                opacity: isSubmitting ? 0.6 : 1
              }}
            />
          </label>

          {error && (
            <div style={{ 
              color: '#c0392b', 
              fontSize: '0.9rem',
              backgroundColor: '#fdf2f2',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1, padding: '10px 25px', backgroundColor: '#ddd',
                border: 'none', borderRadius: 5, cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                fontWeight: 600, opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1, padding: '10px 25px', 
                backgroundColor: isSubmitting ? '#999' : '#800020',
                color: '#fff', border: 'none', borderRadius: 5, 
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 600, transition: 'background-color 0.3s',
              }}
              onMouseEnter={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#660019';
                }
              }}
              onMouseLeave={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#800020';
                }
              }}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Ajouter'}
            </button>
          </div>
        </div>

        {/* Right column - file upload */}
        <div
          onClick={() => !isSubmitting && document.getElementById('fileInput')?.click()}
          style={{
            flex: 1, border: '2px dashed #ccc', borderRadius: 8,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            padding: '1rem', minHeight: 250, position: 'relative',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {form.file ? (
            <div style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              textAlign: 'center', width: '100%'
            }}>
              {/* Show image preview for images, or file icon for other types */}
              {form.filePreviewUrl ? (
                <img
                  src={form.filePreviewUrl}
                  alt="preview"
                  style={{ 
                    maxWidth: '100%', maxHeight: 180, objectFit: 'contain', 
                    borderRadius: 4, marginBottom: '0.5rem'
                  }}
                />
              ) : (
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {getFileIcon(form.fileType, form.fileName)}
                </div>
              )}
              
              {/* File info */}
              <div style={{ 
                fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem',
                wordBreak: 'break-word', maxWidth: '100%'
              }}>
                {form.fileName}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {formatFileSize(form.file.size)}
              </div>
              
              {/* Change file button */}
              <div style={{ 
                fontSize: '0.8rem', color: '#800020', marginTop: '0.5rem',
                textDecoration: 'underline'
              }}>
                Cliquer pour changer le fichier
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                Cliquer pour charger un fichier *
              </div>
              <div style={{ fontSize: '2.5rem', color: '#999', marginBottom: '0.5rem' }}>+</div>
              <div style={{ 
                fontSize: '0.8rem', color: '#666', textAlign: 'center',
                lineHeight: '1.3'
              }}>
                Max 10MB<br/>
                PDF, Images, Documents, etc.
              </div>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            disabled={isSubmitting}
            style={{ display: 'none' }}
            // Accept any file type - remove the accept attribute restriction
          />
        </div>
      </form>
    </div>
  );
}