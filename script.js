class Node{constructor(name){this.name=name;this.prev=null;this.next=null}}
class Playlist{
constructor(){this.head=null;this.tail=null;this.current=null;this.size=0}
addTail(name){const n=new Node(name);if(!this.tail){this.head=this.tail=this.current=n}else{n.prev=this.tail;this.tail.next=n;this.tail=n}this.size++}
addHead(name){const n=new Node(name);if(!this.head){this.head=this.tail=this.current=n}else{n.next=this.head;this.head.prev=n;this.head=n}this.size++}
find(name){let t=this.head,steps=0;const k=name.toLowerCase();while(t){steps++;if(t.name.toLowerCase()===k)return{node:t,steps};t=t.next}return{node:null,steps}}
remove(n){
if(n.prev)n.prev.next=n.next;else this.head=n.next;
if(n.next)n.next.prev=n.prev;else this.tail=n.prev;
if(this.current===n)this.current=n.next||n.prev;
this.size--}
toArray(){const a=[];let t=this.head;while(t){a.push(t);t=t.next}return a}
}
const pl=new Playlist();
const $=id=>document.getElementById(id);
const msg=t=>{$('msg').textContent=t};
function log(text,cost){const li=document.createElement('li');li.innerHTML='<span></span><em></em>';li.children[0].textContent=text;li.children[1].textContent=cost;$('log').prepend(li)}
function render(){
const c=$('chain');c.textContent='';
const arr=pl.toArray();
if(!arr.length){c.innerHTML='<div class="empty">The playlist is empty. Add a song to create the first node.</div>'}
else{
const first=document.createElement('div');first.className='null';first.textContent='NULL ⇠';first.style.alignSelf='flex-start';first.style.paddingTop='22px';c.appendChild(first);
arr.forEach((n,i)=>{
const wrap=document.createElement('div');
const item=document.createElement('div');item.className='item';
const nd=document.createElement('div');nd.className='node'+(n===pl.current?' cur':'');
nd.innerHTML='<div class="n"></div><div class="p"></div>';
nd.children[0].textContent=n.name;
nd.children[1].textContent='prev: '+(n.prev?n.prev.name:'NULL')+' | next: '+(n.next?n.next.name:'NULL');
item.appendChild(nd);
if(i<arr.length-1){const a=document.createElement('div');a.className='arrow';a.textContent='⇄';item.appendChild(a)}
wrap.appendChild(item);
const tg=document.createElement('div');tg.className='tags';
let h='';if(n===pl.head)h+='<span>HEAD</span>';if(n===pl.current)h+='<span>CURRENT</span>';if(n===pl.tail)h+='<span>TAIL</span>';
tg.innerHTML=h;wrap.appendChild(tg);c.appendChild(wrap)});
const last=document.createElement('div');last.className='null';last.textContent='⇢ NULL';last.style.paddingTop='22px';c.appendChild(last)}
$('nowName').textContent=pl.current?pl.current.name:'Nothing yet';
$('disc').classList.toggle('spin',!!pl.current);
$('prev').disabled=!(pl.current&&pl.current.prev);
$('next').disabled=!(pl.current&&pl.current.next);
$('delCur').disabled=!pl.current;
$('display').textContent='';
}
function getName(){const v=$('song').value.trim();if(!v){msg('Type a song name first.');return null}return v}
$('addTail').onclick=()=>{const v=getName();if(!v)return;pl.addTail(v);$('song').value='';msg('');log('Added “'+v+'” at tail','O(1)');render()};
$('addHead').onclick=()=>{const v=getName();if(!v)return;pl.addHead(v);$('song').value='';msg('');log('Added “'+v+'” at head','O(1)');render()};
$('delName').onclick=()=>{const v=getName();if(!v)return;const r=pl.find(v);
if(!r.node){msg('“'+v+'” is not in the playlist.');return}
pl.remove(r.node);$('song').value='';msg('');log('Deleted “'+r.node.name+'” (searched '+r.steps+' nodes, then relinked neighbors)','O(n)');render()};
$('delCur').onclick=()=>{if(!pl.current)return;const n=pl.current;pl.remove(n);msg('');log('Deleted current song “'+n.name+'” (pointer update only)','O(1)');render()};
$('next').onclick=()=>{if(pl.current&&pl.current.next){pl.current=pl.current.next;log('Play next: current = “'+pl.current.name+'”','O(1)');render()}};
$('prev').onclick=()=>{if(pl.current&&pl.current.prev){pl.current=pl.current.prev;log('Play previous: current = “'+pl.current.name+'”','O(1)');render()}};
$('show').onclick=()=>{const ol=$('display');ol.textContent='';const a=pl.toArray();
if(!a.length){ol.innerHTML='<li class="empty" style="list-style:none">Nothing to display.</li>';return}
a.forEach(n=>{const li=document.createElement('li');li.textContent=n.name+(n===pl.current?' (playing)':'');ol.appendChild(li)});
log('Displayed '+a.length+' songs from HEAD to TAIL','O(n)')};
$('demo').onclick=()=>{['Kanavu Kaanum','Vaathi Coming','Munbe Vaa','Ennavale'].forEach(s=>pl.addTail(s));log('Loaded 4 sample songs at tail','O(1) each');render()};
$('song').addEventListener('keydown',e=>{if(e.key==='Enter')$('addTail').click()});
render();
