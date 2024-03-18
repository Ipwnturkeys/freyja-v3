"use client";
import styles from './amazon.module.css';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { useRouter } from 'next/navigation';
import { client } from '../utils/configSanity';

const query = qs.stringify({
  populate: {
    'FormBackground': '*', // Top-level image field
    'MainLogo': '*', // Another top-level image field
    'ContentCard': {
      populate: '*',
    },
    'ContentCard2': {
      populate: '*',
    },
    'ContentCard3': {
      populate: '*',
    },
    'Question': '*',
  },
}, {
  encodeValuesOnly: true,
});

const options = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache'
};

type FormPageData = {
    data: {
      id: number,
      attributes: {
        Headline: string;
        FormHeader: string;
        FormBottomContent: string;
        LeftContentText: any[]; // Adjust this based on your content structure
        FormBackground: ImageData;
        MainLogo: ImageData;
        ContentCard: ContentCard // Adjust this based on your content structure
        ContentCard2: ContentCard // Adjust this based on your content structure
        ContentCard3: ContentCard // Adjust this based on your content structure
        Question: any[]
      };
    }[];
  };

type ImageData = {
  data: {
    id: number,
    attributes: {
      url: string;
    };
  } | null;
};

interface TextNode {
    type: 'text';
    text: string;
    bold?: boolean; // Optional property for bold text
  }

  interface Logo {
    imageUrl: string;
  }
  

interface ContentCard {
  Content: string;
  Title: string;
  Image: {
    data: {
      attributes: {
        url: string;
      };
    }
  };
  id?: number;
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

const fetchHomepage = async (): Promise<FormPageData> => {

    const reqOptions = {
      headers: {
        Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
      }
    };
  
    const response = await fetch(`http://127.0.0.1:1337/api/formpages?${query}`, reqOptions);
    const data: FormPageData = await response.json();
  
    return data;
};

const Amazon: React.FC = () => {
  const [logoData, setLogoData] = useState<Logo[]>([]);
  
  useEffect(() => {
    const fetchLogoData = async () => {
      const result = await getLogoData();
      setLogoData(result);
    };

    fetchLogoData();
  }, []);
    
      const [amazonOrderId, setAmazonOrderId] = useState('');
  
      // Regular expression to match the format 111-11111-111111
      const orderIdRegex = /^\d{3}-\d{5}-\d{6}$/;
  
      const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAmazonOrderId(value);
    };
  
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Retrieve existing data from localStorage and update it
        const existingData = localStorage.getItem('formData');
        const formData = existingData ? JSON.parse(existingData) : {};
        
        formData.amazonOrderId = amazonOrderId;

        localStorage.setItem('formData', JSON.stringify(formData));

        // Redirect to the next page using Next.js router
        router.push('/experience');
    };

    const [formpage, setFormpage] = useState<FormPageData | null>(null);

    useEffect(() => {
      fetchHomepage()
        .then(data => {
            setFormpage(data);
        })
        .catch(error => {
          console.error('Error fetching homepage data:', error);
        });
    }, []);
  
    console.log(formpage);

    // Use optional chaining to safely access the image URLs
    const logoUrl = formpage?.data[0]?.attributes?.MainLogo?.data?.attributes?.url;
    const backgroundImageUrl = formpage?.data[0]?.attributes?.FormBackground?.data?.attributes?.url;

    // Create full image URLs
    const fullLogoUrl = logoUrl?.startsWith('/') ? `http://127.0.0.1:1337${logoUrl}` : logoUrl;
    const fullbackgroundImageUrl = backgroundImageUrl?.startsWith('/') ? `http://127.0.0.1:1337${backgroundImageUrl}` : backgroundImageUrl;
    

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.topPartWrapper}>
                <header>
                  <img src={logoData[0]?.imageUrl} alt="Logo" />
                </header>
            </div>
            <div className={styles.amazonWrapper}>
                <div className={styles.leftWrapper}>
                    <h2>LET'S FIND YOUR ORDER!</h2>
                    <p>We need your Amazon purchase order ID to find your order.</p>
                    <p className={styles.secondP}>You can find the order ID by checking your Amazon Account Order History or in the email receipt you gift with your purchase</p>
                    <a className={styles.amzButton} href="https://www.amazon.com/gp/your-account/order-history?ref_=ya_d_c_yo">Click Here to view your amazon purchases & Order Id`s</a>
                </div>
                <div className={styles.rightWrapper}>
                    <h2>ENTER YOUR AMAZON ORDER #</h2>
                    <p>Amazon Order ID <span className={styles.hightlighted}>*</span></p>
                    <form onSubmit={handleSubmit}>
                    <div>
                    <input
                      type="text"
                      value={amazonOrderId}
                      onChange={handleOrderIdChange}
                      placeholder="111-11111-111111"
                      maxLength={16}
                      className={styles.inputSubmit}
                    />
                        <p className={styles.please}>Please Copy & Paste your Order ID and make sure it is correctly formatted.</p>
                        <button className={styles.submitBtn} type="submit">Next</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default Amazon;