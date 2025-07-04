'use client';

import { useEffect } from 'react';

let bootstrap;

export function initializeTooltips() {
  if (typeof window !== 'undefined') {
    bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }
}

export function disposeTooltips() {
  if (typeof window !== 'undefined' && bootstrap) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (tooltip) {
        tooltip.dispose();
      }
    });
  }
}

export default function BootstrapClient() {
  useEffect(() => {
    initializeTooltips();
    return () => {
      disposeTooltips();
    };
  }, []);
  return null;
}