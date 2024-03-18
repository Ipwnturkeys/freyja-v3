"use client";
import styles from './index.module.css';
import { useState, useEffect } from 'react';
import { client } from './utils/configSanity';
import { GetStaticProps } from 'next';

interface IHomepage {
  imageUrl: string;
  title: string;
  subtitle: string;
  conditions: string[];
}

interface Logo {
  imageUrl: string;
}

const options = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache'
};

const getData = async () => {
  const query = `*[_type == 'homepage'] {
    "imageUrl": image.asset->url,
    title,
    subtitle,
    conditions
  }`;

  const data = await client.fetch(query, options);
  return data as IHomepage[];
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

const Home: React.FC = () => {
  const [data, setData] = useState<IHomepage[]>([]);
  const [logoData, setLogoData] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      console.log(result);
      setData(result);
    };
    const fetchLogoData = async () => {
      const result = await getLogoData();
      setLogoData(result);
    };

    fetchData();
    fetchLogoData();
  }, []);

  return (
    <div className={styles.mainWrapper}>
      <header>
        <img src={logoData[0]?.imageUrl} alt="Logo" />
      </header>
      <div className={styles.headline}>
        {data[0]?.title}
      </div>
      <div className={styles.mainContent}>
        <div className={styles.leftContent}>
          <img src={`${data[0]?.imageUrl}`} />
        </div>
        <div className={styles.rightContent}>
          <h3>{data[0]?.subtitle}</h3>
          <ul>
            {data[0]?.conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        </div>
      </div>
      <a href="/begin" className={styles.continue}>
        CONTINUE
      </a>
    </div>
  );
};

export default Home;