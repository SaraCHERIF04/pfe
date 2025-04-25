
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryCode {
  code: string;
  dial_code: string;
  name: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+213');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Most popular country codes first, then add more
    const popularCodes = [
      { code: "DZ", dial_code: "+213", name: "Algérie" },
      { code: "FR", dial_code: "+33", name: "France" },
      { code: "US", dial_code: "+1", name: "États-Unis" },
      { code: "CA", dial_code: "+1", name: "Canada" },
      { code: "GB", dial_code: "+44", name: "Royaume-Uni" },
      { code: "DE", dial_code: "+49", name: "Allemagne" },
      { code: "ES", dial_code: "+34", name: "Espagne" },
      { code: "IT", dial_code: "+39", name: "Italie" },
      { code: "MA", dial_code: "+212", name: "Maroc" },
      { code: "TN", dial_code: "+216", name: "Tunisie" },
      { code: "EG", dial_code: "+20", name: "Égypte" },
      { code: "SA", dial_code: "+966", name: "Arabie Saoudite" },
      { code: "AE", dial_code: "+971", name: "Émirats Arabes Unis" },
      { code: "LY", dial_code: "+218", name: "Libye" },
      { code: "TR", dial_code: "+90", name: "Turquie" },
      { code: "CN", dial_code: "+86", name: "Chine" },
      { code: "JP", dial_code: "+81", name: "Japon" },
      { code: "KR", dial_code: "+82", name: "Corée du Sud" },
      { code: "IN", dial_code: "+91", name: "Inde" },
      { code: "RU", dial_code: "+7", name: "Russie" },
      { code: "BR", dial_code: "+55", name: "Brésil" },
      { code: "MX", dial_code: "+52", name: "Mexique" },
      { code: "AU", dial_code: "+61", name: "Australie" },
      { code: "ZA", dial_code: "+27", name: "Afrique du Sud" },
    ];

    setCountryCodes(popularCodes);
  }, []);

  useEffect(() => {
    // Parse the current value to extract country code and phone number
    if (value) {
      // Find the country code in the value
      const countryCode = countryCodes.find(cc => value.startsWith(cc.dial_code));
      
      if (countryCode) {
        setSelectedCountryCode(countryCode.dial_code);
        setPhoneNumber(value.substring(countryCode.dial_code.length).trim());
      } else {
        // If no country code found or not yet loaded, use default +213
        setSelectedCountryCode('+213');
        setPhoneNumber(value.replace('+213', '').trim());
      }
    }
  }, [value, countryCodes]);

  const handleCountryCodeChange = (dialCode: string) => {
    setSelectedCountryCode(dialCode);
    onChange(`${dialCode} ${phoneNumber}`);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    onChange(`${selectedCountryCode} ${newPhoneNumber}`);
  };

  return (
    <div className="flex">
      <Select 
        value={selectedCountryCode}
        onValueChange={handleCountryCodeChange}
      >
        <SelectTrigger className="w-24 flex-shrink-0">
          <SelectValue placeholder="+213" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.dial_code}>
              {country.dial_code} ({country.name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        className="flex-grow ml-2"
        type="tel"
        placeholder="Numéro de téléphone"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
    </div>
  );
};

export default PhoneInput;
