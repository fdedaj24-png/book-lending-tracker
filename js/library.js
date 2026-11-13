export const STORAGE_KEY = "book-lending-tracker-v1";
export function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function statusOf(loan, today = new Date()) {
  if (loan.returned) return "returned";
  const localDate = [today.getFullYear(),String(today.getMonth()+1).padStart(2,"0"),String(today.getDate()).padStart(2,"0")].join("-");
  return loan.dueDate < localDate ? "overdue" : "borrowed";
}
export function formatDate(date) {
  const [y,m,d] = date.split("-").map(Number);
  return new Date(y,m-1,d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
}
export class LoanStore {
  constructor(storage = window.localStorage) {
    this.storage=storage;
    try {
      const records=JSON.parse(storage.getItem(STORAGE_KEY)||"[]");
      this.records=Array.isArray(records)?records.filter(r=>r&&typeof r.id==="string"):[];
    } catch { this.records=[]; }
  }
  all(){ return [...this.records].reverse(); }
  save(){ try{this.storage.setItem(STORAGE_KEY,JSON.stringify(this.records));return true;}catch{return false;} }
  add(data) {
    const fields=["title","author","borrower","dueDate","genre"];
    for(const field of fields){ if(typeof data[field]!=="string"||!data[field].trim()) throw Error("Complete every required field."); }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(data.dueDate))throw Error("Choose a valid due date.");
    const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random(),...Object.fromEntries(fields.map(f=>[f,data[f].trim()])),returned:false};
    this.records.push(item);this.save();return item;
  }
  toggle(id){const r=this.records.find(x=>x.id===id);if(r){r.returned=!r.returned;this.save();}}
  remove(id){this.records=this.records.filter(x=>x.id!==id);this.save();}
}