/**
 * diseases.js — single source of truth for all disease data
 *
 * DISEASES_BY_LETTER  — { A: [...names], B: [...], ... }
 * DISEASE_DETAILS     — { 'Disease Name': { description, symptoms, treatment, specialist } }
 * ALL_DISEASES        — flat sorted array for full-text search
 * getByLetter()       — async fetch by letter (swap for real API)
 * searchDiseases()    — async full-text search (swap for real API)
 * getDiseaseDetail()  — returns detail object for a disease name
 */

// ─── A–Z name lists ───────────────────────────────────────────
export const DISEASES_BY_LETTER = {
  A: [
    'Abdominal Aortic Aneurysm','Acne','Acoustic Neuroma','Acute Kidney Injury',
    'Acute Pancreatitis',"Addison's Disease",'ADHD (Attention Deficit Hyperactivity Disorder)',
    'Age-related Macular Degeneration','Agoraphobia','Alcoholic Liver Disease',
    'Allergic Rhinitis',"Alzheimer's Disease",'Amyloidosis','Anemia','Angina',
    'Ankylosing Spondylitis','Anxiety Disorders','Aortic Stenosis','Appendicitis',
    'Arrhythmia','Arthritis (Osteoarthritis)','Arthritis (Rheumatoid)','Asthma',
    'Atrial Fibrillation','Autism Spectrum Disorder','Autoimmune Hepatitis',
  ],
  B: [
    'Back Pain (Acute)','Back Pain (Chronic)','Bacterial Endocarditis','Bacterial Meningitis',
    'Basal Cell Carcinoma',"Bell's Palsy",'Benign Prostatic Hyperplasia','Bipolar Disorder',
    'Bladder Cancer','Bladder Infections (UTI)','Blood Clots (DVT)',
    'Blood Pressure (High / Hypertension)','Blood Pressure (Low / Hypotension)',
    'Bone Cancer','Bone Fractures','Brain Abscess','Brain Tumor','Breast Cancer',
    'Bronchiectasis','Bronchitis (Acute)','Bronchitis (Chronic)','Bulging Disc','Burns','Bursitis',
  ],
  C: [
    'Cancer (General)','Cardiac Arrest','Cardiac Tamponade','Cardiomyopathy',
    'Carpal Tunnel Syndrome','Cataracts','Celiac Disease','Cerebral Palsy',
    'Cervical Cancer','Cervical Spondylosis','Cholecystitis','Chronic Fatigue Syndrome',
    'Chronic Kidney Disease','Chronic Obstructive Pulmonary Disease (COPD)',
    'Cirrhosis of the Liver','Cleft Palate','Colorectal Cancer','Congenital Heart Disease',
    'Conjunctivitis','Coronary Artery Disease',"Crohn's Disease","Cushing's Syndrome",'Cystic Fibrosis',
  ],
  D: [
    'Deep Vein Thrombosis (DVT)','Dementia','Dengue Fever','Depression',
    'Dermatitis (Atopic)','Dermatitis (Contact)','Diabetes Insipidus',
    'Diabetes Mellitus Type 1','Diabetes Mellitus Type 2','Diabetic Neuropathy',
    'Diabetic Retinopathy','Dialysis-related Complications','Disc Herniation',
    'Diverticulitis','Down Syndrome','Drug-induced Liver Injury','Dyslipidemia',
    'Dysphagia','Dysthymia (Persistent Depressive Disorder)',
  ],
  E: [
    'Ear Infections (Otitis Media)','Eating Disorders (Anorexia / Bulimia)','Eczema',
    'Emphysema','Encephalitis','Endocarditis','Endometrial Cancer','Endometriosis',
    'Epilepsy','Erectile Dysfunction','Esophageal Cancer','Esophageal Varices','Eye Disorders (General)',
  ],
  F: [
    'Fatty Liver Disease (NAFLD)','Femoral Hernia','Fibroids (Uterine)','Fibromyalgia',
    'Fistula (Anal)','Fistula (Arteriovenous)','Flat Feet','Flu (Influenza)','Foot Drop',
    'Fractures (Stress)','Fractures (Traumatic)','Frozen Shoulder (Adhesive Capsulitis)',
    'Fungal Infections','Fever (Typhoid)',
  ],
  G: [
    'Gallbladder Cancer','Gallstones (Cholelithiasis)','Gangrene','Gastric Cancer',
    'Gastritis','Gastroenteritis','Gastroesophageal Reflux Disease (GERD)',
    "Gaucher's Disease",'Glaucoma','Glomerulonephritis','Gout','Growth Disorders',
    'Guillain-Barré Syndrome','Gynecological Cancers',
  ],
  H: [
    'Head and Neck Cancer','Heart Attack (Myocardial Infarction)','Heart Failure (Congestive)',
    'Hemophilia','Hepatitis A','Hepatitis B','Hepatitis C','Hernia (Hiatal)',
    'Hernia (Inguinal)','Hernia (Umbilical)','Hip Dysplasia','Hip Replacement (Post-surgical)',
    'HIV / AIDS',"Hodgkin's Lymphoma",'Hydrocephalus','Hyperthyroidism',
    'Hypertrophic Cardiomyopathy','Hypothyroidism','Hypertension',
  ],
  I: [
    'Immune Disorders','Infections (Bacterial)','Infections (Fungal)','Infections (Viral)',
    'Infertility (Female)','Infertility (Male)','Inflammatory Bowel Disease (IBD)',
    'Insomnia','Interstitial Lung Disease','Intestinal Obstruction',
    'Irritable Bowel Syndrome (IBS)','Ischemic Stroke','IVF Complications',
  ],
  J: [
    'Jaundice','Jaw Disorders (TMJ)','Joint Infections (Septic Arthritis)',
    'Joint Replacement (Hip)','Joint Replacement (Knee)','Juvenile Arthritis','Juvenile Diabetes',
  ],
  K: [
    'Keloid Scars','Kidney Cancer (Renal Cell Carcinoma)','Kidney Failure (Acute)',
    'Kidney Failure (Chronic)','Kidney Stones (Nephrolithiasis)',
    'Knee Ligament Injuries (ACL/PCL)','Knee Replacement (Post-surgical)','Kyphosis',
  ],
  L: [
    'Laryngeal Cancer','Leg Ulcers','Leukemia (ALL)','Leukemia (CLL)','Leukemia (CML)',
    'Ligament Tears','Liver Cancer (Hepatocellular Carcinoma)','Liver Cirrhosis',
    'Low Back Pain','Lung Cancer','Lupus (Systemic Lupus Erythematosus)','Lymphedema',
    "Lymphoma (Non-Hodgkin's)",
  ],
  M: [
    'Macular Degeneration','Malaria','Marfan Syndrome','Melanoma','Meningitis',
    'Menopause Disorders','Metabolic Syndrome','Migraine','Motor Neuron Disease',
    'Multiple Myeloma','Multiple Sclerosis','Muscular Dystrophy','Myasthenia Gravis',
    'Myocardial Infarction','Mental Health Disorders',
  ],
  N: [
    'Narcolepsy','Nasal Polyps','Neck Pain','Neonatal Disorders','Nephritis',
    'Nerve Damage (Peripheral Neuropathy)','Neurological Disorders','Non-Hodgkin Lymphoma',
    'Neuropathy (Diabetic)','Nutritional Deficiencies',
  ],
  O: [
    'Obesity','Obstructive Sleep Apnea','Oral Cancer','Organ Failure (Multi-organ)',
    'Orthopedic Injuries','Osteoarthritis','Osteomyelitis','Osteoporosis',
    'Otitis Media','Ovarian Cancer','Ovarian Cysts',
  ],
  P: [
    'Pancreatitis (Acute)','Pancreatitis (Chronic)',"Parkinson's Disease",
    'PCOS (Polycystic Ovary Syndrome)','Pelvic Inflammatory Disease','Peptic Ulcer Disease',
    'Peripheral Artery Disease','Peritonitis','Pituitary Tumors','Pleural Effusion',
    'Pneumonia','Pneumothorax','Prostate Cancer','Psoriasis','Psoriatic Arthritis',
    'Pulmonary Embolism','Pulmonary Fibrosis','Pulmonary Hypertension',
  ],
  Q: ['Q Fever','Quadriplegia'],
  R: [
    'Rectal Cancer','Renal Failure','Respiratory Failure','Retinal Detachment',
    'Rhabdomyolysis','Rheumatoid Arthritis','Rickets','Rotator Cuff Tear',
  ],
  S: [
    'Sarcoidosis','Schizophrenia','Scoliosis','Sepsis','Sickle Cell Disease',
    'Sinusitis','Skin Cancer (Basal Cell)','Skin Cancer (Melanoma)','Skin Cancer (Squamous Cell)',
    'Sleep Apnea','Sleep Disorders','Spinal Cord Injury','Spine Disorders',
    'Stomach Cancer (Gastric)','Stress Disorders','Stroke (Hemorrhagic)','Stroke (Ischemic)',
    'Systemic Lupus Erythematosus',
  ],
  T: [
    'Tendinitis','Testicular Cancer','Thalassemia','Thyroid Cancer','Thyroid Disorders',
    'Tonsillitis','Trauma Injuries','Tuberculosis (TB)','Tumors (Brain)','Tumors (Spinal)',
    'Type 2 Diabetes',
  ],
  U: [
    'Ulcerative Colitis','Urinary Incontinence','Urinary Tract Infection (UTI)',
    'Urological Disorders','Uterine Cancer','Uterine Fibroids',
  ],
  V: [
    'Varicose Veins','Vascular Disorders','Vertigo','Viral Hepatitis','Vision Loss',
    'Vitamin B12 Deficiency','Vitamin D Deficiency','Vocal Cord Disorders',
  ],
  W: ["Weight Disorders (Obesity)","Wilson's Disease",'Wound Infections','Wrist Fractures'],
  X: ['X-linked Disorders','Xeroderma Pigmentosum'],
  Y: ['Yellow Fever'],
  Z: ['Zika Virus','Zinc Deficiency'],
}

// ─── Detail data ──────────────────────────────────────────────
// Each entry: { description, symptoms: [], treatment: [], specialist }
// Add more entries following the same pattern.
export const DISEASE_DETAILS = {
  'Abdominal Aortic Aneurysm': {
    description: 'A bulge or swelling in the aorta, the main blood vessel running from the heart through the abdomen. It can be life-threatening if it ruptures.',
    symptoms: ['Pulsating sensation near the navel','Deep constant pain in abdomen or back','Sudden severe abdominal or back pain (if rupturing)','Dizziness or rapid heartbeat'],
    treatment: ['Regular monitoring with ultrasound for small aneurysms','Surgical repair (open or endovascular) for large aneurysms','Blood pressure and cholesterol management','Smoking cessation'],
    specialist: 'Vascular Surgeon',
  },
  'Acne': {
    description: 'A common skin condition where hair follicles become clogged with oil and dead skin cells, causing pimples, blackheads, and whiteheads.',
    symptoms: ['Whiteheads and blackheads','Pimples and pustules','Nodules or cysts','Oily skin','Scarring in severe cases'],
    treatment: ['Topical retinoids and benzoyl peroxide','Oral antibiotics for moderate-severe acne','Hormonal therapy for women','Isotretinoin for severe cystic acne','Chemical peels and laser therapy'],
    specialist: 'Dermatologist',
  },
  'Acute Kidney Injury': {
    description: 'A sudden episode of kidney failure or damage that happens within a few hours or days, causing waste to build up in the blood.',
    symptoms: ['Decreased urine output','Fluid retention and swelling','Shortness of breath','Fatigue and confusion','Nausea and chest pain'],
    treatment: ['Hospitalization and IV fluids','Dialysis in severe cases','Treating the underlying cause','Medications to control potassium and phosphate','Dietary restrictions on protein and salt'],
    specialist: 'Nephrologist',
  },
  'Acute Pancreatitis': {
    description: 'Sudden inflammation of the pancreas that can range from mild discomfort to a severe, life-threatening illness.',
    symptoms: ['Severe upper abdominal pain radiating to the back','Nausea and vomiting','Fever','Rapid pulse','Tender abdomen'],
    treatment: ['Hospitalization with IV fluids and pain relief','Fasting to rest the pancreas','Antibiotics if infection is present','ERCP to remove gallstones','Surgery in severe cases'],
    specialist: 'Gastroenterologist',
  },
  'Asthma': {
    description: 'A chronic respiratory condition where airways narrow, swell, and produce extra mucus, making breathing difficult.',
    symptoms: ['Shortness of breath','Chest tightness or pain','Wheezing when exhaling','Coughing attacks (especially at night)','Trouble sleeping due to breathing difficulty'],
    treatment: ['Short-acting bronchodilators (rescue inhalers)','Inhaled corticosteroids for long-term control','Leukotriene modifiers','Biologic therapy for severe asthma','Avoiding triggers like allergens and smoke'],
    specialist: 'Pulmonologist',
  },
  'Diabetes Mellitus Type 2': {
    description: 'A chronic condition affecting how the body processes blood sugar (glucose), where cells become resistant to insulin.',
    symptoms: ['Increased thirst and frequent urination','Unexplained weight loss','Fatigue','Blurred vision','Slow-healing sores','Frequent infections'],
    treatment: ['Lifestyle changes: diet and exercise','Metformin and other oral medications','Insulin therapy when needed','Blood sugar monitoring','Regular HbA1c checks'],
    specialist: 'Endocrinologist / Diabetologist',
  },
  'Hypertension': {
    description: 'A condition where the force of blood against artery walls is consistently too high, increasing risk of heart disease and stroke.',
    symptoms: ['Often no symptoms (silent killer)','Headaches','Shortness of breath','Nosebleeds','Chest pain in severe cases'],
    treatment: ['Lifestyle changes: low-salt diet, exercise, weight loss','ACE inhibitors, ARBs, beta-blockers','Calcium channel blockers','Diuretics','Regular blood pressure monitoring'],
    specialist: 'Cardiologist / General Physician',
  },
  'Heart Attack (Myocardial Infarction)': {
    description: 'Occurs when blood flow to part of the heart is blocked, causing heart muscle damage. A medical emergency requiring immediate treatment.',
    symptoms: ['Chest pain or pressure','Pain radiating to arm, jaw, or back','Shortness of breath','Cold sweat and nausea','Lightheadedness'],
    treatment: ['Emergency angioplasty (PCI) or thrombolysis','Aspirin and antiplatelet therapy','Beta-blockers and ACE inhibitors','Cardiac rehabilitation','Lifestyle modifications'],
    specialist: 'Cardiologist',
  },
  'Stroke (Ischemic)': {
    description: 'Occurs when a blood clot blocks a blood vessel in the brain, cutting off blood supply and causing brain cell death.',
    symptoms: ['Sudden numbness or weakness in face, arm, or leg','Confusion and trouble speaking','Vision problems in one or both eyes','Severe headache with no known cause','Loss of balance or coordination'],
    treatment: ['tPA (clot-busting drug) within 4.5 hours','Mechanical thrombectomy','Blood thinners to prevent recurrence','Blood pressure and cholesterol management','Rehabilitation therapy'],
    specialist: 'Neurologist',
  },
  'Arthritis (Osteoarthritis)': {
    description: 'A degenerative joint disease where cartilage breaks down, causing bones to rub together, leading to pain and stiffness.',
    symptoms: ['Joint pain and stiffness','Tenderness when pressing on the joint','Loss of flexibility','Grating sensation','Bone spurs around the joint'],
    treatment: ['Pain relievers (NSAIDs, acetaminophen)','Physical therapy and exercise','Weight management','Corticosteroid injections','Joint replacement surgery in severe cases'],
    specialist: 'Orthopaedic Surgeon / Rheumatologist',
  },
  'Arthritis (Rheumatoid)': {
    description: 'An autoimmune disease where the immune system attacks the joints, causing inflammation, pain, and eventual joint damage.',
    symptoms: ['Tender, warm, swollen joints','Joint stiffness (worse in the morning)','Fatigue and fever','Loss of joint function','Rheumatoid nodules under the skin'],
    treatment: ['DMARDs (methotrexate, hydroxychloroquine)','Biologic agents (TNF inhibitors)','NSAIDs for pain relief','Corticosteroids','Physical and occupational therapy'],
    specialist: 'Rheumatologist',
  },
  'Breast Cancer': {
    description: 'Cancer that forms in the cells of the breasts, most commonly in the ducts or lobules. One of the most common cancers in women.',
    symptoms: ['Lump in the breast or underarm','Change in breast size or shape','Nipple discharge or inversion','Skin dimpling or redness','Persistent breast pain'],
    treatment: ['Surgery (lumpectomy or mastectomy)','Radiation therapy','Chemotherapy','Hormone therapy (for hormone receptor-positive cancers)','Targeted therapy (HER2-positive cancers)'],
    specialist: 'Oncologist / Surgical Oncologist',
  },
  'Lung Cancer': {
    description: 'Cancer that begins in the lungs, most often in people who smoke. Two main types: non-small cell and small cell lung cancer.',
    symptoms: ['Persistent cough that worsens','Coughing up blood','Chest pain','Shortness of breath','Unexplained weight loss','Hoarseness'],
    treatment: ['Surgery to remove tumor','Chemotherapy and radiation','Targeted therapy for specific mutations','Immunotherapy','Palliative care for advanced stages'],
    specialist: 'Pulmonologist / Oncologist',
  },
  'Kidney Stones (Nephrolithiasis)': {
    description: 'Hard deposits of minerals and salts that form inside the kidneys and can cause severe pain when passing through the urinary tract.',
    symptoms: ['Severe pain in the side and back','Pain radiating to lower abdomen','Painful urination','Pink, red, or brown urine','Nausea and vomiting','Frequent urination'],
    treatment: ['Drinking plenty of water to pass small stones','Pain medications','Alpha-blockers to relax ureter muscles','Lithotripsy (shock wave treatment)','Ureteroscopy or surgery for large stones'],
    specialist: 'Urologist / Nephrologist',
  },
  'Migraine': {
    description: 'A neurological condition causing intense, debilitating headaches often accompanied by nausea, vomiting, and sensitivity to light and sound.',
    symptoms: ['Throbbing or pulsing headache (usually one side)','Nausea and vomiting','Sensitivity to light and sound','Visual disturbances (aura)','Dizziness'],
    treatment: ['Triptans and pain relievers for acute attacks','Preventive medications (beta-blockers, topiramate)','CGRP antagonists','Avoiding triggers (stress, certain foods)','Botox injections for chronic migraine'],
    specialist: 'Neurologist',
  },
  "Parkinson's Disease": {
    description: 'A progressive nervous system disorder affecting movement, caused by loss of dopamine-producing neurons in the brain.',
    symptoms: ['Tremors (shaking) at rest','Slowed movement (bradykinesia)','Rigid muscles','Impaired posture and balance','Loss of automatic movements','Speech changes'],
    treatment: ['Levodopa/carbidopa (most effective medication)','Dopamine agonists','MAO-B inhibitors','Deep brain stimulation (DBS) surgery','Physical and speech therapy'],
    specialist: 'Neurologist',
  },
  'Tuberculosis (TB)': {
    description: 'A serious infectious disease caused by Mycobacterium tuberculosis, primarily affecting the lungs but can spread to other organs.',
    symptoms: ['Persistent cough lasting 3+ weeks','Coughing up blood','Chest pain','Unintentional weight loss','Fatigue and night sweats','Fever'],
    treatment: ['6-month course of antibiotics (isoniazid, rifampicin, pyrazinamide, ethambutol)','Directly Observed Therapy (DOT)','Drug-resistant TB requires longer treatment','Isolation during infectious period','Nutritional support'],
    specialist: 'Pulmonologist / Infectious Disease Specialist',
  },
  'Pneumonia': {
    description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.',
    symptoms: ['Chest pain when breathing or coughing','Confusion (in older adults)','Cough with phlegm','Fatigue','Fever, sweating, and chills','Shortness of breath'],
    treatment: ['Antibiotics for bacterial pneumonia','Antiviral medications for viral pneumonia','Fever reducers and cough medicine','Hospitalization for severe cases','Oxygen therapy if needed'],
    specialist: 'Pulmonologist / General Physician',
  },
  'Depression': {
    description: 'A mood disorder causing persistent feelings of sadness, hopelessness, and loss of interest that interferes with daily life.',
    symptoms: ['Persistent sad or empty mood','Loss of interest in activities','Changes in appetite and weight','Sleep disturbances','Fatigue and low energy','Difficulty concentrating','Thoughts of death or suicide'],
    treatment: ['Antidepressants (SSRIs, SNRIs)','Psychotherapy (CBT, interpersonal therapy)','Electroconvulsive therapy (ECT) for severe cases','Lifestyle changes: exercise, sleep hygiene','Support groups'],
    specialist: 'Psychiatrist / Psychologist',
  },
  'Epilepsy': {
    description: 'A neurological disorder characterized by recurrent, unprovoked seizures caused by abnormal electrical activity in the brain.',
    symptoms: ['Seizures (convulsions)','Temporary confusion','Staring spells','Uncontrollable jerking movements','Loss of consciousness','Anxiety or fear before seizure'],
    treatment: ['Anti-epileptic drugs (AEDs)','Ketogenic diet for drug-resistant epilepsy','Vagus nerve stimulation','Responsive neurostimulation','Surgery to remove seizure focus'],
    specialist: 'Neurologist / Epileptologist',
  },
  'Osteoporosis': {
    description: 'A condition where bones become weak and brittle, making them more susceptible to fractures from minor falls or even mild stresses.',
    symptoms: ['Back pain from fractured vertebra','Loss of height over time','Stooped posture','Bone fractures that occur easily','No symptoms until a fracture occurs'],
    treatment: ['Calcium and Vitamin D supplementation','Bisphosphonates (alendronate, risedronate)','Hormone therapy','Denosumab injections','Weight-bearing exercise','Fall prevention strategies'],
    specialist: 'Orthopaedic Surgeon / Endocrinologist',
  },
  'PCOS (Polycystic Ovary Syndrome)': {
    description: 'A hormonal disorder common among women of reproductive age, causing enlarged ovaries with small cysts and hormonal imbalances.',
    symptoms: ['Irregular or absent periods','Excess androgen (facial hair, acne)','Polycystic ovaries on ultrasound','Weight gain','Thinning hair','Difficulty getting pregnant'],
    treatment: ['Lifestyle changes: diet and exercise','Birth control pills to regulate periods','Metformin for insulin resistance','Clomiphene for fertility','Anti-androgen medications'],
    specialist: 'Gynaecologist / Endocrinologist',
  },
  'Thyroid Disorders': {
    description: 'Conditions affecting the thyroid gland that alter hormone production, including hypothyroidism (underactive) and hyperthyroidism (overactive).',
    symptoms: ['Fatigue and weight changes','Sensitivity to cold or heat','Hair loss','Rapid or slow heartbeat','Mood changes and depression','Swelling in the neck (goiter)'],
    treatment: ['Levothyroxine for hypothyroidism','Antithyroid drugs or radioactive iodine for hyperthyroidism','Beta-blockers for symptom control','Surgery (thyroidectomy) when needed','Regular TSH monitoring'],
    specialist: 'Endocrinologist',
  },
  'Dengue Fever': {
    description: 'A mosquito-borne viral infection causing flu-like illness, and occasionally developing into a potentially lethal complication called severe dengue.',
    symptoms: ['High fever (40°C/104°F)','Severe headache','Pain behind the eyes','Muscle and joint pain','Nausea and vomiting','Skin rash','Mild bleeding (nose or gums)'],
    treatment: ['No specific antiviral treatment','Paracetamol for fever and pain (avoid aspirin/NSAIDs)','Oral rehydration and IV fluids','Hospitalization for severe dengue','Platelet transfusion if critically low'],
    specialist: 'General Physician / Infectious Disease Specialist',
  },
  'Malaria': {
    description: 'A life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.',
    symptoms: ['Fever and chills','Headache and muscle aches','Nausea and vomiting','Sweating','Fatigue','Anemia and jaundice in severe cases'],
    treatment: ['Artemisinin-based combination therapies (ACTs)','Chloroquine for P. vivax','IV artesunate for severe malaria','Supportive care: fluids, fever management','Preventive antimalarials for travelers'],
    specialist: 'Infectious Disease Specialist / General Physician',
  },
  'Appendicitis': {
    description: 'Inflammation of the appendix, a small pouch attached to the large intestine. Requires prompt treatment to prevent rupture.',
    symptoms: ['Sudden pain beginning around the navel and shifting to lower right abdomen','Pain that worsens with movement','Nausea and vomiting','Fever','Loss of appetite','Abdominal bloating'],
    treatment: ['Appendectomy (surgical removal) — laparoscopic or open','Antibiotics before and after surgery','IV fluids and pain management','Antibiotics alone for uncomplicated cases (selected patients)'],
    specialist: 'General Surgeon',
  },
  'Gallstones (Cholelithiasis)': {
    description: 'Hardened deposits of digestive fluid that can form in the gallbladder, ranging from sand-grain size to golf-ball size.',
    symptoms: ['Sudden intense pain in upper right abdomen','Pain in right shoulder or between shoulder blades','Nausea and vomiting','Jaundice if bile duct is blocked','Fever if infection develops'],
    treatment: ['Laparoscopic cholecystectomy (gallbladder removal)','Oral dissolution therapy for small cholesterol stones','ERCP to remove stones from bile duct','Pain management during attacks','Dietary fat restriction'],
    specialist: 'General Surgeon / Gastroenterologist',
  },
  'Varicose Veins': {
    description: 'Twisted, enlarged veins most commonly appearing in the legs, caused by weakened or damaged valves in the veins.',
    symptoms: ['Dark purple or blue veins visible under skin','Aching, heavy legs','Burning or throbbing sensation','Muscle cramping','Swelling in lower legs','Itching around veins'],
    treatment: ['Compression stockings','Sclerotherapy (injection to close veins)','Laser treatment','Radiofrequency ablation','Surgical stripping for severe cases','Elevation and exercise'],
    specialist: 'Vascular Surgeon',
  },
  'Anemia': {
    description: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen to body tissues, causing fatigue and weakness.',
    symptoms: ['Fatigue and weakness','Pale or yellowish skin','Irregular heartbeat','Shortness of breath','Dizziness or lightheadedness','Chest pain','Cold hands and feet'],
    treatment: ['Iron supplements for iron-deficiency anemia','Vitamin B12 injections or supplements','Folic acid supplements','Blood transfusions for severe anemia','Treating underlying cause','Erythropoiesis-stimulating agents'],
    specialist: 'Hematologist / General Physician',
  },
}

// ─── Flat sorted list for search ─────────────────────────────
export const ALL_DISEASES = Object.values(DISEASES_BY_LETTER)
  .flat()
  .sort((a, b) => a.localeCompare(b))

// ─── Async helpers (swap bodies for real API calls) ───────────
export async function getByLetter(letter) {
  await new Promise(r => setTimeout(r, 180))
  return DISEASES_BY_LETTER[letter.toUpperCase()] ?? []
}

export async function searchDiseases(query) {
  await new Promise(r => setTimeout(r, 130))
  const q = query.toLowerCase().trim()
  if (!q) return []
  return ALL_DISEASES.filter(d => d.toLowerCase().includes(q))
}

/**
 * getDiseaseDetail(name)
 * Returns the detail object for a disease, or a generic fallback.
 */
export function getDiseaseDetail(name) {
  return DISEASE_DETAILS[name] ?? {
    description: `${name} is a medical condition treated at Srikara Hospitals by our specialist team.`,
    symptoms: ['Consult our specialists for a detailed symptom assessment.'],
    treatment: ['Our multidisciplinary team will create a personalised treatment plan.'],
    specialist: 'Specialist Physician',
  }
}
