import {LoanStore,statusOf,escapeHTML,formatDate} from "./js/library.js";
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
 document.querySelector("#total-loans").textContent=loans.length;
 document.querySelector("#overdue-loans").textContent=loans.filter(l=>statusOf(l)==="overdue").length;
 document.querySelector("#returned-loans").textContent=loans.filter(l=>l.returned).length;
 const query=search.value.trim().toLowerCase();
 const visible=loans.filter(l=>[l.title,l.author,l.borrower,l.genre].some(v=>v.toLowerCase().includes(query))&&(filter.value==="all"||statusOf(l)===filter.value));
 tbody.innerHTML=visible.map(l=>{
 const status=statusOf(l);
 return `<tr><td>${escapeHTML(l.title)}</td><td>${escapeHTML(l.author)}</td><td>${escapeHTML(l.borrower)}</td><td>${formatDate(l.dueDate)}</td><td>${escapeHTML(l.genre)}</td><td><span class="status ${status}">${status}</span></td><td><button type="button" class="action" data-action="toggle" data-id="${l.id}">${l.returned?"Reopen":"Mark returned"}</button><button type="button" class="action delete" data-action="delete" data-id="${l.id}">Delete</button></td></tr>`;
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
 if(button.dataset.action==="toggle")store.toggle(button.dataset.id);
 if(button.dataset.action==="delete"&&confirm("Delete this loan record?"))store.remove(button.dataset.id);
 render();
});
search.addEventListener("input",render);
filter.addEventListener("change",render);
render();