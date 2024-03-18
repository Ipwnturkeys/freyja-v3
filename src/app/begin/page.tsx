"use client";
import styles from './begin.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../utils/configSanity';

interface IFormPage {
  title: string;
  left: string[];
  rightTitle: string;
  rightBottom: string;
  imageUrl: string;
}

interface IFormPageStep {
  _id: string;
  imageUrl: string;
  title: string;
  text: string;
  _createdAt: string;
}

interface IFormFAQStep {
  title: string;
  text: string;
  _createdAt: string;
}

interface Logo {
  imageUrl: string;
}

const options = {
  'Access-Control-Allow-Origin': '*',
};

const getData = async () => {
  const query = `*[_type == 'formpage'] {
    "imageUrl": backgroundImage.asset->url,
    title,
    left,
    rightTitle,
    rightBottom
  }`;

  const data = await client.fetch(query, options);
  return data as IFormPage[];
}

const getStepData = async (): Promise<IFormPageStep[]> => {
  const query = `*[_type == 'formpageStep'] {
    _id,
    "imageUrl": image.asset->url,
    title,
    text,
    _createdAt
  }`;

  let data: IFormPageStep[] = await client.fetch(query, options);
  // Sort data by _createdAt in ascending order
  data.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());
  return data;
}

const getLogoData = async (): Promise<Logo[]> => {
  const query = `*[_type == 'websiteLogos'] {
    "imageUrl": image.asset->url
  }`;

  let data: Logo[] = await client.fetch(query, options);
  return data;
}

const getFaqData = async (): Promise<IFormFAQStep[]> => {
  const query = `*[_type == 'formpageFaq'] {
    title,
    text,
    _createdAt
  }`;

  let data: IFormFAQStep[] = await client.fetch(query, options);
  // Sort data by _createdAt in ascending order
  data.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());
  return data;
}

const Begin: React.FC = () => {
  const [data, setData] = useState<IFormPage[]>([]);
  const [dataStep, setDataStep] = useState<IFormPageStep[]>([]);
  const [dataFaq, setDataFaq] = useState<IFormFAQStep[]>([]);
  const [logo, setLogo] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      console.log(result);
      setData(result);
    };
    const fetchStepData = async () => {
      const result = await getStepData();
      setDataStep(result);
    };
    const fetchFaqData = async () => {
      const result = await getFaqData();
      setDataFaq(result);
    };
    const fetchLogoData = async () => {
      const result = await getLogoData();
      setLogo(result);
    };

    fetchStepData();
    fetchData();
    fetchFaqData();
    fetchLogoData();
  }, []);


  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Inside your component
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (formData.email && formData.firstName && formData.lastName) {

      // Store the form data in localStorage
      localStorage.setItem('formData', JSON.stringify(formData));

      // Navigate to the next page using Next.js router
      router.push('/purchased'); // Replace with your next page's path
    } else {
      console.log('Please fill all the required fields');
    }
  };

  const imageUrl = data[0]?.imageUrl;

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.topPartWrapper}>
        <header>
          <img src={`${logo[0]?.imageUrl}`} alt="Logo" />
        </header>
        <div className={styles.headline}>
          {data[0]?.title}
        </div>
      </div>
      <div className={styles.secondaryWrapper} style={{backgroundImage: `url(${imageUrl})`}}>
        <div className={styles.layout}>
          <div className={styles.leftSideTextContainer}>
            <div className="bold">{data[0]?.left[0]}</div>
            <div className="bold">{data[0]?.left[1]}</div>
            <div>{data[0]?.left[2]}</div>
          </div>
          <div className={styles.rightSideFormContainer}>
            <p className={styles.formHeader}>{data[0]?.rightTitle}</p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.labelForm}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.labelForm}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.labelForm}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.labelForm}>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <button type="submit">GET MY FREE GIFT</button>
            </form>
            <div className={styles.formBottomContent}>
              *We don’t share your personal info with anyone. By clicking the button above, you’ll get your free gift in addition to getting exclusive access to incredible Amazon deals and offers which we know you’ll love. You can unsubscribe from receiving our emails at any time.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.thirdWrapper}>
        {dataStep.map((step, index) => {
          return (
            <div className={styles.cardWrapper} key={index}>
            <div className={styles.cardHeader}>
              {step.title}
            </div>
            <div className={styles.cardImage}>
              <img src={`${step.imageUrl}`} alt="Card Image" />
            </div>
            <div className={styles.cardContent}>
              {step.text}
            </div>
          </div>
          );
        })};
      </div>

      <div className={styles.fourthWrapper}>
        <h2>FREQUENTLY ASKED QUESTIONS</h2>
        <div className={styles.questionWrapper}>

          {dataFaq.map((question, index) => {
            return (
              <div className={styles.question} key={index}>
              <h3 className={styles.questionHeader}>
                {question.title}
              </h3>
              <div className={styles.questionContent}>
                {question.text}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Begin;