export const countryCodes = [
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
];

export const detectCountryByTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const timezoneToCountry = {
      'America/New_York': '+1',
      'America/Los_Angeles': '+1',
      'America/Chicago': '+1',
      'America/Denver': '+1',
      'America/Toronto': '+1',
      'America/Vancouver': '+1',
      'Europe/London': '+44',
      'Africa/Accra': '+233',
      'Africa/Lagos': '+234',
      'Africa/Nairobi': '+254',
      'Africa/Johannesburg': '+27',
      'Africa/Cairo': '+20',
      'Africa/Casablanca': '+212',
      'Africa/Tunis': '+216',
      'Africa/Addis_Ababa': '+251',
      'Africa/Kampala': '+256',
      'Africa/Dar_es_Salaam': '+255',
      'Africa/Kigali': '+250',
      'Africa/Gaborone': '+267',
      'Africa/Lusaka': '+260',
      'Africa/Harare': '+263',
      'Europe/Berlin': '+49',
      'Europe/Paris': '+33',
      'Europe/Madrid': '+34',
      'Europe/Rome': '+39',
      'Europe/Amsterdam': '+31',
      'Asia/Kolkata': '+91',
      'Asia/Shanghai': '+86',
      'Asia/Tokyo': '+81',
      'Asia/Seoul': '+82',
      'Australia/Sydney': '+61',
      'America/Sao_Paulo': '+55',
      'America/Mexico_City': '+52',
      'Europe/Moscow': '+7',
    };

    return timezoneToCountry[timezone] || '+233'; // Default to Ghana
  } catch (error) {
    console.error('Error detecting timezone:', error);
    return '+233'; // Default fallback
  }
};

export const detectCountryByIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const countryToCode = {
      'US': '+1',
      'CA': '+1',
      'GB': '+44',
      'GH': '+233',
      'NG': '+234',
      'KE': '+254',
      'ZA': '+27',
      'EG': '+20',
      'MA': '+212',
      'TN': '+216',
      'ET': '+251',
      'UG': '+256',
      'TZ': '+255',
      'RW': '+250',
      'BW': '+267',
      'ZM': '+260',
      'ZW': '+263',
      'DE': '+49',
      'FR': '+33',
      'ES': '+34',
      'IT': '+39',
      'NL': '+31',
      'IN': '+91',
      'CN': '+86',
      'JP': '+81',
      'KR': '+82',
      'AU': '+61',
      'BR': '+55',
      'MX': '+52',
      'RU': '+7',
    };

    return countryToCode[data.country_code] || '+233';
  } catch (error) {
    console.error('Error detecting country by IP:', error);
    return detectCountryByTimezone();
  }
};

export const formatPhoneNumber = (countryCode, phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove any existing country code or special characters
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
  
  // If number already starts with country code digits, don't duplicate
  const codeDigits = countryCode.replace('+', '');
  if (cleanNumber.startsWith(codeDigits)) {
    return `+${cleanNumber}`;
  }
  
  return `${countryCode}${cleanNumber}`;
};