export async function gemini(prompt){
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL||'gemini-2.0-flash'}:generateContent`,
   {method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json'}})});
  const j=await r.json(); if(!r.ok) throw new Error(j.error?.message||'Error de Gemini');
  return JSON.parse(j.candidates[0].content.parts[0].text.replace(/```json|```/g,''));
}
