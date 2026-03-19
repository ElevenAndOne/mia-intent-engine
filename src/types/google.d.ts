// Type declarations for Google Identity Services (GIS)
// Loaded via <script src="https://accounts.google.com/gsi/client"> in index.html

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId: string;
}

interface GoogleIdInitConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GsiButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
}

interface GoogleAccountsId {
  initialize(config: GoogleIdInitConfig): void;
  renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
  prompt(): void;
  disableAutoSelect(): void;
}

interface Google {
  accounts: {
    id: GoogleAccountsId;
  };
}

// Global variable — may be undefined until the GIS script loads
declare let google: Google | undefined;
