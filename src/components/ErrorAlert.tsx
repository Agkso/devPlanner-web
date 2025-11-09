/**
 * Componente de alerta de erro reutilizável
 */

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
  title = 'Erro',
}) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium text-red-900">{title}</p>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
