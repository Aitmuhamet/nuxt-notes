import N from"./BqxF6uxl.js";import{_ as b}from"./BsLnRG3m.js";import{_ as k,y as f,r as v,m as y,z as C,n as h,w as V,o as r,a as o,c as i,p as g,q as l,F as w,s as d,v as B,A as F,B as I,b as S}from"./DFAwYgtM.js";import{u as T}from"./DbCKsYe8.js";const U={class:"note container mx-auto"},M={"submit.prevent":"noteStore.saveNote"},z=["id","onUpdate:modelValue"],E=["onUpdate:modelValue","id"],L=["onClick"],$={__name:"[id]",setup(q){const u=f(),c=v(u.params.id),t=T();y(()=>{t.loadNotesFromLocalStorage(),_()});const _=()=>{!isNaN(Number(c.value))?t.prepareNoteForEditing(Number(c.value)):(t.createNewNote(),console.log("currentNote:",t.currentNote))},m=C({get:()=>t.currentNote.tasks,set:a=>t.currentNote.tasks=a});return(a,s)=>{const p=N,x=b;return r(),h(x,null,{default:V(()=>[o("div",U,[s[1]||(s[1]=o("h2",{class:"note__title text-sm"},"Tasks:",-1)),o("form",M,[(r(!0),i(w,null,g(l(m),e=>(r(),i("div",{key:e.id,class:"task"},[d(o("input",{type:"checkbox",id:"task-"+e.id,"onUpdate:modelValue":n=>e.isCompleted=n,class:"checkbox task__checkbox"},null,8,z),[[B,e.isCompleted]]),d(o("input",{type:"text","onUpdate:modelValue":n=>e.text=n,class:F([{completed:e.isCompleted},"task__text my-2 bg-transparent outline-0"]),id:"text-"+e.id},null,10,E),[[I,e.text]]),o("button",{type:"button",class:"btn task__btn self-center p-3 opacity-0 ms-auto",onClick:n=>l(t).deleteTask(e.id)},[S(p,{name:"material-symbols:delete-outline-rounded",class:"text-lg"})],8,L)]))),128)),o("button",{type:"button",onClick:s[0]||(s[0]=e=>l(t).createNewTask()),class:"btn p-3 my-4"},"Create new task")])])]),_:1})}}},j=k($,[["__scopeId","data-v-a0058e4d"]]);export{j as default};
