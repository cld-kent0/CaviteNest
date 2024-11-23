import { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface AgreementInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isLoading: boolean;
}