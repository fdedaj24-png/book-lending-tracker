import {LoanStore,statusOf,escapeHTML,formatDate,summaryOf} from "./js/library.js";
const store=new LoanStore();
const form=document.querySelector("#loan-form");
const tbody=document.querySelector("#loans-body");
const search=document.querySelector("#search");
const filter=document.querySelector("#filter");
const empty=document.querySelector("#empty");
const tableWrap=document.querySelector("#table-wrap");
const message=document.querySelector("#message");
function render(){
 const loans=store.all();
 const summary=summaryOf(loans);
 document.querySelector("#total-loans").textContent=summary.total;
 document.querySelector("#overdue-loans").textContent=summary.overdue;
 document.querySelector("#returned-loans").textContent=summary.returned;
 const query=search.value.trim().toLowerCase();
 const visible=loans.filter(l=>[l.title,l.author,l.borrower,l.genre].some(v=>v.toLowerCase().includes(query))&&(filter.value==="all"||statusOf(l).toLowerCase()===filter.value));
 tbody.innerHTML=visible.map(l=>{
 const status=statusOf(l); const statusClass=status.toLowerCase();
 return `<tr><td>${escapeHTML(l.title)}</td><td>${escapeHTML(l.author)}</td><td>${escapeHTML(l.borrower)}</td><td>${formatDate(l.dueDate)}</td><td>${escapeHTML(l.genre)}</td><td><span class="status ${statusClass}">${status}</span></td><td><button type="button" class="action" data-action="toggle" data-id="${escapeHTML(l.id)}">${l.returned?"Reopen":"Mark returned"}</button><button type="button" class="action delete" data-action="delete" data-id="${l.id}">Delete</button></td></tr>`;
 }).join("");
 empty.hidden=visible.length>0;
 tableWrap.hidden=visible.length===0;
}
form.addEventListener("submit",e=>{
 e.preventDefault();
 if(!form.reportValidity())return;
 try{
  store.add(Object.fromEntries(new FormData(form)));
  form.reset();message.textContent="Book loan saved successfully.";render();
 }catch(err){message.textContent=err.message;}
});
tbody.addEventListener("click",e=>{
 const button=e.target.closest("button[data-action]");
 if(!button)return;
 try {
   if(button.dataset.action==="toggle")store.toggle(button.dataset.id);
   if(button.dataset.action==="delete"&&confirm("Delete this loan record?"))store.remove(button.dataset.id);
   message.textContent="";render();
 } catch(error) {message.textContent=error.message;}
});
search.addEventListener("input",render);
filter.addEventListener("change",render);
render();
window.addEventListener("focus",render);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)render();});
