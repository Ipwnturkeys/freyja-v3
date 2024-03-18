"use client";
import styles from './rating.module.css';
import React, { useEffect, useState, useRef } from 'react';
import { client } from '../utils/configSanity';

interface IHighRatingPage {
    productTitle: string;
    Logo: string;
}

interface Logo {
    imageUrl: string;
  }

  const getData = async () => {
    const query = `*[_type == 'positiveProducts'] {
        productTitle,
        "Logo": image.asset->url
      }`;
  
    const data = await client.fetch(query, options);
    return data as IHighRatingPage[];
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

const highRatingPage: React.FC = () => {
    const [data, setData] = useState<IHighRatingPage[]>([]);
    const [logoData, setLogoData] = useState<Logo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
          };
      const fetchLogoData = async () => {
        const result = await getLogoData();
        setLogoData(result);
      };
  
      fetchData();
      fetchLogoData();
    }, []);

    const [userExperience, setUserExperience] = useState('');
    const [buttonText, setButtonText] = useState('COPY YOUR EXPERIENCE TO THE CLIPBOARD');
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
    const [showFinalInfo, setShowFinalInfo] = useState(false);

    // Ref for the Step 2 container
    const step2Ref = useRef<HTMLInputElement>(null);
    const step3Ref = useRef<HTMLInputElement>(null);


    const handleExperienceChange = (e: any) => {
        setUserExperience(e.target.value);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(userExperience)
            .then(() => {
                setButtonText('Copied!');
                setShowAdditionalContent(true); // Show additional content
                setTimeout(() => setButtonText('Copy Text'), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    // useEffect to scroll to Step 2 when it becomes visible
    useEffect(() => {
        if (showAdditionalContent && step2Ref.current) {
            step2Ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAdditionalContent]);

    const [address, setAddress] = useState({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'Select Country'
    });

    const handleSubmit = async (event: any) => {
        event.preventDefault();
    
        // Check if required fields are filled
        if (!address.address1 || !address.city || !address.state || !address.zip || address.country === 'Select Country') {
            alert("Please fill in all required fields."); // Replace with a better error handling
            return;
        }

        const moreData = JSON.parse(localStorage.getItem('formData') || '{}');
    
        // Compile the data to be submitted
        const formData = {
            ...address,
            selectedProduct,
            moreData
        };
    
        // Fetch API to submit the form data to your API endpoint
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            if (response.ok) {
                // Handle successful submission here
                console.log('Data submitted successfully:', data);
                alert('Data submitted successfully');
            } else {
                // Handle errors here
                console.error('Submission failed:', data.message);
                alert('Submission failed: ' + data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred, please try again.');
        }
    };

const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setAddress(prevAddress => {
        const updatedAddress = { ...prevAddress, [name]: value };
        return updatedAddress;
    });
};

const handleShowFinalInfo = () => {
    setShowFinalInfo(true);
};

useEffect(() => {
    if (showFinalInfo && step3Ref.current) {
        step3Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
}, [showFinalInfo]);

    const [selectedProduct, setSelectedProduct] = useState('');

    const handleProductSelect = (productName: any) => {
        setSelectedProduct(productName);
        localStorage.setItem('selectedProduct', productName);
    };

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.topPartWrapper}>
                <header>
                    <img src={logoData[0]?.imageUrl} alt="Logo" />
                </header>
                <h1 className={styles.mainTitle}>
                    DESCRIBE HOW OUR PRODUCT IS WORKING FOR YOU
                </h1>
                <p>Please be specific and talk about the condition you had and how our product helped you.</p>
                <h2>
                    STEP 1
                </h2>
                <p>Please share with us your experience with the product you purchased?(Please be detailed it helps us improve our products)</p>
                <p>Type Your Experience Here</p>
                <textarea
                    value={userExperience}
                    onChange={handleExperienceChange}
                    className={styles.experienceTextArea}
                    placeholder="Share your experience here"
                    rows={5}
                ></textarea>
                <button onClick={handleCopyToClipboard} className={styles.copyButton}>
                    {buttonText}
                </button>

                {showAdditionalContent && (
                    <div ref={step2Ref}>
                        <h2>STEP 2</h2>
                        <h3 className={styles.textCenter}>SHARE YOUR EXPERIENCE WITH OUR PRODUCT</h3>
                        <p className={styles.textCenter}>It would really mean the world to us if you could take a few seconds to post your experience to help future customers.</p>
                        <a className={styles.postReview} target="_blank" href="https://www.amazon.com/ap/signin?clientContext=133-0442834-5614905&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Freview%2Fcreate-review%2Fthankyou&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_scarface_mobile_us&openid.mode=checkid_setup&marketPlaceId=ATVPDKIKX0DER&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=Amazon&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=3600&siteState=clientContext%3D143-6238204-1142401%2CsourceUrl%3Dhttps%253A%252F%252Fwww.amazon.com%252Freview%252Fcreate-review%252Fthankyou%2Csignature%3DqruUtxXu06STNtQaM8d6ifoW3mEj3D">CLICK HERE TO POST YOUR REVIEW</a>
                        <img className={styles.amazonImg} src={`/static/images/ama2_dc2fa4e15d.webp`} alt="Logo" />
                        <h3 className={styles.textCenter2}>PLEASE RETURN TO THIS PAGE AFTER YOU FINISH</h3>
                        <h2>STEP 3</h2>
                        <p className={styles.textCenter}>Once you have shared your experience, just click on the button below to confirm your shipping address and complete your request</p>
                        <button onClick={handleShowFinalInfo} className={styles.copyButton}>
                            CONTINUE WITH YOUR REQUEST
                        </button>
                        {showFinalInfo && (
                            <div ref={step3Ref}>
                                <p>Choose your Free GIFT *</p>
                                <div className={styles.products}>
                                    {
                                        data.map((product, index) => {
                                            return (
                                                <div key={index} className={`${styles.product} ${selectedProduct === `${product.productTitle}` ? 'selected-product' : ''}`} onClick={() => handleProductSelect(`${product.productTitle}`)}>
                                                    <img src={`${product.Logo}`} alt="26' X 4.0 Fat Tube" />
                                                    <p>{product.productTitle}</p>
                                                    {selectedProduct === `${product.productTitle}` && <div className='checkmark'>✔</div>}
                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                {/* Address Form */}
                                <h4>Complete your address:</h4>
                                <form onSubmit={handleSubmit} className={styles.mainForm}>
                                    <input className="w-100" type="text" name="address1" value={address.address1} onChange={handleAddressChange} placeholder="Street Address" />
                                    <input className="w-100" type="text" name="address2" value={address.address2} onChange={handleAddressChange} placeholder="Street Address 2" />
                                    <div className={styles.details}>
                                        <input className="flex grow" type="text" name="city" value={address.city} onChange={handleAddressChange} placeholder="City" />
                                        <input className="flex grow" type="text" name="state" value={address.state} onChange={handleAddressChange} placeholder="State / Province" />
                                        <input className="flex grow" type="text" name="zip" value={address.zip} onChange={handleAddressChange} placeholder="Zip / Postal" />
                                    </div>
                                    <select name="country" value={address.country} onChange={handleAddressChange}>
                                        <option value="Afghanistan"> Afghanistan</option><option value="Aland Islands"> Aland Islands</option><option value="Albania"> Albania</option><option value="Algeria"> Algeria</option><option value="American Samoa"> American Samoa</option><option value="Andorra"> Andorra</option><option value="Angola"> Angola</option><option value="Anguilla"> Anguilla</option><option value="Antarctica"> Antarctica</option><option value="Antigua and Barbuda"> Antigua and Barbuda</option><option value="Argentina"> Argentina</option><option value="Armenia"> Armenia</option><option value="Aruba"> Aruba</option><option value="Australia"> Australia</option><option value="Austria"> Austria</option><option value="Azerbaijan"> Azerbaijan</option><option value="Bahamas"> Bahamas</option><option value="Bahrain"> Bahrain</option><option value="Bangladesh"> Bangladesh</option><option value="Barbados"> Barbados</option><option value="Belarus"> Belarus</option><option value="Belgium"> Belgium</option><option value="Belize"> Belize</option><option value="Benin"> Benin</option><option value="Bermuda"> Bermuda</option><option value="Bhutan"> Bhutan</option><option value="Bolivia"> Bolivia</option><option value="Bonaire, Sint Eustatius and Saba"> Bonaire, Sint Eustatius and Saba</option><option value="Bosnia and Herzegovina"> Bosnia and Herzegovina</option><option value="Botswana"> Botswana</option><option value="Bouvet Island"> Bouvet Island</option><option value="Brazil"> Brazil</option><option value="British Indian Ocean Territory"> British Indian Ocean Territory</option><option value="Brunei"> Brunei</option><option value="Bulgaria"> Bulgaria</option><option value="Burkina Faso"> Burkina Faso</option><option value="Burundi"> Burundi</option><option value="Côte d'Ivoire"> Côte d'Ivoire</option><option value="Cambodia"> Cambodia</option><option value="Cameroon"> Cameroon</option><option value="Canada"> Canada</option><option value="Cape Verde"> Cape Verde</option><option value="Cayman Islands"> Cayman Islands</option><option value="Central African Republic"> Central African Republic</option><option value="Chad"> Chad</option><option value="Chile"> Chile</option><option value="China"> China</option><option value="Christmas Island"> Christmas Island</option><option value="Cocos (Keeling) Islands"> Cocos (Keeling) Islands</option><option value="Colombia"> Colombia</option><option value="Comoros"> Comoros</option><option value="Congo"> Congo</option><option value="Cook Islands"> Cook Islands</option><option value="Costa Rica"> Costa Rica</option><option value="Croatia"> Croatia</option><option value="Cuba"> Cuba</option><option value="Curacao"> Curacao</option><option value="Cyprus"> Cyprus</option><option value="Czech Republic"> Czech Republic</option><option value="Denmark"> Denmark</option><option value="Djibouti"> Djibouti</option><option value="Dominica"> Dominica</option><option value="Dominican Republic"> Dominican Republic</option><option value="East Timor"> East Timor</option><option value="Ecuador"> Ecuador</option><option value="Egypt"> Egypt</option><option value="El Salvador"> El Salvador</option><option value="Equatorial Guinea"> Equatorial Guinea</option><option value="Eritrea"> Eritrea</option><option value="Estonia"> Estonia</option><option value="Ethiopia"> Ethiopia</option><option value="Falkland Islands (Malvinas)"> Falkland Islands (Malvinas)</option><option value="Faroe Islands"> Faroe Islands</option><option value="Fiji"> Fiji</option><option value="Finland"> Finland</option><option value="France"> France</option><option value="French Guiana"> French Guiana</option><option value="French Polynesia"> French Polynesia</option><option value="French Southern Territories"> French Southern Territories</option><option value="Gabon"> Gabon</option><option value="Gambia"> Gambia</option><option value="Georgia"> Georgia</option><option value="Germany"> Germany</option><option value="Ghana"> Ghana</option><option value="Gibraltar"> Gibraltar</option><option value="Greece"> Greece</option><option value="Greenland"> Greenland</option><option value="Grenada"> Grenada</option><option value="Guadeloupe"> Guadeloupe</option><option value="Guam"> Guam</option><option value="Guatemala"> Guatemala</option><option value="Guernsey"> Guernsey</option><option value="Guinea"> Guinea</option><option value="Guinea-Bissau"> Guinea-Bissau</option><option value="Guyana"> Guyana</option><option value="Haiti"> Haiti</option><option value="Heard Island and McDonald Islands"> Heard Island and McDonald Islands</option><option value="Holy See"> Holy See</option><option value="Honduras"> Honduras</option><option value="Hong Kong"> Hong Kong</option><option value="Hungary"> Hungary</option><option value="Iceland"> Iceland</option><option value="India"> India</option><option value="Indonesia"> Indonesia</option><option value="Iran"> Iran</option><option value="Iraq"> Iraq</option><option value="Ireland"> Ireland</option><option value="Isle of Man"> Isle of Man</option><option value="Israel"> Israel</option><option value="Italy"> Italy</option><option value="Jamaica"> Jamaica</option><option value="Japan"> Japan</option><option value="Jersey"> Jersey</option><option value="Jordan"> Jordan</option><option value="Kazakhstan"> Kazakhstan</option><option value="Kenya"> Kenya</option><option value="Kiribati"> Kiribati</option><option value="Kosovo"> Kosovo</option><option value="Kuwait"> Kuwait</option><option value="Kyrgyzstan"> Kyrgyzstan</option><option value="Laos"> Laos</option><option value="Latvia"> Latvia</option><option value="Lebanon"> Lebanon</option><option value="Lesotho"> Lesotho</option><option value="Liberia"> Liberia</option><option value="Libya"> Libya</option><option value="Liechtenstein"> Liechtenstein</option><option value="Lithuania"> Lithuania</option><option value="Luxembourg"> Luxembourg</option><option value="Macao"> Macao</option><option value="Macedonia"> Macedonia</option><option value="Madagascar"> Madagascar</option><option value="Malawi"> Malawi</option><option value="Malaysia"> Malaysia</option><option value="Maldives"> Maldives</option><option value="Mali"> Mali</option><option value="Malta"> Malta</option><option value="Marshall Islands"> Marshall Islands</option><option value="Martinique"> Martinique</option><option value="Mauritania"> Mauritania</option><option value="Mauritius"> Mauritius</option><option value="Mayotte"> Mayotte</option><option value="Mexico"> Mexico</option><option value="Micronesia"> Micronesia</option><option value="Moldova"> Moldova</option><option value="Monaco"> Monaco</option><option value="Mongolia"> Mongolia</option><option value="Montenegro"> Montenegro</option><option value="Montserrat"> Montserrat</option><option value="Morocco"> Morocco</option><option value="Mozambique"> Mozambique</option><option value="Myanmar"> Myanmar</option><option value="Namibia"> Namibia</option><option value="Nauru"> Nauru</option><option value="Nepal"> Nepal</option><option value="Netherlands"> Netherlands</option><option value="New Caledonia"> New Caledonia</option><option value="New Zealand"> New Zealand</option><option value="Nicaragua"> Nicaragua</option><option value="Niger"> Niger</option><option value="Nigeria"> Nigeria</option><option value="Niue"> Niue</option><option value="Norfolk Island"> Norfolk Island</option><option value="North Korea"> North Korea</option><option value="Northern Mariana Islands"> Northern Mariana Islands</option><option value="Norway"> Norway</option><option value="Oman"> Oman</option><option value="Pakistan"> Pakistan</option><option value="Palau"> Palau</option><option value="Palestine"> Palestine</option><option value="Panama"> Panama</option><option value="Papua New Guinea"> Papua New Guinea</option><option value="Paraguay"> Paraguay</option><option value="Peru"> Peru</option><option value="Philippines"> Philippines</option><option value="Pitcairn"> Pitcairn</option><option value="Poland"> Poland</option><option value="Portugal"> Portugal</option><option value="Puerto Rico"> Puerto Rico</option><option value="Qatar"> Qatar</option><option value="Reunion"> Reunion</option><option value="Romania"> Romania</option><option value="Russia"> Russia</option><option value="Rwanda"> Rwanda</option><option value="Saint Barthelemy"> Saint Barthelemy</option><option value="Saint Helena, Ascension and Tristan da Cunha"> Saint Helena, Ascension and Tristan da Cunha</option><option value="Saint Kitts and Nevis"> Saint Kitts and Nevis</option><option value="Saint Lucia"> Saint Lucia</option><option value="Saint Martin (French part)"> Saint Martin (French part)</option><option value="Saint Pierre and Miquelon"> Saint Pierre and Miquelon</option><option value="Saint Vincent and the Grenadines"> Saint Vincent and the Grenadines</option><option value="Samoa"> Samoa</option><option value="San Marino"> San Marino</option><option value="Sao Tome and Principe"> Sao Tome and Principe</option><option value="Saudi Arabia"> Saudi Arabia</option><option value="Senegal"> Senegal</option><option value="Serbia"> Serbia</option><option value="Seychelles"> Seychelles</option><option value="Sierra Leone"> Sierra Leone</option><option value="Singapore"> Singapore</option><option value="Sint Maarten (Dutch part)"> Sint Maarten (Dutch part)</option><option value="Slovakia"> Slovakia</option><option value="Slovenia"> Slovenia</option><option value="Solomon Islands"> Solomon Islands</option><option value="Somalia"> Somalia</option><option value="South Africa"> South Africa</option><option value="South Georgia and the South Sandwich Islands"> South Georgia and the South Sandwich Islands</option><option value="South Korea"> South Korea</option><option value="South Sudan"> South Sudan</option><option value="Spain"> Spain</option><option value="Sri Lanka"> Sri Lanka</option><option value="Sudan"> Sudan</option><option value="Suriname"> Suriname</option><option value="Svalbard and Jan Mayen"> Svalbard and Jan Mayen</option><option value="Swaziland"> Swaziland</option><option value="Sweden"> Sweden</option><option value="Switzerland"> Switzerland</option><option value="Syria"> Syria</option><option value="Taiwan"> Taiwan</option><option value="Tajikistan"> Tajikistan</option><option value="Tanzania"> Tanzania</option><option value="Thailand"> Thailand</option><option value="Timor-Leste"> Timor-Leste</option><option value="Togo"> Togo</option><option value="Tokelau"> Tokelau</option><option value="Tonga"> Tonga</option><option value="Trinidad and Tobago"> Trinidad and Tobago</option><option value="Tunisia"> Tunisia</option><option value="Turkey"> Turkey</option><option value="Turkmenistan"> Turkmenistan</option><option value="Turks and Caicos Islands"> Turks and Caicos Islands</option><option value="Tuvalu"> Tuvalu</option><option value="Uganda"> Uganda</option><option value="Ukraine"> Ukraine</option><option value="United Arab Emirates"> United Arab Emirates</option><option value="United Kingdom"> United Kingdom</option><option value="United States"> United States</option><option value="United States Minor Outlying Islands"> United States Minor Outlying Islands</option><option value="Uruguay"> Uruguay</option><option value="Uzbekistan"> Uzbekistan</option><option value="Vanuatu"> Vanuatu</option><option value="Vatican City"> Vatican City</option><option value="Venezuela"> Venezuela</option><option value="Vietnam"> Vietnam</option><option value="Virgin Islands, British"> Virgin Islands, British</option><option value="Virgin Islands, U.S."> Virgin Islands, U.S.</option><option value="Wallis and Futuna"> Wallis and Futuna</option><option value="Western Sahara"> Western Sahara</option><option value="Yemen"> Yemen</option><option value="Zambia"> Zambia</option><option value="Zimbabwe"> Zimbabwe</option>
                                    </select>
                                    <button type="submit" className={styles.nextButton2} onSubmit={handleSubmit}>Next</button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default highRatingPage;