// Simple URL validation utilities
export const validateSocialUrl = {
  linkedin: (url: string): boolean => {
    if (!url.trim()) return false;
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '');
    return (
      (cleanUrl.startsWith('linkedin.com/in/') || cleanUrl.startsWith('www.linkedin.com/in/')) &&
      cleanUrl.split('/').length >= 3 &&
      cleanUrl.split('/')[2].length > 0
    );
  },

  github: (url: string): boolean => {
    if (!url.trim()) return false;
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '');
    return (
      (cleanUrl.startsWith('github.com/') || cleanUrl.startsWith('www.github.com/')) &&
      cleanUrl.split('/').length >= 2 &&
      cleanUrl.split('/')[1].length > 0 &&
      !cleanUrl.includes('//', 8) // No double slashes after domain
    );
  },

  twitter: (url: string): boolean => {
    if (!url.trim()) return true; // Optional field
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '');
    return (
      (cleanUrl.startsWith('x.com/') || 
       cleanUrl.startsWith('www.x.com/') ||
       cleanUrl.startsWith('twitter.com/') || 
       cleanUrl.startsWith('www.twitter.com/')) &&
      cleanUrl.split('/').length >= 2 &&
      cleanUrl.split('/')[1].length > 0
    );
  }
};

export const getValidationError = (field: string, url: string): string => {
  const errors = {
    linkedin: 'Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)',
    github: 'Please enter a valid GitHub URL (e.g., https://github.com/username)',
    twitter: 'Please enter a valid X/Twitter URL (e.g., https://x.com/username)'
  };
  
  return errors[field as keyof typeof errors] || 'Invalid URL format';
};

export const normalizeUrl = (url: string): string => {
  if (!url.trim()) return url;
  const trimmed = url.trim();
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}; 