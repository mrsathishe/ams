declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sl-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
        size?: 'small' | 'medium' | 'large';
        disabled?: boolean;
        loading?: boolean;
        outline?: boolean;
        pill?: boolean;
        circle?: boolean;
        type?: 'button' | 'submit' | 'reset';
        href?: string;
        target?: string;
        download?: string;
      };
      
      'sl-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        name?: string;
        value?: string | number;
        placeholder?: string;
        size?: 'small' | 'medium' | 'large';
        filled?: boolean;
        pill?: boolean;
        label?: string;
        'help-text'?: string;
        clearable?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        pattern?: string;
        minlength?: number;
        maxlength?: number;
        min?: number;
        max?: number;
        step?: number;
        autocapitalize?: string;
        autocorrect?: string;
        autocomplete?: string;
        autofocus?: boolean;
        spellcheck?: boolean;
        inputmode?: string;
        'password-toggle'?: boolean;
      };
      
      'sl-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        class?: string;
      };
      
      'sl-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        library?: string;
        src?: string;
        label?: string;
      };
      
      'sl-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        value?: string;
        checked?: boolean;
        indeterminate?: boolean;
        disabled?: boolean;
        required?: boolean;
        size?: 'small' | 'medium' | 'large';
      };
      
      'sl-form': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        novalidate?: boolean;
      };
      
      'sl-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        value?: string | string[];
        placeholder?: string;
        size?: 'small' | 'medium' | 'large';
        multiple?: boolean;
        'max-options-visible'?: number;
        disabled?: boolean;
        clearable?: boolean;
        open?: boolean;
        hoist?: boolean;
        filled?: boolean;
        pill?: boolean;
        label?: string;
        'help-text'?: string;
        required?: boolean;
      };
      
      'sl-option': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        disabled?: boolean;
      };
      
      'sl-spinner': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        // No specific props for spinner
      };
      
      'sl-alert': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
        open?: boolean;
        closable?: boolean;
        duration?: number;
      };
      
      'sl-dialog': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        open?: boolean;
        label?: string;
        'no-header'?: boolean;
      };
    }
  }
}

export {};