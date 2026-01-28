'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Select Component - Form Select/Dropdown Field
 *
 * A flexible select component for dropdown selections.
 * Includes label, error states, helper text, and icon support.
 *
 * Usage:
 *   <Select
 *     label="Category"
 *     value={category}
 *     onChange={(e) => setCategory(e.target.value)}
 *   >
 *     <option value="hiking">Hiking</option>
 *     <option value="biking">Biking</option>
 *   </Select>
 */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

// Using forwardRef allows parent components to access the select DOM node
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      fullWidth = false,
      className,
      id,
      required,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility (label association)
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : `select-${Date.now()}`);

    // Helper text or error message ID for aria-describedby
    const descriptionId = `${selectId}-description`;
    const errorId = `${selectId}-error`;

    // Base select styles
    const baseSelectStyles = cn(
      'w-full px-4 py-2.5 text-base',
      'bg-white border-2 rounded-[var(--radius-md)]',
      'text-[var(--color-gray-800)]',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:bg-[var(--color-gray-100)] disabled:cursor-not-allowed disabled:opacity-60',
      'appearance-none cursor-pointer',
    );

    // Border color based on state (error vs normal vs focused)
    const borderStyles = cn(
      error
        ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
        : 'border-[var(--color-gray-300)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]',
    );

    // Add padding for icon if present
    const iconPadding = icon && 'pl-11';

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-gray-700)]"
          >
            {label}
            {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Select wrapper - relative positioning for icon placement */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none z-10">
              {icon}
            </div>
          )}

          {/* Select Element */}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              baseSelectStyles,
              borderStyles,
              iconPadding,
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? descriptionId : undefined
            }
            aria-required={required}
            {...props}
          >
            {children}
          </select>

          {/* Dropdown Arrow Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={descriptionId}
            className="text-sm text-[var(--color-gray-500)]"
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="text-sm text-[var(--color-danger)] flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

// Display name for React DevTools
Select.displayName = 'Select';
