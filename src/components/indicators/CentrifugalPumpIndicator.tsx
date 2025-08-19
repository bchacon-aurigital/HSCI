import React, { useEffect, useRef, useState } from 'react';

interface CentrifugalPumpIndicatorProps {
	status: number; // 0 reposo, 1 operando, 2 fallo, 3 fuera de servicio
}

// Indicador de Bomba Centrífuga Vertical In-Line
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

	return (
		<div className="relative">
			<svg viewBox="0 0 100 140" className="w-40 h-64 mx-auto">
				<defs>
					<linearGradient id={`centrifugalBody-${animatedStatus}`} x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={statusGradients[animatedStatus][0]} />
						<stop offset="100%" stopColor={statusGradients[animatedStatus][1]} />
					</linearGradient>
					<pattern id="mesh" width="4" height="4" patternUnits="userSpaceOnUse">
						<path d="M0 0 L4 4 M4 0 L0 4" stroke="#94a3b8" strokeWidth="0.3" />
					</pattern>
					<filter id="cf-shadow">
						<feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.35" />
					</filter>
				</defs>

				{/* Base / skid */}
				<rect x="20" y="125" width="60" height="8" rx="2" fill="#334155" />

				{/* Motor vertical con aletas */}
				<g style={{ transform: `scale(${animatedStatus === 2 ? pulseScale : 1})`, transformOrigin: '50px 25px', transition: 'transform 0.3s ease' }}>
					<rect x="40" y="5" width="20" height="60" rx="2" fill={statusColors[animatedStatus]} stroke="#1e293b" strokeWidth="1" />
					{Array.from({ length: 6 }).map((_, i) => (
						<line key={i} x1={42 + i * 3} y1={7} x2={42 + i * 3} y2={66} stroke="#1e293b" strokeWidth="0.6" />
					))}
					{/* Tapa del motor */}
					<rect x="38" y="20" width="24" height="6" rx="2" fill={statusColors[animatedStatus]} stroke="#1e293b" strokeWidth="1" />
				</g>

				{/* Cuerpo cilíndrico con rejilla */}
				<rect x="35" y="58" width="30" height="45" rx="6" fill={`url(#centrifugalBody-${animatedStatus})`} stroke="#1e293b" strokeWidth="1.5" filter="url(#cf-shadow)" />
				<rect x="37" y="60" width="26" height="41" rx="4" fill="url(#mesh)" opacity="0.5" />

				{/* Impulsor animado dentro */}
				<g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 80px', transition: 'transform 0.05s linear' }}>
					<circle cx="50" cy="80" r="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
					{Array.from({ length: 6 }).map((_, i) => {
						const angle = (i / 6) * 360;
						return (
							<path
								key={i}
								d="M50 70 C 53 72, 56 76, 55 80 C 54 76, 52 73, 50 70 Z"
								transform={`rotate(${angle} 50 80)`}
								fill={animatedStatus === 1 ? '#ffffff' : '#e5e7eb'}
								opacity={0.95}
							/>
						);
					})}
					<circle cx="50" cy="80" r="2.5" fill={statusColors[animatedStatus]} />
				</g>

				{/* Bridas de succión y descarga */}
				<circle cx="30" cy="100" r="6" fill="#64748b" stroke="#1e293b" strokeWidth="1.2" />
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
