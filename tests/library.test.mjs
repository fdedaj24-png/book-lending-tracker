import test from 'node:test';
import assert from 'node:assert/strict';
import { LoanStore, STORAGE_KEY, isValidDate, validateLoan, statusOf, summaryOf, escapeHTML } from '../js/library.js';
const fields={title:'Dune',author:'Frank Herbert',borrower:'Alex',dueDate:'2026-11-20',genre:'Science Fiction'};
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};};
test('required fields and trimming',()=>{
  assert.equal(validateLoan({...fields,title:' Dune '}).title,'Dune');
  assert.throws(()=>validateLoan({...fields,genre:' '}),/required/);
});
test('reject invalid dates, allow leap days',()=>{
  assert.equal(isValidDate('2026-02-29'),false);
  assert.equal(isValidDate('2024-02-29'),true);
  assert.throws(()=>validateLoan({...fields,dueDate:'2026-02-30'}),/real calendar/);
});
test('overdue excludes returned and today',()=>{
  const now=new Date(2026,10,13);
  assert.equal(statusOf({...fields,dueDate:'2026-11-12',returned:false},now),'Overdue');
  assert.equal(statusOf({...fields,dueDate:'2026-11-13',returned:false},now),'Borrowed');
  assert.equal(statusOf({...fields,dueDate:'2026-11-12',returned:true},now),'Returned');
});
test('add, reload, return, reopen, delete',()=>{
  const storage=memory(),store=new LoanStore(storage),item=store.add(fields);
  assert.equal(new LoanStore(storage).all()[0].title,'Dune');
  assert.equal(store.toggle(item.id),true);assert.equal(store.all()[0].returned,true);
  assert.equal(store.toggle(item.id),true);assert.equal(store.all()[0].returned,false);
  assert.equal(store.remove(item.id),true);assert.equal(store.all().length,0);
});
test('summary and corrupted localStorage',()=>{
  const storage=memory();storage.setItem(STORAGE_KEY,'broken');
  assert.equal(new LoanStore(storage).all().length,0);
  const loans=[{...fields,returned:false,dueDate:'2026-11-12'},{...fields,returned:true}];
  assert.deepEqual(summaryOf(loans,new Date(2026,10,13)),{total:2,overdue:1,returned:1});
});
test('unsafe HTML is escaped',()=>{
  assert.equal(escapeHTML('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
test('failed storage write does not add phantom loan',()=>{
  const store=new LoanStore({getItem:()=>null,setItem:()=>{throw Error('blocked');}});
  assert.throws(()=>store.add(fields),/Unable to save/);
  assert.equal(store.all().length,0);
});
