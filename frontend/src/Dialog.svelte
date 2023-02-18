<script lang="ts" context="module">

  let dialogs: { [key: string]: HTMLDialogElement } = {};

  /**
   * Show the dialog with the given name
   * @param name name of the dialog
   * @param asModal if true, show as modal
   */
  export const showDialog = (name: string, asModal: boolean) => {
    dialogs[name][asModal ? "showModal" : "show"]();
  }

  export const closeDialog = (name: string) => {
    dialogs[name].close();
  }


  export const clearForm = (name: string) => {
    (<HTMLFormElement>dialogs[name].querySelector("form")).reset();
  }

  export const ref = (name: string) => {
    return dialogs[name];
  } 
</script>

<script lang="ts">
  import { onMount } from "svelte";
  
  export let name: string = "";
  
  // let dialog: HTMLDialogElement;

  onMount(() => {
    let dialog = <HTMLDialogElement> document.getElementById(name);
		dialogs[name] = dialog;
	})

</script>

<dialog id='{name}'>
  <slot>
    <p>Content here please</p>
  </slot>
</dialog>

<style>
  dialog {
    /* display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; */
    padding: 10px;
    position: absolute;
    z-index: 999;
    top: 30%;
    left: 30%;
    transform: translate(-50%, -50%);
    background: black;
    max-width: 500px;
    border-radius: 1em;  
    border: 1px solid grey;
    color: white;
  }
</style>