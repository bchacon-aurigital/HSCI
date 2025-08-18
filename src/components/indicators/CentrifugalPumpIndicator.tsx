import React, { useEffect, useRef, useState } from 'react';

interface CentrifugalPumpIndicatorProps {
	status: number; // 0 reposo, 1 operando, 2 fallo, 3 fuera de servicio
}

// Indicador de Bomba Centrífuga
// Mantiene paleta/estados como PumpIndicator para consistencia visual
export const CentrifugalPumpIndicator = ({ status }: CentrifugalPumpIndicatorProps) => {
	const clampStatus = (s: number) => (s >= 3 ? 3 : s);
	const [animatedStatus, setAnimatedStatus] = useState(clampStatus(status));
	const [rotation, setRotation] = useState(0);
	const [pulseScale, setPulseScale] = useState(1);

	// Refs de intervalos
	const rotRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const statusColors = ['#3b82f6', '#22c55e', '#ef4444', '#f97316'];
	const statusGradients = [
		['#3b82f6', '#2563eb'],
		['#22c55e', '#16a34a'],
		['#ef4444', '#dc2626'],
		['#f97316', '#ea580c'],
	];
	const labels = ['En Reposo', 'En Operación', 'Fallo Detectado', 'Fuera de Servicio'];

	useEffect(() => {
		setAnimatedStatus(clampStatus(status));
	}, [status]);

	useEffect(() => {
		if (rotRef.current) {
			clearInterval(rotRef.current);
			rotRef.current = null;
		}
		if (animatedStatus === 1) {
			rotRef.current = setInterval(() => setRotation(prev => (prev + 5) % 360), 40);
		} else {
			setRotation(0);
		}
		return () => {
			if (rotRef.current) clearInterval(rotRef.current);
			rotRef.current = null;
		};
	}, [animatedStatus]);

	useEffect(() => {
		if (pulseRef.current) {
			clearInterval(pulseRef.current);
			pulseRef.current = null;
		}
		if (animatedStatus === 2) {
			pulseRef.current = setInterval(() => setPulseScale(p => (p === 1 ? 1.08 : 1)), 600);
		} else {
			setPulseScale(1);
		}
		return () => {
			if (pulseRef.current) clearInterval(pulseRef.current);
			pulseRef.current = null;
		};
	}, [animatedStatus]);

	// Impulsor (impeller) de 6 palas
	const renderImpeller = () => {
		const blades = [] as React.ReactNode[];
		for (let i = 0; i < 6; i++) {
			const angle = (i / 6) * 360;
			blades.push(
				<path
					key={i}
					d="M50 50 C 55 48, 60 45, 60 40 C 58 45, 55 48, 50 50 Z"
					transform={`rotate(${angle} 50 50)`}
					fill={animatedStatus === 1 ? '#ffffff' : '#e5e7eb'}
					opacity={0.95}
				/>
			);
		}
		return blades;
	};

	return (
		<div className="relative">
			<svg viewBox="0 0 100 120" className="w-40 h-56 mx-auto">
				<defs>
					<linearGradient id={`centrifugalBody-${animatedStatus}`} x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={statusGradients[animatedStatus][0]} />
						<stop offset="100%" stopColor={statusGradients[animatedStatus][1]} />
					</linearGradient>
					<filter id="cf-shadow">
						<feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.35" />
					</filter>
					<filter id="cf-glow">
						<feGaussianBlur stdDeviation="2" result="b" />
						<feComposite in="SourceGraphic" in2="b" operator="over" />
					</filter>
				</defs>

				{/* Base / skid */}
				<rect x="22" y="95" width="56" height="6" rx="2" fill="#334155" filter="url(#cf-shadow)" />

				{/* Motor vertical */}
				<g style={{ transform: `scale(${animatedStatus === 2 ? pulseScale : 1})`, transformOrigin: '50px 38px', transition: 'transform 0.3s ease' }}>
					<rect x="40" y="18" width="20" height="20" rx="2" fill={statusColors[animatedStatus]} stroke="#1e293b" strokeWidth="1" />
					<rect x="42" y="12" width="16" height="6" rx="2" fill={statusColors[animatedStatus]} stroke="#1e293b" strokeWidth="1" />
					<rect x="44" y="8" width="12" height="4" rx="1" fill={statusColors[animatedStatus]} opacity="0.9" />
				</g>

				{/* Cuerpo voluta centrífuga */}
				<g filter="url(#cf-shadow)">
					<circle cx="50" cy="56" r="20" fill={`url(#centrifugalBody-${animatedStatus})`} stroke="#1e293b" strokeWidth="2" />
					{/* Cámara interna */}
					<circle cx="50" cy="56" r="13" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
					{/* Impulsor */}
					<g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 56px', transition: 'transform 0.05s linear' }}>
						{renderImpeller()}
						<circle cx="50" cy="56" r="3" fill={statusColors[animatedStatus]} />
					</g>
				</g>

				{/* Tuberías de succión y descarga */}
				<path d="M30 56 H15 V30" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
				<path d="M70 56 H85 V30" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

				{/* Flechas de flujo cuando está operando */}
				{animatedStatus === 1 && (
					<g>
						<polygon points="22,45 26,45 24,41" fill="#93c5fd">
							<animate attributeName="y" dur="1.2s" values="0;-8" repeatCount="indefinite" />
						</polygon>
						<polygon points="78,45 82,45 80,41" fill="#86efac">
							<animate attributeName="y" dur="1.2s" values="0;-8" begin="0.3s" repeatCount="indefinite" />
						</polygon>
					</g>
				)}
			</svg>

			{/* Etiqueta de estado */}
			<div className="absolute bottom-2 left-0 right-0 flex justify-center">
				<div
					className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
						animatedStatus === 0
							? 'bg-blue-100 text-blue-800'
						: animatedStatus === 1
						? 'bg-green-100 text-green-800'
						: animatedStatus === 2
						? 'bg-red-100 text-red-800'
						: 'bg-orange-100 text-orange-800'
					}`}
				>
					<span
						className={`mr-1.5 h-2 w-2 inline-block rounded-full ${
							animatedStatus === 0
								? 'bg-blue-500'
							: animatedStatus === 1
							? 'bg-green-500'
							: animatedStatus === 2
							? 'bg-red-500'
							: 'bg-orange-500'
						}`}
						style={{ animation: animatedStatus === 2 ? 'pulse 0.8s infinite' : 'pulse 2s infinite' }}
					/>
					{labels[animatedStatus]}
				</div>
			</div>

			<style>{`
				@keyframes pulse {
					0% { opacity: 0.5; transform: scale(1); }
					50% { opacity: 1; transform: scale(1.2); }
					100% { opacity: 0.5; transform: scale(1); }
				}
			`}</style>
		</div>
	);
}; 