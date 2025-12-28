/**
 * Click & Collect Toggle Component
 *
 * A toggle button to enable/disable Click & Collect mode
 */

import React from "react";

export interface ClickCollectToggleProps {
	enabled: boolean;
	onToggle: () => void;
	loading?: boolean;
	className?: string;
	disabled?: boolean;
}

export const ClickCollectToggle: React.FC<ClickCollectToggleProps> = ({
	enabled,
	onToggle,
	loading = false,
	className = "",
	disabled = false,
}) => {
	return (
		<button
			onClick={onToggle}
			disabled={disabled || loading}
			className={`click-collect-toggle ${enabled ? "enabled" : "disabled"} ${className}`}
			aria-label={enabled ? "Disable Click & Collect" : "Enable Click & Collect"}
			aria-pressed={enabled}
		>
			{loading ? (
				<span className="loading">Loading...</span>
			) : (
				<>
					<span className="icon">{enabled ? "✓" : "📍"}</span>
					<span className="label">{enabled ? "Click & Collect" : "Enable Click & Collect"}</span>
				</>
			)}
		</button>
	);
};

// CSS Styles (add to your stylesheet)
export const clickCollectToggleStyles = `
.click-collect-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid #007bff;
  border-radius: 0.5rem;
  background: white;
  color: #007bff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.click-collect-toggle:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.click-collect-toggle.enabled {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.click-collect-toggle.enabled:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.click-collect-toggle:disabled,
.click-collect-toggle.loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.click-collect-toggle .icon {
  font-size: 1.125rem;
}

.click-collect-toggle .loading {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
