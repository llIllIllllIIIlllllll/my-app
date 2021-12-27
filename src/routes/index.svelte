
<TextInput bind:value={player1} labelText="player1" placeholder="Enter user name..." />
<TextInput bind:value={player2} labelText="player2" placeholder="Enter user name..." />

<Select labelText="map" bind:selected={map}>
  <SelectItem value="투혼" text="투혼" />
  <SelectItem value="폴리" text="폴리" />
  <SelectItem value="이클" text="이클" />
  
</Select>


<RadioButtonGroup
  orientation="vertical"
  legendText="승 선택"
  bind:selected={w}
>
  <RadioButton labelText="player1" value="player1" />
  <RadioButton labelText="player2" value="player2" />

</RadioButtonGroup>


<button on:click={addMatch}>Add</button>




<DataTable
size="compact"
expandable
headers={[  { key: 'player1', value: 'player1' },  { key: 'player2', value: 'player2' },  { key: 'map', value: 'map' },  { key: 'w', value: 'w' }]}
rows={allMatchs}
>
<div slot="expanded-row" let:row>
  <pre>
    {JSON.stringify(row, null,1)}
    
  </pre>
</div>
</DataTable>



{#if $authStore.firebaseControlled}
 {#if !$authStore.isLoggedIn}
 <button on:click={login}>login google</button>


{:else}
<button on:click={logout}>logout google</button>


{/if}

{/if}



<slot></slot>



  






<input type="text" placeholder="Add a task" bind:value={task} />

<button on:click={addTodo}>Add</button>




<svelte:window on:keydown={keyIsPressed} />


<svelte:head><link rel="stylesheet" href="https://unpkg.com/carbon-components-svelte@0.50.2/css/white.css" /></svelte:head>

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
    deleteDoc,  
    doc,  
    onSnapshot, 
    updateDoc } from 'firebase/firestore';

 

    
import { onDestroy, onMount } from 'svelte';
import authStore from '$lib/authStore';
import { goto } from '$app/navigation';





let allMatchs=[];
const ref = collection(db,'match')
onSnapshot(ref,(sn)=>{
    let matchs =[];
sn.forEach((doc)=>{

 let match ={ ...doc.data(),id:doc.id};
 matchs=[match, ...matchs];
})
allMatchs = matchs;

})



let task = "";
  let error = "";
  const addTodo = async () => {
    if (task !== "") {
      const docRef = await addDoc(collection(db, "todos"), {
        task: task,
        isComplete: false,
        createdAt: new Date(),
      });
      error = "";
    } else {
      error = "Task is empty";
    }
    task = "";
  };

  const keyIsPressed = (event) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };


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
    }
}








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
      DataTable,
      TextInput,
      RadioButtonGroup, 
      RadioButton, 
      Select, 
      SelectItem  } from "carbon-components-svelte";

    let w ="";
    let player1="";
    let player2="";
    let map = "";
    let addMatch= async ()=>{
    
    if (player1 !== "" && player2 !== "" && w !== "" && map !=="") {
      const docRef = await addDoc(collection(db, "match"), {
        player1:player1,
        player2:player2,
        w:w,
        map:map,
        createdAt: new Date(),
      });
      error = "";
    } else {
      error = "Task is empty";
    }
    player1 = "";
    player2 = "";
    map="";
    w="";


  };
 

</script>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<style>


</style>

