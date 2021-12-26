

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


<ol>
  {#each alltodo as item}
    <li class:complete={item.isComplete}>
      <span>
        {item.task}
      </span>
      <span>
        <button on:click={() => markTodoAsComplete(item)}>✔</button>
        <button on:click={() => deleteTodo(item.id)}>✘</button>
      </span>
    </li>
  {:else}
    <p>No todos found</p>
  {/each}
  <p class="error">{error}</p>
</ol>

<svelte:window on:keydown={keyIsPressed} />

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





let alltodo=[];
const ref = collection(db,'todos')
onSnapshot(ref,(sn)=>{
    let todos=[];
sn.forEach((doc)=>{
 let todo ={ ...doc.data(),id:doc.id};
 todos=[todo, ...todos];
})
 alltodo = todos;


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
  const markTodoAsComplete = async (item) => {
    await updateDoc(doc(db, "todos", item.id), {
      isComplete: !item.isComplete,
    });
  };
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
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

 


   
  
</script>
<style>
  .complete {
    text-decoration: line-through;
  }
  .error {
    color: red;
  }
</style>