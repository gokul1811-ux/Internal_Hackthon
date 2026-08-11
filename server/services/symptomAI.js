/**
 * AI-Based Symptom Recognition & Smart Queue Prioritization Engine
 * 
 * IMPORTANT MEDICAL SAFETY:
 * This AI module performs initial triage and urgency classification ONLY.
 * It DOES NOT diagnose diseases or make autonomous medical decisions.
 * Final queue priority must always be confirmed by authorized medical staff.
 */

function analyzeSymptoms(symptomsText) {
  if (!symptomsText || typeof symptomsText !== 'string' || symptomsText.trim().length === 0) {
    return {
      keywords: [],
      category: 'General',
      urgency: 'Low',
      suggestedPriority: 'Normal',
      reason: 'No detailed symptoms provided. Assigned default general consultation priority.',
      disclaimer: 'AI triage suggestion only — final priority must be confirmed by medical staff.'
    };
  }

  const lower = symptomsText.toLowerCase();
  const keywords = [];

  // High Urgency / Cardiac / Respiratory / Severe Trauma patterns
  const cardiacKeywords = ['chest pain', 'chest discomfort', 'tightness in chest', 'heart palpitation', 'left arm pain', 'cardiac', 'pressure in chest'];
  const respiratoryKeywords = ['difficulty breathing', 'shortness of breath', 'gasping', 'severe asthma', 'wheezing', 'breathlessness', 'choking'];
  const neuroKeywords = ['slurred speech', 'sudden numbness', 'fainting', 'loss of consciousness', 'severe dizziness', 'stroke symptoms', 'worst headache'];
  const highPainKeywords = ['severe pain', 'unbearable pain', 'extreme pain', 'fracture', 'heavy bleeding', 'accident'];

  // Moderate Urgency patterns
  const feverKeywords = ['high fever', 'chills', 'persistent fever', 'temperature', 'fever', 'shivering'];
  const giKeywords = ['stomach pain', 'abdominal pain', 'persistent vomiting', 'severe diarrhea', 'nausea'];
  const orthoKeywords = ['joint pain', 'swelling', 'sprain', 'back pain', 'knee pain', 'inability to walk'];

  // Low Urgency patterns
  const mildKeywords = ['mild cold', 'routine checkup', 'prescription refill', 'skin rash', 'runny nose', 'mild cough', 'sore throat', 'headache'];

  // Check Cardiac
  let foundCardiac = cardiacKeywords.filter(kw => lower.includes(kw));
  let foundRespiratory = respiratoryKeywords.filter(kw => lower.includes(kw));
  let foundNeuro = neuroKeywords.filter(kw => lower.includes(kw));
  let foundHighPain = highPainKeywords.filter(kw => lower.includes(kw));
  let foundFever = feverKeywords.filter(kw => lower.includes(kw));
  let foundGI = giKeywords.filter(kw => lower.includes(kw));
  let foundOrtho = orthoKeywords.filter(kw => lower.includes(kw));
  let foundMild = mildKeywords.filter(kw => lower.includes(kw));

  // Determine Category, Urgency, Suggested Priority, and Reason
  let category = 'General';
  let urgency = 'Low';
  let suggestedPriority = 'Normal';
  let reason = 'Symptoms suggest a non-urgent standard consultation routine.';

  if (foundCardiac.length > 0) {
    category = 'Cardiac';
    urgency = 'High';
    suggestedPriority = 'Urgent Review';
    keywords.push(...foundCardiac);
    reason = 'Symptoms include cardiac indicators (chest discomfort/pain) which require prompt emergency triage evaluation.';
  } else if (foundRespiratory.length > 0) {
    category = 'Respiratory';
    urgency = 'High';
    suggestedPriority = 'Urgent Review';
    keywords.push(...foundRespiratory);
    reason = 'Symptoms indicate respiratory distress or difficulty breathing requiring urgent review by medical staff.';
  } else if (foundNeuro.length > 0) {
    category = 'Neurological';
    urgency = 'High';
    suggestedPriority = 'Urgent Review';
    keywords.push(...foundNeuro);
    reason = 'Neurological warning signs detected (numbness/dizziness/fainting) suggesting immediate clinical assessment.';
  } else if (foundHighPain.length > 0) {
    category = 'Acute Pain / Trauma';
    urgency = 'High';
    suggestedPriority = 'Urgent Review';
    keywords.push(...foundHighPain);
    reason = 'High-intensity pain or trauma reported, prioritized for urgent doctor review.';
  } else if (foundFever.length > 0) {
    category = 'Fever / Infection';
    urgency = 'Moderate';
    suggestedPriority = 'Priority';
    keywords.push(...foundFever);
    reason = 'Fever indicators present; moderate priority assigned for infection management.';
  } else if (foundGI.length > 0) {
    category = 'Gastrointestinal';
    urgency = 'Moderate';
    suggestedPriority = 'Priority';
    keywords.push(...foundGI);
    reason = 'Abdominal discomfort or GI symptoms noted; moderate priority for doctor consultation.';
  } else if (foundOrtho.length > 0) {
    category = 'Orthopedic';
    urgency = 'Moderate';
    suggestedPriority = 'Priority';
    keywords.push(...foundOrtho);
    reason = 'Musculoskeletal pain or joint discomfort reported; scheduled for priority review.';
  } else if (foundMild.length > 0) {
    category = 'General / Mild';
    urgency = 'Low';
    suggestedPriority = 'Normal';
    keywords.push(...foundMild);
    reason = 'Mild or routine cold/checkup symptoms. Assigned normal queue sequence.';
  } else {
    // General keyword extraction fallback
    const words = symptomsText.split(/\s+/).filter(w => w.length > 4);
    keywords.push(...words.slice(0, 4));
    
    // Heuristic severity words check
    if (lower.includes('severe') || lower.includes('acute') || lower.includes('urgent') || lower.includes('extreme')) {
      urgency = 'High';
      suggestedPriority = 'Urgent Review';
      category = 'General Urgent';
      reason = 'High severity descriptor word detected in symptom text.';
    } else if (lower.includes('moderate') || lower.includes('pain') || lower.includes('fever')) {
      urgency = 'Moderate';
      suggestedPriority = 'Priority';
      category = 'General Medical';
      reason = 'Moderate symptom severity detected in patient input.';
    }
  }

  // Deduplicate keywords
  const uniqueKeywords = Array.from(new Set(keywords));

  return {
    keywords: uniqueKeywords.length > 0 ? uniqueKeywords : ['general-symptoms'],
    category,
    urgency,
    suggestedPriority,
    reason,
    disclaimer: 'AI triage suggestion only — final priority must be confirmed by medical staff.'
  };
}

module.exports = { analyzeSymptoms };
