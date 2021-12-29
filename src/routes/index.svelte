




<div class="header">

<Select labelText="플레이어1" bind:selected={player1}>
  <SelectItem value="" text="선택" disabled hidden />
  {#each allPlayer as mens}
  <SelectItem value={mens.player}.{mens.univ}.{mens.race} text={mens.player} />
  {/each}
</Select>





<Select labelText="플레이어2" bind:selected={player2}>
  <SelectItem value="" text="선택" disabled hidden />
  {#each allPlayer as mens}
  <SelectItem value={mens.player}.{mens.univ}.{mens.race} text={mens.player} />
  {/each}
</Select>


<Select labelText="맵" bind:selected={map}>
  <SelectItem value="" text="선택" disabled hidden />
  <SelectItem value="투혼" text="투혼" />
  <SelectItem value="폴리" text="폴리" />
  <SelectItem value="이클" text="이클" />
  
</Select>




<RadioButtonGroup
  orientation="vertical"
  legendText="승 선택"
  bind:selected={w}
>

  <RadioButton labelText="플레이어1" bind:value={player1} />
  <RadioButton labelText="플레이어2" bind:value={player2}  />


</RadioButtonGroup>


<button on:click={addMatch}>전적등록</button>
</div>
<!-- 
<TextInput bind:value={search} labelText="검색" placeholder="선수전적검색" />
<button on:click={searchMatch}>전적검색</button> -->

<StructuredList condensed>
  <StructuredListHead>
    <StructuredListRow head>
      <StructuredListCell head>일자</StructuredListCell>
      <StructuredListCell head>플레이어1</StructuredListCell>
      <StructuredListCell head>맵</StructuredListCell>
      <StructuredListCell head>플레이어2</StructuredListCell>
   
    </StructuredListRow>
  </StructuredListHead>
  <StructuredListBody >
   
    {#each allMatchs as match}
    <StructuredListRow >
      <StructuredListCell >{match.createdAt}</StructuredListCell>
      {#if match.player1 === match.w}
      <span class="win"> <StructuredListCell >{match.player1} {match.race1} <img src={match.player1univimg} alt="media"/>   </StructuredListCell></span>
      <StructuredListCell >{match.map}</StructuredListCell>
      <StructuredListCell ><img src={match.player2univimg} alt="media" /> {match.race2} {match.player2} </StructuredListCell>
      {:else}
      <StructuredListCell >{match.player1} {match.race1} <img src={match.player1univimg} alt="media"/></StructuredListCell>
      <StructuredListCell >{match.map}</StructuredListCell>
      <span class="win"><StructuredListCell > <span class="win"> <img src={match.player2univimg} alt="media" /> {match.race2} {match.player2} </StructuredListCell></span>
      {/if}
    </StructuredListRow>
    {/each}

  </StructuredListBody>
</StructuredList>


<!-- 
 <DataTable
 size="tall"
 expandable
 headers={[ {key:'createdAt',value:'createdAt'},  { key: 'player1', value: 'player1' },  { key: 'map', value: 'map' },   { key: 'player2', value: 'player2' }  ]}
 rows={allMatchs}
 >
 <div slot="expanded-row" let:row>
   <pre>
     {JSON.stringify(row, null,1)}
     
   </pre>
 </div>
 </DataTable> 
-->

<div class="header">


{#if $authStore.firebaseControlled}
 {#if !$authStore.isLoggedIn}
 <button on:click={login}>로그인</button>


{:else}
<button on:click={logout}>로그아웃</button>


{/if}

{/if}



<TextInput bind:value={addplayer} labelText="선수등록" placeholder="선수입력" />

<Select labelText="스타대학" bind:selected={univ}>
  <SelectItem value="" text="선택" disabled hidden />
  <SelectItem value="NSU" text="NSU" />
  <SelectItem value="미다스" text="미다스" />
  <SelectItem value="마종대" text="마종대" />
  <SelectItem value="바스포드" text="바스포드" />
  <SelectItem value="우끼끼즈" text="우끼끼즈" />
  <SelectItem value="염석대" text="염석대" />
  <SelectItem value="철기중대" text="철기중대" />
  <SelectItem value="친박연대" text="친박연대" />
  <SelectItem value="캄성여대" text="캄성여대" />
  <SelectItem value="파이스트" text="파이스트" />
  <SelectItem value="학버드" text="학버드" />
  <SelectItem value="FA" text="FA" />
</Select>


<Select labelText="종족" bind:selected={race}>
  <SelectItem value="" text="선택" disabled hidden />
  <SelectItem value="P" text="P" />
  <SelectItem value="T" text="T" />
  <SelectItem value="Z" text="Z" />

</Select>

<button on:click={createPlayer}>선수등록</button>
<slot></slot>

</div>
<script>
import {
  auth, 
  db} from '$lib/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { 
    addDoc, 
    collection,  
    onSnapshot, 
    query, 
    where, 
    orderBy,
getDocs,
    } from 'firebase/firestore';

import { onDestroy, onMount} from 'svelte';
import authStore from '$lib/authStore';
import { goto } from '$app/navigation';


let search ="";



let allMatchs=[];

const ref = collection(db,'match')

const q = query(ref, orderBy("createdAt", 'asc'));


//const query(on)Snapshot = await getDocs(q);
onSnapshot(q,(sn)=>{
    let matchs =[];
sn.forEach((doc)=>{

 let match ={ ...doc.data(),id:doc.id};

 matchs=[match, ...matchs];
})
allMatchs = matchs;

})


let searchMatch = async()=>{
    search= search.trim()


     const q = query(
     collection(db, "match"),
     where('searchfield',"array-contains",search)
     );

   const docsSnap = await getDocs(q);
   console.log(docsSnap)
   docsSnap.forEach((doc) => {
    
   console.log(doc)
   });
}

const login = async()=>{
    try {
        const provider = new GoogleAuthProvider()
      await signInWithPopup(auth,provider)
    } catch (e) {
      console.log(e);
    }
 }

const logout = async()=>{
    try {
        await signOut(auth)

    } catch (e) {
      console.log(e);
    }}



const sub = authStore.subscribe(async (info) => {
    if (info.isLoggedIn) {
      await goto('/');
    }
  });
  
  onDestroy(() => {
    sub();
  });


    onMount(() => {

      

      auth.onAuthStateChanged((user) => {
        authStore.set({
          isLoggedIn: user !== null,
          user,
          firebaseControlled: true,
        });
        
      });
      
     

    
    });

 

    import { 
      TextInput,
      RadioButtonGroup, 
      RadioButton, 
      Select, 
      SelectItem,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,

 } from "carbon-components-svelte";

    let w ="";
    let player1="";
    let player2="";
    let map = "";
    let player1univ = "";
    let player2univ = "";
    let race1 ="";
    let race2 ="";
  
    let player1univimg ="";
let player2univimg ="";
 

    function getUniv(playeruniv){
      let result ="";
      switch (playeruniv) {
      
      case 'NSU':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/nsu.png?alt=media&token=32d3c9e7-f66d-4a29-9d2b-d1ea60046293";
         break;
      case '미다스':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/midas.png?alt=media&token=d6001b53-6eee-4355-b1a6-0bb2aa778f27";
         break;
      case '마종대':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/minor.png?alt=media&token=4c512892-a2e1-410c-af48-3544bc3df69f";
         break;
      case '바스포드':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/bas.png?alt=media&token=f7f07db6-b724-4b6a-9d64-0574ec741784";
         break;
      case '우끼끼즈':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/ukkz.png?alt=media&token=961d87b4-5dd2-42c1-bb58-40763cc7bd03";
         break;
      case '염석대':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/ysu.png?alt=media&token=9f1335a4-f4ff-4dfe-bd4e-f3e7130cc1d8";
         break;
      case '철기중대':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/cgd.png?alt=media&token=4a299a12-183a-4462-86b2-b59623ec7e56";
         break;
      case '친박연대':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/CP.png?alt=media&token=46f5231e-b928-4957-a185-a73f54a53a7e";
         break;
      case '캄성여대':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/cs.png?alt=media&token=84c16f35-679d-4ff0-bed5-786a41c15b1a";
         break;
      case '파이스트':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/pist.png?alt=media&token=5f21e5e5-8c92-46a6-bc3a-dc3c7cb9d435";
         break; 
      case '학버드':
      result="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/hak.png?alt=media&token=19b14b60-757f-4ce7-96d5-6b58048f33dd";
         break;
      default:
      result="";
     }

     return result;
    }


    let addMatch= async ()=>{
    
    if (player1 !== "" && player2 !== "" && w !== "" && map !=="") {
     try {
   

      w = w.split('.')[0];
      player1univ =player1.split('.')[1];
      player2univ =player2.split('.')[1];
      race1 = player1.split('.')[2];
      race2 = player1.split('.')[2];
 
      player1univimg= getUniv(player1univ);
      player2univimg= getUniv(player2univ);

      player1 = player1.split('.')[0];
      player2 = player2.split('.')[0];
    
       

    
      const docRef = await addDoc(collection(db, "match"), {
        player1:player1,
        player2:player2,
        player1univimg:player1univimg,
        player2univimg:player2univimg,
        race1:race1,
        race2:race2,
        w:w,
        map:map,
        searchfield:player1+player2,
        createdAt: new Date().toISOString()
      });

      player1univ="";
      player2univ="";
      player1="";
      player2="";
      w="";
      map="";
      race1="";
      race2="";
      player1univimg ="";
      player1univimg ="";

     } catch (error) {
       console.error(error)
     } 



     
    } 
   
  };
 



  let addplayer ="";
  let univ ="";
  let univimg="";
  let race="";


  let createPlayer= async ()=>{
   
    if (addplayer !== "" ) {
     try {
      switch (univ) {
      
        case 'NSU':
            univ ="NSU";
            univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/nsu.png?alt=media&token=32d3c9e7-f66d-4a29-9d2b-d1ea60046293";
            break;
        case '미다스':
            univ ="미다스";
            univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/midas.png?alt=media&token=d6001b53-6eee-4355-b1a6-0bb2aa778f27";
            break;
        case '마종대':
         univ ="마종대";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/minor.png?alt=media&token=4c512892-a2e1-410c-af48-3544bc3df69f";
         break;
   
        case '바스포드':
         univ ="바스포드";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/bas.png?alt=media&token=f7f07db6-b724-4b6a-9d64-0574ec741784";
         break;
        case '우끼끼즈':
         univ ="우끼끼즈";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/ukkz.png?alt=media&token=961d87b4-5dd2-42c1-bb58-40763cc7bd03";
         break;
        case '염석대':
         univ ="염석대";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/ysu.png?alt=media&token=9f1335a4-f4ff-4dfe-bd4e-f3e7130cc1d8";
         break;
        case '철기중대':
          univ ="철기중대";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/cgd.png?alt=media&token=4a299a12-183a-4462-86b2-b59623ec7e56";
         break;
        case '친박연대':
         univ ="친박연대";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/CP.png?alt=media&token=46f5231e-b928-4957-a185-a73f54a53a7e";
         break;
        case '파이스트':
             univ ="파이스트";
            univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/pist.png?alt=media&token=5f21e5e5-8c92-46a6-bc3a-dc3c7cb9d435";
            break; 
        case '학버드':
          univ ="학버드";
         univimg="https://firebasestorage.googleapis.com/v0/b/blog-61ad4.appspot.com/o/hak.png?alt=media&token=19b14b60-757f-4ce7-96d5-6b58048f33dd";
         break;
        default:
             univ ="FA";
            univimg="";
       }
      
      const docRef = await addDoc(collection(db, "player"), {
        player:addplayer,
        univ :univ,
        univimg :univimg,
        race:race,
        createdAt: new Date().toISOString()
      });
     } catch (error) {
       console.error(error)
     } 
    addplayer ="";
    univ ="";
    univimg="";
    } 

    

  };


  let allPlayer=[];
const playerRef = collection(db,'player')
const playerQ = query(playerRef, orderBy("createdAt", 'asc'));
//const query(on)Snapshot = await getDocs(q);
onSnapshot(playerQ,(sn)=>{
    let players =[];
 sn.forEach((doc)=>{

 let men ={ ...doc.data(),id:doc.id};
 players=[men, ...players];
 })


 allPlayer = players;

})


</script>

<style global>

body{

    width: 60%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 8%;
width:850px;
background-color: #F2F0F9;
}
  img{  
    height:30px;
    width:30px;
    vertical-align: middle;
    }
  .win{      
    font-weight: bold;
    width: 5px;
    height: 5px;
    text-align: center;
    color: red;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    vertical-align: center;
    }
    
select {
  border: 0;
  margin: 10px;
}
.bx--radio-button-group{
  border: 0;
  margin: 10px;
}

.bx--form-item{
  display: inline-block;
  vertical-align: middle;
}

.bx--structured-list-row--header-row{
  text-align: center;
  border-bottom: 1px solid #C6C2DE;
  border-top: 1px solid #C6C2DE;
  background-color: #F2F0F9;
  color: #6D5BD0;
}
.bx--structured-list-th{
  width: 200px;
  font-weight: bolder;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: inline-block;
 
}
.bx--structured-list-td{
  width: 200px;
  display:inline-block;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

button{
  display: inline-block;
  background-color: #6D5BD0;
  box-shadow: 1px 1px 2px 2px #C6C2DE;
  border-radius: 5px;
  border:none;
  color: white;
  width:80px;
  height: 40px;
  
}
#svelte{
  border: 0px solid #C6C2DE;
  box-shadow: 1px 1px 2px 2px #C6C2DE;
  background-color: white;
  border-radius: 5px;
}
.bx--structured-list-tbody{
  text-align: center;
  justify-content:center; 
}
 


.bx--structured-list-row:hover{
  background-color:#dfdff7;
  background-image:linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,.7) 100%);
  background-repeat:no-repeat;
  background-size: 200% 100%; 
  transition:background-size 1s, background-color 1s;
}
.header{
  text-align-last: justify;
  justify-content:center; 
  
  margin: 10px;
}
</style>