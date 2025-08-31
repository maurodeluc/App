import React, { useState } from 'react';
import { Download, Mail, MessageCircle, FileText, Share } from 'lucide-react';
import ApiService from '../services/api';

const ExportData = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [exportedFile, setExportedFile] = useState(null);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      
      // Get the backend URL for direct download
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const downloadUrl = `${backendUrl}/api/export/csv?patient_id=default`;
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `LEAF_mood_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Set the exported file info for sharing options
      setExportedFile({
        name: link.download,
        url: downloadUrl
      });
      
      setShowShareOptions(true);
      
      // Success notification
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50';
      successDiv.textContent = '✅ Dati esportati con successo!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Errore durante l\'esportazione. Riprova.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('I miei dati LEAF - Monitoraggio dell\'umore');
    const body = encodeURIComponent(`Ciao Dr. De Luca,

Ti invio in allegato i miei dati di monitoraggio dell'umore raccolti con l'app LEAF.

Il file contiene:
- Tutte le mie registrazioni giornaliere
- Statistiche riassuntive del mio percorso
- Distribuzione dei livelli di umore

Questi dati potrebbero essere utili per la nostra prossima sessione di terapia.

Cordiali saluti`);
    
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    // Show instruction
    alert('📧 Si è aperto il tuo client email.\n\nRicordati di allegare il file CSV scaricato prima di inviare l\'email al Dr. De Luca.');
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`🍃 *LEAF - I miei dati di monitoraggio*

Ciao Dr. De Luca, ti condivido i miei dati di monitoraggio dell'umore raccolti con l'app LEAF.

📊 Il file CSV contiene:
• Tutte le mie registrazioni giornaliere
• Statistiche del mio percorso di benessere  
• Analisi della distribuzione dell'umore

Questi dati potrebbero essere utili per la nostra prossima sessione. Ti invierò il file CSV in un messaggio separato.

Grazie per il tuo supporto! 🙏`);
    
    // Dr. De Luca's WhatsApp number (you might want to make this configurable)
    const phoneNumber = '+393491234567'; // Replace with actual number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Show instruction for file attachment
    setTimeout(() => {
      alert('📱 WhatsApp si è aperto con il messaggio.\n\n💡 Suggerimento: Dopo aver inviato il messaggio, puoi condividere il file CSV scaricato come allegato in una chat separata.');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Esporta i tuoi dati</h3>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm leading-relaxed">
          Esporta tutti i tuoi dati di monitoraggio dell'umore in formato CSV. 
          Il file includerà le tue registrazioni giornaliere e le statistiche riassuntive 
          per condividerle con il Dr. De Luca.
        </p>
      </div>

      {/* Export Button */}
      <div className="mb-6">
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Esportazione in corso...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Scarica dati CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Share Options */}
      {showShareOptions && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Share className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Condividi con Dr. De Luca</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Email Option */}
              <button
                onClick={handleEmailShare}
                className="flex items-center gap-2 bg-white p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">Email</div>
                  <div className="text-xs text-gray-500">Via email client</div>
                </div>
              </button>

              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 bg-white p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">WhatsApp</div>
                  <div className="text-xs text-gray-500">Messaggio diretto</div>
                </div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">💡</span>
              <div className="text-sm text-yellow-800">
                <strong>Come condividere:</strong>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• <strong>Email:</strong> Il file CSV verrà scaricato. Allegalo all'email che si aprirà.</li>
                  <li>• <strong>WhatsApp:</strong> Invia prima il messaggio, poi condividi il file CSV come allegato.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded-2xl p-3">
        <strong>Il file CSV contiene:</strong><br/>
        • Tutte le tue registrazioni giornaliere (data, umore, attività, note)<br/>
        • Statistiche riassuntive (entries totali, giorni consecutivi, umore medio)<br/>
        • Distribuzione dettagliata dei livelli di umore<br/>
        • Data di creazione per ogni entry
      </div>
    </div>
  );
};

export default ExportData;