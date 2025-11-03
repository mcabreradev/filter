export interface Example {
  id: string;
  name: string;
  code: string;
}

export interface Dataset {
  id: string;
  name: string;
  code: string;
  fields: string[];
}

export interface BuilderRule {
  field: string;
  operator: string;
  value: string;
}

export interface OperatorOption {
  value: string;
  label: string;
}

export interface FieldType {
  [field: string]: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
}
