// Geographic regions mapping
const regionMapping = {
    'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cape Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'DR Congo', 'Congo', "Cote d'Ivoire", 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Eswatini', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
    'Central America': ['Belize', 'Costa Rica', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panama'],
    'North America': ['United States', 'United States (Alaska)', 'Canada', 'Mexico'],
    'South America': ['Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Guyana', 'Suriname', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay'],
    'Asia': ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Hong Kong', 'India', 'Indonesia', 'Iran', 'Iraq', 'Japan', 'Kazakhstan', 'Kyrgyzstan', 'Laos', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Pakistan', 'Philippines', 'Russia', 'Singapore', 'South Korea', 'Sri Lanka', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkmenistan', 'Uzbekistan', 'Vietnam'],
    'North Atlantic': ['Iceland', 'Greenland', 'Faroe Islands'],
    'Caribbean': ['Dominican Republic', 'Puerto Rico', 'Cuba', 'Jamaica', 'Barbados', 'Trinidad and Tobago', 'Curacao', 'Aruba', 'Bonaire', 'Sint Maarten', 'Saint Martin', 'US Virgin Islands', 'Bahamas', 'Cayman Islands', 'Antigua and Barbuda', 'Saint Lucia', 'Grenada', 'Saint Vincent and the Grenadines', 'Guadeloupe', 'Martinique', 'French Guiana', 'Saba', 'Sint Eustatius', 'Saint Barthelemy', 'Dominica', 'Saint Kitts and Nevis'],
    'Europe': ['United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium', 'Spain', 'Portugal', 'Portugal (Azores)', 'Italy', 'Switzerland', 'Austria', 'Denmark', 'Norway', 'Sweden', 'Finland'],
    'Atlantic Islands': ['Saint Helena'],
    'Indian Ocean Islands': ['Seychelles', 'Maldives', 'Reunion', 'Mauritius'],
    'Oceania': ['Australia', 'New Zealand', 'Fiji', 'Samoa', 'American Samoa', 'New Caledonia', 'Papua New Guinea'],
    'Middle East': ['United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Saudi Arabia', 'Israel', 'Lebanon', 'Syria', 'Turkey', 'Jordan', 'Iran', 'Iraq'],
    'Pacific': ['United States (Hawaii)', 'Guam', 'Northern Mariana Islands']
};

// Database of JET aircraft manufacturers and models
const aircraftDatabase = {
    'aerion': {
        name: 'Aerion Supersonic',
        models: {
            'as2': { name: 'AS2 (Supersonic)', range: 9260 } // Project in development
        }
    },
    'airbus': {
        name: 'Airbus Corporate Jets',
        models: {
            'acj220': { name: 'ACJ TwoTwenty', range: 12964 },
            'acj319': { name: 'ACJ319neo', range: 13334 },
            'acj320': { name: 'ACJ320neo', range: 11112 },
            'acj321': { name: 'ACJ321neo', range: 13889 },
            'acj330': { name: 'ACJ330', range: 18519 },
            'acj350': { name: 'ACJ350', range: 20186 }
        }
    },
    'boeing': {
        name: 'Boeing Business Jets',
        models: {
            'bbj': { name: 'BBJ (737-700)', range: 10186 },
            'bbj2': { name: 'BBJ2 (737-800)', range: 10186 },
            'bbj3': { name: 'BBJ3 (737-900ER)', range: 9260 },
            'bbj-max-7': { name: 'BBJ MAX 7', range: 12964 },
            'bbj-max-8': { name: 'BBJ MAX 8', range: 11112 },
            'bbj-max-9': { name: 'BBJ MAX 9', range: 10186 },
            'bbj-787-8': { name: 'BBJ 787-8 Dreamliner', range: 18519 },
            'bbj-787-9': { name: 'BBJ 787-9 Dreamliner', range: 20372 },
            'bbj-777': { name: 'BBJ 777', range: 18519 },
            'bbj-777x-8': { name: 'BBJ 777X-8', range: 21570 }, // Launch 2028
            'bbj-777x-9': { name: 'BBJ 777X-9', range: 20370 }, // Launch 2028
            'bbj-747': { name: 'BBJ 747-8', range: 19446 }
        }
    },
    'bombardier': {
        name: 'Bombardier',
        models: {
            'learjet-75': { name: 'Learjet 75', range: 3889 },
            'challenger-350': { name: 'Challenger 350', range: 5926 },
            'challenger-650': { name: 'Challenger 650', range: 7408 },
            'global-5500': { name: 'Global 5500', range: 11112 },
            'global-6500': { name: 'Global 6500', range: 12408 },
            'global-7500': { name: 'Global 7500', range: 14260 },
            'global-8000': { name: 'Global 8000', range: 15186 } // Launch 2025
        }
    },
    'boom': {
        name: 'Boom Supersonic',
        models: {
            'overture': { name: 'Overture (Supersonic)', range: 8334 } // Launch 2029
        }
    },
    'cirrus': {
        name: 'Cirrus',
        models: {
            'sf50-vision': { name: 'SF50 Vision Jet', range: 1852 }
        }
    },
    'cessna': {
        name: 'Cessna Citation',
        models: {
            'citation-m2': { name: 'Citation M2', range: 2593 },
            'citation-cj3': { name: 'Citation CJ3+', range: 3778 },
            'citation-cj4': { name: 'Citation CJ4', range: 3889 },
            'citation-latitude': { name: 'Citation Latitude', range: 5000 },
            'citation-longitude': { name: 'Citation Longitude', range: 6482 },
            'citation-sovereign': { name: 'Citation Sovereign+', range: 5556 },
            'citation-xls': { name: 'Citation XLS+', range: 4074 }
        }
    },
    'dassault': {
        name: 'Dassault Falcon',
        models: {
            'falcon-2000': { name: 'Falcon 2000', range: 5556 },
            'falcon-6x': { name: 'Falcon 6X', range: 10186 },
            'falcon-7x': { name: 'Falcon 7X', range: 11019 },
            'falcon-8x': { name: 'Falcon 8X', range: 11945 },
            'falcon-900': { name: 'Falcon 900', range: 8334 },
            'falcon-10x': { name: 'Falcon 10X', range: 13890 } // Launch 2027
        }
    },
    'embraer': {
        name: 'Embraer',
        models: {
            'phenom-100': { name: 'Phenom 100', range: 2182 },
            'phenom-300': { name: 'Phenom 300', range: 3334 },
            'praetor-500': { name: 'Praetor 500', range: 5556 },
            'praetor-600': { name: 'Praetor 600', range: 7408 },
            'praetor-700': { name: 'Praetor 700', range: 8334 }, // Launch 2027
            'legacy-450': { name: 'Legacy 450', range: 4260 },
            'legacy-500': { name: 'Legacy 500', range: 5556 },
            'legacy-650': { name: 'Legacy 650', range: 7223 }
        }
    },
    'gulfstream': {
        name: 'Gulfstream',
        models: {
            'g280': { name: 'G280', range: 6667 },
            'g400': { name: 'G400', range: 8334 }, // Launch 2025
            'g500': { name: 'G500', range: 9260 },
            'g600': { name: 'G600', range: 11112 },
            'g650': { name: 'G650', range: 12964 },
            'g650er': { name: 'G650ER', range: 13890 },
            'g700': { name: 'G700', range: 13890 },
            'g800': { name: 'G800', range: 14816 }
        }
    },
    'honda': {
        name: 'Honda Aircraft',
        models: {
            'hondajet-ha420': { name: 'HondaJet HA-420', range: 2265 },
            'hondajet-2600': { name: 'HondaJet 2600', range: 4815 }, // Launch 2028
            'hondajet-echelon': { name: 'HondaJet Echelon', range: 6482 } // Launch 2029
        }
    }
};