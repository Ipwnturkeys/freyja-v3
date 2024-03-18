"use client";
import styles from './experience.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../utils/configSanity';

interface Logo {
  imageUrl: string;
}

const options = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache'
};



const getLogoData = async () => {
  const query = `*[_type == 'websiteLogos'] {
    "imageUrl": image.asset->url,
  }`;

  const data = await client.fetch(query, options, {next: {
    revalidate: 3600 // look for updates to revalidate cache every hour
  }});
  return data as Logo[];
}

const Experience: React.FC = () => {
  const [logoData, setLogoData] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchLogoData = async () => {
      const result = await getLogoData();
      setLogoData(result);
    };

    fetchLogoData();
  }, []);

  const [rating, setRating] = useState('1');

  const handleRatingChange = (e: any) => {
    setRating(e.target.value);
  };


  // Inside your component
  const router = useRouter();

  const handleNextClick = () => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem('formData');
    const formData = existingData ? JSON.parse(existingData) : {};

    // Update formData with the selected rating
    formData.rating = rating;

    // Save updated formData back to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));

    // Redirect based on rating
    if (['5', '4'].includes(rating)) {
      router.push('/highRatingPage'); // Path for high ratings
    } else {
      router.push('/lowRatingPage'); // Path for low ratings
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.topPartWrapper}>
        <header>
          <img src={logoData[0]?.imageUrl} alt="Logo" />
        </header>
        <h1 className={styles.mainTitle}>WHAT IS YOUR EXPERIENCE WITH OUR PRODUCT?</h1>
        <p className={styles.subTitle}>Please answer the following questions, your feedback Is very valuable to us!</p>
        <div className={styles.textContent}>
          <p>Are you satisfied with our product?</p>
          <p>On a scale from 1 to 5 what do you think of the product. (5 being BEST)</p>
        </div>
        <div>
          <p>Rate Experience</p>
          <select onChange={handleRatingChange} value={rating} className={styles.select}>
            <option value="5">5. Love it</option>
            <option value="4">4. Like it</option>
            <option value="3">3. It's OK</option>
            <option value="2">2. Needs improvement</option>
            <option value="1">1. Don't like it</option>
          </select>
        </div>
        <button onClick={handleNextClick} className={styles.nextButton}>NEXT</button>
      </div>
    </div>
  );
}

export default Experience;