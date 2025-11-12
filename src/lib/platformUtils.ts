export const getPlatformDisplayName = (sourceType: string): string => {
  const platformNames: Record<string, string> = {
    google_drive: 'Google Drive',
    onedrive: 'OneDrive',
    dropbox: 'Dropbox',
    icloud: 'iCloud',
    other_url: 'Linkki'
  };
  return platformNames[sourceType] || 'Linkki';
};

export const getPlatformIcon = (sourceType: string): string => {
  const icons: Record<string, string> = {
    google_drive: '📁',
    onedrive: '☁️',
    dropbox: '📦',
    icloud: '☁️',
    other_url: '🔗'
  };
  return icons[sourceType] || '📄';
};
