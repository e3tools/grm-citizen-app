// Map status to colors and display text
import {i18n} from "../translations/i18n";

export const getStatusInfo = (status) => {
    const statusMap = {
      'submitted': { color: '#dee9fc', textColor: '#314aad', text: i18n.t('submitted') },
      'in_progress': { color: '#fdf9c9', textColor: '#875d2c', text: i18n.t('in_progress') },
      'resolved': { color: '#e2fbe8', textColor: '#4ca055', text: i18n.t('resolved') },
    };

    return statusMap[status?.name?.toLowerCase()] || statusMap['submitted'];
};
