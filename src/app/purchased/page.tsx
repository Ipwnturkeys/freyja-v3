"use client";
import styles from './purchased.module.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../utils/configSanity';

interface IPurchasedPage {
  products: string[];
  title: string;
}

interface Logo {
  imageUrl: string;
}

const options = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache'
};


const getData = async () => {
  const query = `*[_type == 'purchasedProducts'] {
    products,
    title
  }`;

  const data = await client.fetch(query, options);
  return data as IPurchasedPage[];
}

const getLogoData = async () => {
  const query = `*[_type == 'websiteLogos'] {
    "imageUrl": image.asset->url,
  }`;

  const data = await client.fetch(query, options, {next: {
    revalidate: 3600 // look for updates to revalidate cache every hour
  }});
  return data as Logo[];
}

const Begin: React.FC = () => {
  const [data, setData] = useState<IPurchasedPage[]>([]);
  const [logoData, setLogo] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      console.log(result);
      setData(result);
    };

    const fetchLogoData = async () => {
      const result = await getLogoData();
      setLogo(result);
    };

    fetchData();
    fetchLogoData();
  }, []);

  // Inside your component
  const [selectedProduct, setSelectedProduct] = useState('');

  const handleProductChange = (e: any) => {
    setSelectedProduct(e.target.value);
  };

  // Inside your component
  const router = useRouter();

  const handleNextClick = () => {
    const existingData = localStorage.getItem('formData');
    const formData = existingData ? JSON.parse(existingData) : {};

    formData.purchasedProduct = selectedProduct;

    localStorage.setItem('formData', JSON.stringify(formData));

    router.push('/amazon'); // Replace with your next page's path
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.topPartWrapper}>
        <header>
        <img src={logoData[0]?.imageUrl} alt="Logo" />
        </header>
        <h1 className={styles.mainTitle}>
        {data[0]?.title}
        </h1>
        <div className={styles.optionsContainer}>
          <div className={styles.optionHeadline}>Please Select the Product You Bought <span className={styles.hightlighted}>*</span></div>
        </div>
        <select className={styles.select} onChange={handleProductChange}>
          {
            data[0]?.products.map((product, index) => {
              return <option key={index} value={product}>{product}</option>
            })
          }
        </select>
        <button onClick={handleNextClick} className={styles.nextButton}>NEXT</button>
      </div>
    </div>
  );
}

export default Begin;