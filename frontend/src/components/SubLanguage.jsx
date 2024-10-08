import React from 'react';

// Array of languages with their codes and names

const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'fi', name: 'Finnish' },
    { code: 'ko', name: 'Korean' },
    { code: 'pl', name: 'Polish' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' }
];

const SubLanguage = ({selectedInputVideoLanguage, setSelectedInputVideoLanguage ,selectedSubtitleLanguage ,setSelectedSubtitleLanguage }) => {
    return (

       <div className='flex flex-col'>
         <div  className='flex justify-center items-center my-4  gap-5 md:gap-16'>
          <h2 className='text-white font-medium text-lg md:text-2xl'>Select Your Input <br/> Video's language </h2>
        <select className=' w-32 md:w-48 h-10 rounded-lg' value={selectedInputVideoLanguage} onChange={(e) => setSelectedInputVideoLanguage(e.target.value)}>
            {languages.map((language) => (
                <option key={language.code} value={language.code}>
                    {language.name}
                </option>
            ))}
        </select>
        </div>

        <div  className='flex justify-center items-center mt-4 mb-8   gap-5 md:gap-16'>
          <h2 className='text-white font-medium text-lg md:text-2xl'>Select Desired <br/> Subtitle language </h2>
        <select className=' w-32 md:w-48 h-10 rounded-lg' value={selectedSubtitleLanguage} onChange={(e) => setSelectedSubtitleLanguage(e.target.value)}>
            {languages.map((language) => (
                <option key={language.code} value={language.code}>
                    {language.name}
                </option>
            ))}
        </select>
        </div>
       </div>
    );
};

export default SubLanguage;