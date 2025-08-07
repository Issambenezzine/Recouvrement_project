import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
export default function UnauthorizedAccess() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturnHome = () => {
    navigate("/login")
  };

  const handleContactSupport = () => {
    console.log('Contacter le support');
    alert('Contacter le support technique');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="unauthorized-container">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
            }
            50% { 
              box-shadow: 0 0 40px rgba(239, 68, 68, 0.6);
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }

          .unauthorized-container {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
          }

          .unauthorized-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
            pointer-events: none;
          }

          .content-wrapper {
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 48px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            position: relative;
            animation: ${isVisible ? 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'};
          }

          .icon-container {
            width: 100px;
            height: 100px;
            margin: 0 auto 32px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: glow 2s ease-in-out infinite, float 3s ease-in-out infinite;
            position: relative;
          }

          .icon-container::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border-radius: 50%;
            z-index: -1;
            opacity: 0.3;
          }

          .lock-icon {
            width: 48px;
            height: 48px;
            color: white;
          }

          .title {
            color: #ef4444;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            letter-spacing: -0.025em;
          }

          .subtitle {
            color: #94a3b8;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .message {
            color: #e2e8f0;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            font-weight: 500;
          }

          .details-box {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
            text-align: left;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #cbd5e1;
            font-weight: 500;
          }

          .detail-item:last-child {
            border-bottom: none;
          }

          .detail-label {
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.05em;
          }

          .detail-value {
            color: #e2e8f0;
            font-weight: 600;
            font-family: 'Courier New', monospace;
          }

          .time-value {
            color: #60a5fa;
          }

          .buttons-container {
            display: flex;
            gap: 16px;
            flex-direction: column;
          }

          .btn {
            padding: 16px 24px;
            border-radius: 12px;
            border: none;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            text-transform: uppercase;
            letter-spacing: 0.025em;
            position: relative;
            overflow: hidden;
          }

          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          .btn:hover::before {
            left: 100%;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          }

          .error-code {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            border: 1px solid rgba(239, 68, 68, 0.3);
          }

          @media (max-width: 600px) {
            .content-wrapper {
              padding: 32px 24px;
              margin: 20px;
            }

            .title {
              font-size: 28px;
            }

            .buttons-container {
              gap: 12px;
            }

            .error-code {
              position: static;
              margin-bottom: 20px;
              display: inline-block;
            }
          }
        `}
      </style>

      <div className="content-wrapper">
        <div className="error-code">ERREUR 403</div>
        
        <div className="icon-container">
          <svg className="lock-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1C8.318 1 5.5 3.818 5.5 7.5V10H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1.5V7.5C18.5 3.818 15.682 1 12 1zm0 2c2.564 0 4.5 1.936 4.5 4.5V10h-9V7.5C7.5 4.936 9.436 3 12 3z"/>
          </svg>
        </div>

        <h1 className="title">ACCÈS REFUSÉ</h1>
        <h2 className="subtitle">Non Autorisé</h2>
        
        <p className="message">
          Désolé, 
          Vos permissions actuelles ne permettent pas l'accès à votre compte, veuillez de consulter
          l'administrateur du systéme pour obtenir des informations supplémentaires.
        </p>

        <div className="details-box">
          <div className="detail-item">
            <span className="detail-label">Code d'erreur</span>
            <span className="detail-value">403 FORBIDDEN</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(currentTime)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Heure</span>
            <span className="detail-value time-value">{formatTime(currentTime)}</span>
          </div>
        </div>

        <div className="buttons-container">
          <button className="btn btn-primary" onClick={handleReturnHome}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}