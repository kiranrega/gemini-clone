import { Country } from '@/lib/types';
import { useEffect, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import {toast } from 'react-hot-toast';

interface CountryCodeSelectorProps {
  field: ControllerRenderProps<any, any>;
}

interface CountryCodes {
  idd: {
    root: string;
    suffixes: string[];
  };
  name: {
    common: string;
  };
  code?: string;
}

const CountryCodeSelector = ({ field }: CountryCodeSelectorProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const formattedCountries = data
          .filter((c: CountryCodes) => c.idd?.root && c.idd?.suffixes)
          .map((c: CountryCodes) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a: CountryCodes, b: CountryCodes) => a.name.common.localeCompare(b.name.common));
        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching country codes:", error);
        toast.error("Could not load country codes.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (isLoading) {
    return <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 animate-pulse">Loading countries...</div>;
  }

  return (
    <select {...field} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
      <option value="">Select Country</option>
      {countries.map(c => (
        <option key={c.name} value={c.code}>{c.name} ({c.code})</option>
      ))}
    </select>
  );
};

export default CountryCodeSelector