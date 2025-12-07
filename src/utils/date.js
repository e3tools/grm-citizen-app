export const formatDate = (dateString, locale = 'en-US', options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, options);
};
