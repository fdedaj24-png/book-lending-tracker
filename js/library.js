// Reusable loan management library: validation, status, storage and formatting.
export const STORAGE_KEY = 'book-lending-tracker-v1';
export const REQUIRED_FIELDS = Object.freeze(['title','author','borrower','dueDate','genre']);
export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
export function isValidDate(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year,month,day] = date.split('-').map(Number);
  const test = new Date(year,month-1,day);
  return year>=1900 && year<=9999 && test.getFullYear()===year && test.getMonth()===month-1 && test.getDate()===day;
}
export function localToday(now=new Date()) {
  return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
}
export function statusOf(loan,now=new Date()) {
  if(loan.returned===true) return 'Returned';
  return loan.dueDate<localToday(now)?'Overdue':'Borrowed';
}
export function formatDate(isoDate) {
  if(!isValidDate(isoDate)) return 'Invalid date';
  const [year,month,day]=isoDate.split('-').map(Number);
  return new Date(year,month-1,day).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}
export function validateLoan(input) {
  const loan={};
  for(const field of REQUIRED_FIELDS) {
    if(typeof input?.[field]!=='string'||!input[field].trim()) throw new Error('All five fields are required.');
    loan[field]=input[field].trim();
    if(loan[field].length>120) throw new Error(field+' cannot exceed 120 characters.');
  }
  if(!isValidDate(loan.dueDate)) throw new Error('Enter a real calendar date.');
  return loan;
}
export function summaryOf(loans,now=new Date()) {
  return {total:loans.length,overdue:loans.filter(l=>statusOf(l,now)==='Overdue').length,returned:loans.filter(l=>l.returned).length};
}
export class LoanStore {
  constructor(storage=globalThis.localStorage) {
    this.storage=storage;this.records=[];
    try {
      const parsed=JSON.parse(storage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(parsed)) this.records=parsed.filter(l=>{
        try { return typeof l?.id==='string'&&l.id.length>0&&typeof l.returned==='boolean'&&(validateLoan(l),true); }
        catch{return false;}
      });
    } catch {this.records=[];}
  }
  all(){return [...this.records].reverse();}
  persist(){
    try {this.storage.setItem(STORAGE_KEY,JSON.stringify(this.records));}
    catch {throw new Error('Unable to save. Please allow browser storage or free up space.');}
  }
  add(fields){
    const valid=validateLoan(fields);
    const id=globalThis.crypto?.randomUUID?.()||(Date.now()+'-'+Math.random().toString(36).slice(2));
    const record={id,...valid,returned:false};
    this.records.push(record);
    try{this.persist();}catch(error){this.records.pop();throw error;}
    return record;
  }
  toggle(id){
    const r=this.records.find(x=>x.id===id);if(!r)return false;
    r.returned=!r.returned;
    try{this.persist();}catch(error){r.returned=!r.returned;throw error;}
    return true;
  }
  remove(id){
    const before=this.records;this.records=before.filter(x=>x.id!==id);
    if(before.length===this.records.length)return false;
    try{this.persist();}catch(error){this.records=before;throw error;}
    return true;
  }
}
